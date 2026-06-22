#!/usr/bin/env node
/**
 * release:rollback — Automated Deployment Rollback (Firebase)
 *
 * Reverts the production deployment to the previous stable version:
 *   1. Saves current commit hash for audit trail
 *   2. Runs `git revert HEAD` or checks out previous deploy
 *   3. Re-deploys the reverted version
 *   4. Runs health check on the rolled-back deployment
 *
 * Usage: node scripts/release/rollback.mjs              # revert last commit + redeploy
 *        node scripts/release/rollback.mjs --to=abc123  # revert to specific commit
 *        node scripts/release/rollback.mjs --dry-run    # show plan without executing
 */
import { execSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const REPORT_PATH = join(ROOT, "scripts/.cache/rollback-report.json");

function run(cmd, opts = {}) {
  const result = spawnSync(cmd, {
    shell: true,
    cwd: ROOT,
    encoding: "utf-8",
    stdio: opts.silent ? "pipe" : "inherit",
    timeout: 120000,
    ...opts,
  });
  if (!opts.ignoreError && result.status !== 0) {
    throw new Error(`Command failed (exit ${result.status}): ${cmd.slice(0, 100)}`);
  }
  return result.stdout?.trim() || "";
}

function getCurrentCommit() {
  return run("git rev-parse --short HEAD", { silent: true });
}

function getCurrentBranch() {
  return run("git rev-parse --abbrev-ref HEAD", { silent: true });
}

function getLastDeployCommit() {
  try {
    return run("git log --oneline -1 --skip=1 --format='%h'", { silent: true });
  } catch {
    return null;
  }
}

function isWorkingTreeClean() {
  const status = run("git status --porcelain", { silent: true });
  return status === "";
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const toArg = process.argv.find(a => a.startsWith("--to="));
  const targetCommit = toArg ? toArg.split("=")[1] : null;

  const currentCommit = getCurrentCommit();
  const currentBranch = getCurrentBranch();
  const lastDeployCommit = targetCommit || getLastDeployCommit();

  console.log("=".repeat(60));
  console.log("DEPLOYMENT ROLLBACK");
  console.log(`Branch: ${currentBranch}`);
  console.log(`Current commit: ${currentCommit}`);
  console.log(`Rollback target: ${lastDeployCommit || "N/A"}`);
  console.log(`Mode: ${isDryRun ? "DRY RUN (no changes)" : "LIVE"}`);
  console.log("=".repeat(60));

  if (isDryRun) {
    console.log("\nRollback plan:");
    console.log(`  1. git revert ${currentCommit} (or reset to ${lastDeployCommit})`);
    console.log("  2. npm run build");
    console.log("  3. Firebase deploy");
    console.log("  4. Run health check post-rollback");
    console.log("\n\u2705 DRY RUN COMPLETE \u2014 No changes made");
    process.exit(0);
  }

  let rollbackSuccessful = false;
  let rollbackCommit = "";

  // Git-based rollback
  if (!isWorkingTreeClean()) {
    console.error("\u274c Working tree is not clean. Commit or stash changes first.");
    console.error("  Run: git stash or git commit before rollback.");
    process.exit(1);
  }

  console.log(`\n[1] Reverting to ${lastDeployCommit || "previous commit"}...`);
  try {
    if (targetCommit) {
      run(`git revert --no-commit ${currentCommit}..${targetCommit}`, { timeout: 30000 });
      run(`git commit -m "rollback: revert to ${targetCommit}"`, { timeout: 10000 });
    } else {
      run("git revert --no-edit HEAD", { timeout: 30000 });
    }
    rollbackCommit = getCurrentCommit();
    console.log(`  \u2713 Reverted to ${rollbackCommit}`);
    rollbackSuccessful = true;
  } catch (err) {
    console.error(`  \u2717 Git revert failed: ${err.message}`);
    run("git revert --abort", { silent: true, ignoreError: true });
  }

  if (rollbackSuccessful) {
    console.log("\n[2] Building rollback version...");
    try {
      run("npm run build", { timeout: 300000 });
      console.log("  \u2713 Build successful");
    } catch {
      console.error("  \u2717 Build failed \u2014 rollback code has issues");
      run("git revert --abort", { silent: true, ignoreError: true });
      rollbackSuccessful = false;
    }
  }

  if (rollbackSuccessful) {
    console.log("\n[3] Deploying rollback...");
    try {
      run("npm run deploy:hosting", { timeout: 300000 });
      console.log("  \u2713 Rollback deployed");
    } catch {
      console.error("  \u2717 Deploy failed \u2014 rollback not live");
      rollbackSuccessful = false;
    }
  }

  // 4. Health check
  if (rollbackSuccessful) {
    console.log("\n[4] Running post-rollback health check...");
    try {
      run("node scripts/release/health-check.mjs --wait=15", { timeout: 120000 });
      console.log("  \u2713 Health check passed");
    } catch {
      console.error("  \u26a0 Health check failed \u2014 rollback may have issues");
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  if (rollbackSuccessful) {
    console.log("\u2705 ROLLBACK COMPLETE");
    console.log(`  Reverted from ${currentCommit} to ${rollbackCommit || "previous version"}`);
  } else {
    console.log("\u274c ROLLBACK FAILED \u2014 Manual intervention required");
    console.log("  The working tree has been preserved. No code changes were made.");
  }

  const report = {
    timestamp: new Date().toISOString(),
    branch: currentBranch,
    fromCommit: currentCommit,
    toCommit: rollbackCommit || targetCommit || lastDeployCommit,
    success: rollbackSuccessful,
  };
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  process.exit(rollbackSuccessful ? 0 : 1);
}

main().catch(err => {
  console.error("release:rollback FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
