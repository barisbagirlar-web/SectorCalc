#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  closeSync,
  copyFileSync,
  existsSync,
  openSync,
  readFileSync,
  renameSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DEPLOY_LOCK_PATH = join(ROOT, ".next-deploy.lock");
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");
const NEXT_BIN_PATH = join(ROOT, "node_modules/.bin/next");
const NEXT_BIN_BACKUP_PATH = join(ROOT, "node_modules/.bin/next.firebase-backup");
const NEXT_DIST_BIN_PATH = join(ROOT, "node_modules/next/dist/bin/next");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
    },
    ...options,
  });
  return result.status ?? 1;
}

function acquireDeployLock() {
  try {
    const fd = openSync(DEPLOY_LOCK_PATH, "wx");
    closeSync(fd);
    return true;
  } catch {
    return false;
  }
}

function releaseDeployLock() {
  try {
    unlinkSync(DEPLOY_LOCK_PATH);
  } catch {
    // ignore
  }
}

function installNextBuildShim() {
  if (!existsSync(NEXT_DIST_BIN_PATH)) {
    console.error("deploy-production: node_modules/next/dist/bin/next is missing. Run npm install first.");
    process.exit(1);
  }

  if (!existsSync(NEXT_BIN_BACKUP_PATH)) {
    copyFileSync(NEXT_DIST_BIN_PATH, NEXT_BIN_BACKUP_PATH);
  }

  const shimLauncher = [
    "#!/usr/bin/env node",
    "const { spawnSync } = require('node:child_process');",
    "const { join } = require('node:path');",
    `const root = ${JSON.stringify(ROOT)};`,
    "const status = spawnSync(process.execPath, [join(root, 'scripts/next-firebase-deploy-shim.mjs'), ...process.argv.slice(2)], {",
    "  cwd: root,",
    "  stdio: 'inherit',",
    "  env: process.env,",
    "});",
    "process.exit(status.status ?? 1);",
    "",
  ].join("\n");

  try {
    unlinkSync(NEXT_BIN_PATH);
  } catch {
    // ignore missing wrapper
  }

  writeFileSync(NEXT_BIN_PATH, shimLauncher, "utf8");
  chmodSync(NEXT_BIN_PATH, 0o755);
  console.log("deploy-production: installed Next.js build shim for Firebase frameworks.");
}

function restoreNextBin() {
  if (!existsSync(NEXT_BIN_BACKUP_PATH) || !existsSync(NEXT_DIST_BIN_PATH)) {
    return false;
  }

  copyFileSync(NEXT_BIN_BACKUP_PATH, NEXT_DIST_BIN_PATH);
  chmodSync(NEXT_DIST_BIN_PATH, 0o755);

  try {
    unlinkSync(NEXT_BIN_PATH);
  } catch {
    // ignore
  }

  try {
    symlinkSync("../next/dist/bin/next", NEXT_BIN_PATH);
  } catch {
    copyFileSync(NEXT_DIST_BIN_PATH, NEXT_BIN_PATH);
    chmodSync(NEXT_BIN_PATH, 0o755);
  }

  console.log("deploy-production: restored original Next.js binary.");
  return true;
}

function ensureBuildReady() {
  if (run("node", ["scripts/finalize-next-build.mjs"]) !== 0) {
    return false;
  }
  return run("node", ["scripts/validate-next-build.mjs"]) === 0;
}

if (!acquireDeployLock()) {
  console.error("deploy-production: another deploy is already running (.next-deploy.lock).");
  console.error("deploy-production: run npm run stop:builds if the lock is stale.");
  process.exit(1);
}

let shimInstalled = false;

try {
  restoreNextBin();

  const forceRebuild = process.env.DEPLOY_FORCE_REBUILD === "1";
  const hasBuild = !forceRebuild && existsSync(BUILD_ID_PATH);

  if (!hasBuild) {
    console.log("deploy-production: running full npm run build pipeline…");
    if (run("npm", ["run", "prebuild"]) !== 0 || run("node", ["scripts/next-build-with-500-fallback.mjs"]) !== 0) {
      throw new Error("build failed.");
    }
  } else {
    console.log(`deploy-production: reusing existing build (${readFileSync(BUILD_ID_PATH, "utf8").trim()}).`);
  }

  if (!ensureBuildReady()) {
    throw new Error(".next output invalid — rerun with DEPLOY_FORCE_REBUILD=1");
  }

  installNextBuildShim();
  shimInstalled = true;

  console.log("deploy-production: deploying Firebase Hosting + Firestore rules…");

  // HACK: Hide the massive .next/cache directory so Firebase CLI doesn't copy/zip 3.5GB+ of useless cache.
  // Next.js runtime (Cloud Run) does not need .next/cache.
  let cacheHidden = false;
  const cachePath = join(ROOT, ".next/cache");
  const cacheBackupPath = join(ROOT, ".next-cache-backup");
  try {
    if (existsSync(cachePath)) {
      renameSync(cachePath, cacheBackupPath);
      cacheHidden = true;
      console.log("deploy-production: temporarily hid .next/cache (saves massive upload time).");
    }
  } catch (e) {
    console.error("deploy-production: failed to hide cache", e.message);
  }

  const deployStatus = run("firebase", [
    "deploy",
    "--only",
    "hosting,firestore:rules",
    "--project",
    "sectorcalc-bf412",
    "--force",
  ], {
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
      FIREBASE_FRAMEWORKS_BUILD_TARGET: "production",
      SECTORCALC_FIREBASE_REUSE_BUILD: "1",
      SECTORCALC_BUILD_LOCK_SKIP: "1",
    },
  });

  if (deployStatus !== 0) {
    throw new Error(`deploy failed with exit code ${deployStatus}`);
  }

  // Post-deploy: purge Fastly HTML surrogate-key so CDN serves fresh HTML immediately
  console.log("deploy-production: purging Fastly CDN cache (surrogate-key: html)…");
  const purgeStatus = run("node", ["scripts/purge-fastly-cache.mjs"]);
  if (purgeStatus !== 0) {
    // Warn but do not fail — CDN purge is best-effort; stale HTML clears naturally via short TTL
    console.warn("deploy-production: purge-fastly-cache exited non-zero (non-fatal).");
  }
} catch (error) {
  console.error(`deploy-production: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (shimInstalled) {
    restoreNextBin();
  }
  if (typeof cacheHidden !== 'undefined' && cacheHidden) {
    try {
      if (existsSync(cacheBackupPath)) {
        renameSync(cacheBackupPath, cachePath);
        console.log("deploy-production: restored .next/cache.");
      }
    } catch (e) {
      console.error("deploy-production: failed to restore cache", e.message);
    }
  }
  releaseDeployLock();
}
