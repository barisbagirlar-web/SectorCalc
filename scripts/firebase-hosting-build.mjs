#!/usr/bin/env node
/**
 * Firebase Hosting (web frameworks) build entry.
 * Called by firebase.json hosting.build.command during deploy.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  acquireGlobalBuildLock,
  releaseGlobalBuildLock,
} from "./lib/global-build-lock.mjs";

const ROOT = process.cwd();
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
      NEXT_PUBLIC_SITE_URL:
        process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sectorcalc.com",
    },
  });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

/** Copy generated schemas into .next/server so Firebase SSR function can read them at runtime. */
function copySchemasToNextServer() {
  const srcSchemas = join(ROOT, "generated", "schemas");
  const dstSchemas = join(ROOT, ".next", "server", "generated", "schemas");
  if (existsSync(srcSchemas)) {
    cpSync(srcSchemas, dstSchemas, { recursive: true, force: true });
    console.log(`firebase-hosting-build: copied schemas → ${dstSchemas}`);
  } else {
    console.warn(`firebase-hosting-build: ${srcSchemas} not found — skipping schema copy`);
  }
}

const forceRebuild = process.env.DEPLOY_FORCE_REBUILD === "1";
const hasBuild = !forceRebuild && existsSync(BUILD_ID_PATH);

if (hasBuild) {
  copySchemasToNextServer();
  run("node", ["scripts/finalize-next-build.mjs"]);
  run("node", ["scripts/validate-next-build.mjs"]);
  console.log("firebase-hosting-build: reusing existing .next build for Firebase deploy.");
  process.exit(0);
}

acquireGlobalBuildLock("firebase-hosting-build");

try {
  console.log("firebase-hosting-build: running full npm run build pipeline…");
  run("npm", ["run", "build"]);

  copySchemasToNextServer();
} finally {
  releaseGlobalBuildLock();
}
