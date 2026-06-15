#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  closeSync,
  copyFileSync,
  existsSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const LOCK_PATH = join(ROOT, ".next-deploy.lock");
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");
const NEXT_BIN_PATH = join(ROOT, "node_modules/.bin/next");
const NEXT_BIN_BACKUP_PATH = join(ROOT, "node_modules/.bin/next.firebase-backup");

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

function acquireLock() {
  try {
    const fd = openSync(LOCK_PATH, "wx");
    closeSync(fd);
    return true;
  } catch {
    return false;
  }
}

function releaseLock() {
  try {
    unlinkSync(LOCK_PATH);
  } catch {
    // ignore
  }
}

function installNextBuildShim() {
  if (!existsSync(NEXT_BIN_PATH)) {
    console.error("deploy-production: node_modules/.bin/next is missing. Run npm install first.");
    process.exit(1);
  }
  if (!existsSync(NEXT_BIN_BACKUP_PATH)) {
    copyFileSync(NEXT_BIN_PATH, NEXT_BIN_BACKUP_PATH);
  }
  const shimLauncher = [
    "#!/usr/bin/env node",
    "const { spawnSync } = require('node:child_process');",
    "const { join } = require('node:path');",
    "const root = join(__dirname, '..', '..');",
    "const status = spawnSync(process.execPath, [join(root, 'scripts/next-firebase-deploy-shim.mjs'), ...process.argv.slice(2)], {",
    "  cwd: root,",
    "  stdio: 'inherit',",
    "  env: process.env,",
    "});",
    "process.exit(status.status ?? 1);",
    "",
  ].join("\n");
  writeFileSync(NEXT_BIN_PATH, shimLauncher, "utf8");
  chmodSync(NEXT_BIN_PATH, 0o755);
  console.log("deploy-production: installed Next.js build shim for Firebase frameworks.");
}

function restoreNextBin() {
  if (!existsSync(NEXT_BIN_BACKUP_PATH)) {
    return;
  }
  copyFileSync(NEXT_BIN_BACKUP_PATH, NEXT_BIN_PATH);
  chmodSync(NEXT_BIN_PATH, 0o755);
  console.log("deploy-production: restored original Next.js binary.");
}

if (!acquireLock()) {
  console.error("deploy-production: another deploy/build is already running (.next-deploy.lock).");
  process.exit(1);
}

let shimInstalled = false;

try {
  const forceRebuild = process.env.DEPLOY_FORCE_REBUILD === "1";
  const hasBuild = !forceRebuild && existsSync(BUILD_ID_PATH);

  if (!hasBuild) {
    console.log("deploy-production: building with fallback wrapper…");
    run("node", ["scripts/next-build-with-500-fallback.mjs"]);
    if (!existsSync(BUILD_ID_PATH)) {
      console.error("deploy-production: build failed.");
      process.exit(1);
    }
    run("node", ["scripts/ensure-500-export.mjs"]);
  } else {
    console.log(`deploy-production: reusing existing build (${readFileSync(BUILD_ID_PATH, "utf8").trim()}).`);
    run("node", ["scripts/ensure-500-export.mjs"]);
  }

  installNextBuildShim();
  shimInstalled = true;

  console.log("deploy-production: clearing .next before Firebase frameworks rebuild…");
  run("rm", ["-rf", join(ROOT, ".next")]);

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
    },
  });
  process.exit(deployStatus);
} finally {
  if (shimInstalled) {
    restoreNextBin();
  }
  releaseLock();
}
