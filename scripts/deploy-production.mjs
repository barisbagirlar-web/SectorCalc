#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  closeSync,
  copyFileSync,
  existsSync,
  openSync,
  readFileSync,
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
    if (run("npm", ["run", "build"]) !== 0) {
      console.error("deploy-production: build failed.");
      process.exit(1);
    }
  } else {
    console.log(`deploy-production: reusing existing build (${readFileSync(BUILD_ID_PATH, "utf8").trim()}).`);
  }

  if (!ensureBuildReady()) {
    console.error("deploy-production: .next output invalid — rerun with DEPLOY_FORCE_REBUILD=1");
    process.exit(1);
  }

  installNextBuildShim();
  shimInstalled = true;

  console.log("deploy-production: deploying Firebase Hosting + Firestore rules…");
  const deployStatus = run("firebase", [
    "deploy",
    "--only",
    "hosting,firestore:rules",
    "--project",
    "sectorcalc-bf412",
  ], {
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
      FIREBASE_FRAMEWORKS_BUILD_TARGET: "production",
      SECTORCALC_FIREBASE_REUSE_BUILD: "1",
      // Limit SSG on Firebase deploy — ~20k page tree exceeds build timeout.
      // Remaining pages render on first visit via ISR (revalidate=3600).
      SECTORCALC_FAST_PREVIEW_STATIC: "1",
    },
  });
  process.exit(deployStatus);
} finally {
  if (shimInstalled) {
    restoreNextBin();
  }
  releaseDeployLock();
}
