#!/usr/bin/env node
/**
 * Safe Vercel production deploy for sectorcalc.com
 *
 * Rules:
 * - Production web = Vercel (not Firebase Hosting for primary domain).
 * - `vercel --prod` uploads the LOCAL tree — never deploy with uncommitted changes.
 * - Prefer: commit + push to origin/main (Git integration) OR deploy from a clean worktree.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = process.cwd();
const VERCEL_TEAM = process.env.VERCEL_ORG_ID ?? "team_UG3Vpq2hOnaYU807DGwBjM8N";
const SMOKE_URLS = [
  "https://www.sectorcalc.com/",
  "https://www.sectorcalc.com/tr",
  "https://www.sectorcalc.com/en/tools",
];

/** @param {string} command @param {string[]} args @param {{ cwd?: string }} [options] */
function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? ROOT,
    stdio: "inherit",
    env: process.env,
  });
  return result.status ?? 1;
}

/** @returns {string} */
function runCapture(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  return (result.stdout ?? "").trim();
}

function assertGitAvailable() {
  if (runCapture("git", ["rev-parse", "--is-inside-work-tree"]) !== "true") {
    console.error("deploy-vercel-production: not a git repository.");
    process.exit(1);
  }
}

function fetchOrigin() {
  console.log("deploy-vercel-production: fetching origin…");
  if (run("git", ["fetch", "origin", "main"]) !== 0) {
    process.exit(1);
  }
}

/** @returns {boolean} */
function workingTreeClean() {
  const status = runCapture("git", ["status", "--porcelain"]);
  return status.length === 0;
}

function assertOnMainSynced() {
  const branch = runCapture("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (branch !== "main") {
    console.error(`deploy-vercel-production: expected branch main, got ${branch}.`);
    process.exit(1);
  }

  const aheadBehind = runCapture("git", ["rev-list", "--left-right", "--count", "origin/main...HEAD"]);
  const [behindRaw, aheadRaw] = aheadBehind.split(/\s+/);
  const behind = Number(behindRaw ?? 0);
  const ahead = Number(aheadRaw ?? 0);

  if (behind > 0) {
    console.error("deploy-vercel-production: local main is behind origin/main — run git pull first.");
    process.exit(1);
  }

  if (ahead > 0) {
    console.error("deploy-vercel-production: local main is ahead of origin/main — push before deploy.");
    process.exit(1);
  }
}

/** @returns {string} */
function createOriginWorktree() {
  const dir = mkdtempSync(join(tmpdir(), "sectorcalc-deploy-"));
  const sha = runCapture("git", ["rev-parse", "origin/main"]);
  console.log(`deploy-vercel-production: creating clean worktree at ${dir} (${sha.slice(0, 7)})…`);
  if (run("git", ["worktree", "add", "--detach", dir, "origin/main"]) !== 0) {
    rmSync(dir, { recursive: true, force: true });
    process.exit(1);
  }

  const vercelDir = join(ROOT, ".vercel");
  if (existsSync(vercelDir)) {
    cpSync(vercelDir, join(dir, ".vercel"), { recursive: true });
    console.log("deploy-vercel-production: copied .vercel project link into worktree.");
  }

  return dir;
}

function smokeProduction() {
  console.log("deploy-vercel-production: smoke-checking production URLs…");
  let failed = false;

  for (const url of SMOKE_URLS) {
    const result = spawnSync("curl", ["-sL", "-o", "/dev/null", "-w", "%{http_code}", url], {
      encoding: "utf8",
    });
    const code = (result.stdout ?? "").trim();
    const ok = code === "200" || code === "308";
    console.log(`  ${ok ? "✓" : "✗"} ${url} → ${code}`);
    if (!ok) {
      failed = true;
    }
  }

  if (failed) {
    console.error("deploy-vercel-production: smoke check failed.");
    console.error("Rollback: vercel rollback <previous-deployment-url> --scope", VERCEL_TEAM, "--yes");
    process.exit(1);
  }
}

function deployFromCwd(cwd) {
  console.log(`deploy-vercel-production: deploying from ${cwd}…`);
  const status = run(
    "vercel",
    ["deploy", "--prod", "--yes", "--scope", VERCEL_TEAM],
    { cwd },
  );
  if (status !== 0) {
    process.exit(status);
  }
}

assertGitAvailable();
fetchOrigin();

const skipCleanCheck =
  process.env.ALLOW_DIRTY_DEPLOY === "1" || process.env.DEPLOY_FROM_ORIGIN === "1";
const forceWorktree = process.env.DEPLOY_FROM_ORIGIN === "1";
const clean = workingTreeClean();

if (!clean && !skipCleanCheck) {
  console.error("deploy-vercel-production: working tree is dirty.");
  console.error("Commit/stash first, DEPLOY_FROM_ORIGIN=1 (origin/main worktree), or ALLOW_DIRTY_DEPLOY=1.");
  console.error("(ALLOW_DIRTY_DEPLOY=1 deploys the local tree — not recommended.)");
  process.exit(1);
}

if (run("npm", ["run", "check:secrets"]) !== 0) {
  process.exit(1);
}

let worktreeDir = "";

try {
  if (forceWorktree) {
    worktreeDir = createOriginWorktree();
    deployFromCwd(worktreeDir);
  } else if (!clean && skipCleanCheck) {
    console.warn("deploy-vercel-production: deploying local working tree (ALLOW_DIRTY_DEPLOY=1)…");
    deployFromCwd(ROOT);
  } else {
    assertOnMainSynced();
    deployFromCwd(ROOT);
  }

  smokeProduction();
  console.log("deploy-vercel-production: done.");
} finally {
  if (worktreeDir && existsSync(worktreeDir)) {
    run("git", ["worktree", "remove", "--force", worktreeDir]);
    rmSync(worktreeDir, { recursive: true, force: true });
  }
}
