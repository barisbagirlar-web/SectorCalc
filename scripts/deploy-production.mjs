#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { closeSync, existsSync, openSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const LOCK_PATH = join(ROOT, ".next-deploy.lock");
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");

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

if (!acquireLock()) {
  console.error("deploy-production: another deploy/build is already running (.next-deploy.lock).");
  process.exit(1);
}

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
  releaseLock();
}
