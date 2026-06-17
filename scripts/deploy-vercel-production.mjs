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
const ROLLBACK_DEPLOYMENT_URL =
  process.env.SECTORCALC_ROLLBACK_DEPLOYMENT_URL ??
  "sectorcalc-a2uxphhd9-barisbagirlar-webs-projects.vercel.app";
const HOMEPAGE_LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
const SMOKE_URLS = [
  "https://www.sectorcalc.com/",
  "https://www.sectorcalc.com/tr",
  "https://www.sectorcalc.com/en/tools",
];
const CASE_STUDIES_SMOKE_URLS = [
  "https://www.sectorcalc.com/case-studies",
  "https://www.sectorcalc.com/tr/case-studies",
  "https://www.sectorcalc.com/de/case-studies",
  "https://www.sectorcalc.com/fr/case-studies",
  "https://www.sectorcalc.com/es/case-studies",
  "https://www.sectorcalc.com/ar/case-studies",
  "https://www.sectorcalc.com/tr/case-studies/muller-prazision-5s-optimization",
  "https://www.sectorcalc.com/data/case-studies.csv",
];
const DEPLOY_POLL_MS = 30_000;
const DEPLOY_MAX_WAIT_MS = 45 * 60_000;

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

/** @param {string} deploymentUrl */
function inspectDeployment(deploymentUrl) {
  const args = ["inspect", deploymentUrl, "--scope", VERCEL_TEAM];
  const result = spawnSync("vercel", args, {
    cwd: ROOT,
    encoding: "utf8",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  return `${result.stdout ?? ""}${result.stderr ?? ""}`;
}

/** @param {string} text */
function parseDeploymentStatus(text) {
  const match = text.match(/status\s+●\s+(Ready|Building|Error|Queued)/i);
  return match?.[1] ?? "Unknown";
}

/** @param {string} text */
function deploymentHasLambdaBuild(text) {
  return /λ\s+index|output items hidden/i.test(text);
}

/** @param {string} deploymentUrl */
function waitForDeploymentReady(deploymentUrl) {
  const started = Date.now();
  console.log(`deploy-vercel-production: waiting for ${deploymentUrl}…`);

  while (Date.now() - started < DEPLOY_MAX_WAIT_MS) {
    const inspectText = inspectDeployment(deploymentUrl);
    const status = parseDeploymentStatus(inspectText);

    if (status === "Ready") {
      if (!deploymentHasLambdaBuild(inspectText)) {
        console.error("deploy-vercel-production: deployment is Ready but has no Next.js lambda build output.");
        console.error("Refusing to treat this as a healthy production build (prevents www 404).");
        process.exit(1);
      }
      console.log("deploy-vercel-production: deployment Ready with lambda build output.");
      return;
    }

    if (status === "Error") {
      console.error("deploy-vercel-production: deployment failed on Vercel.");
      process.exit(1);
    }

    console.log(`deploy-vercel-production: status=${status}, polling again in ${DEPLOY_POLL_MS / 1000}s…`);
    spawnSync("sleep", [`${DEPLOY_POLL_MS / 1000}`]);
  }

  console.error("deploy-vercel-production: timed out waiting for deployment.");
  process.exit(1);
}

function rollbackProduction() {
  console.error(`deploy-vercel-production: rolling back to ${ROLLBACK_DEPLOYMENT_URL}…`);
  const args = ["promote", ROLLBACK_DEPLOYMENT_URL, "--yes", "--scope", VERCEL_TEAM];
  const result = spawnSync("vercel", args, { cwd: ROOT, stdio: "inherit", env: process.env });
  if (result.status !== 0) {
    console.error("deploy-vercel-production: rollback command failed — fix www manually in Vercel dashboard.");
    process.exit(result.status ?? 1);
  }
}

function smokeProduction() {
  console.log("deploy-vercel-production: smoke-checking production URLs…");
  let failed = false;

  for (const url of [...SMOKE_URLS, ...CASE_STUDIES_SMOKE_URLS]) {
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
    rollbackProduction();
    process.exit(1);
  }
}

function verifyCaseStudiesAcademicSurface() {
  console.log("deploy-vercel-production: verifying academic case-studies surface…");
  let failed = false;

  for (const url of CASE_STUDIES_SMOKE_URLS) {
    if (url.endsWith(".csv")) {
      continue;
    }

    const result = spawnSync(
      "curl",
      ["-sL", "-H", "x-vercel-skip-cache: 1", url],
      { encoding: "utf8" },
    );
    const html = result.stdout ?? "";
    const isDetail = url.includes("/case-studies/");
    const hasAcademic = html.includes("academic-database");
    const hasTable = isDetail ? html.includes("record-meta-table") : html.includes("data-table");
    const ok = html.length > 1000 && hasAcademic && hasTable;

    console.log(`  ${ok ? "✓" : "✗"} ${url} (academic=${hasAcademic}, table=${hasTable})`);
    if (!ok) {
      failed = true;
    }
  }

  if (failed) {
    console.error("deploy-vercel-production: academic case-studies verification failed.");
    rollbackProduction();
    process.exit(1);
  }
}

function verifyHomepageToolCounts() {
  console.log("deploy-vercel-production: verifying homepage tool counts on www…");
  let failed = false;

  for (const locale of HOMEPAGE_LOCALES) {
    const url = `https://www.sectorcalc.com/${locale}`;
    const result = spawnSync(
      "curl",
      ["-sL", "-H", "x-vercel-skip-cache: 1", url],
      { encoding: "utf8" },
    );
    const html = result.stdout ?? "";
    const httpOk = html.length > 1000 && !/NOT_FOUND|x-vercel-error/i.test(html);
    const hasFreeCount = /sc-trace-intro__feature[\s\S]{0,400}\d{3,}/i.test(html);
    const hasStaleTraceCopy = />Her zaman ücretsiz</i.test(html);

    const ok = httpOk && hasFreeCount && !hasStaleTraceCopy;
    console.log(`  ${ok ? "✓" : "✗"} ${url} (counts in trace=${hasFreeCount}, stale copy=${hasStaleTraceCopy})`);
    if (!ok) {
      failed = true;
    }
  }

  if (failed) {
    console.error("deploy-vercel-production: homepage tool-count verification failed.");
    rollbackProduction();
    process.exit(1);
  }
}

/** @param {string} cwd @returns {string} */
function deployFromCwd(cwd) {
  console.log(`deploy-vercel-production: deploying from ${cwd}…`);
  const args = ["deploy", "--prod", "--yes"];
  const scope = process.env.VERCEL_SCOPE?.trim();
  if (scope) {
    args.push("--scope", scope);
  }

  const result = spawnSync("vercel", args, {
    cwd,
    encoding: "utf8",
    env: process.env,
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    process.exit(result.status ?? 1);
  }

  const combined = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");

  const urlMatch = combined.match(/https:\/\/sectorcalc-[a-z0-9-]+\.vercel\.app/i);
  if (!urlMatch) {
    console.error("deploy-vercel-production: could not parse deployment URL from vercel CLI output.");
    process.exit(1);
  }

  const deploymentUrl = urlMatch[0].replace(/^https:\/\//, "");
  waitForDeploymentReady(deploymentUrl);
  return deploymentUrl;
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
  verifyCaseStudiesAcademicSurface();
  verifyHomepageToolCounts();
  console.log("deploy-vercel-production: done.");
} finally {
  if (worktreeDir && existsSync(worktreeDir)) {
    run("git", ["worktree", "remove", "--force", worktreeDir]);
    rmSync(worktreeDir, { recursive: true, force: true });
  }
}
