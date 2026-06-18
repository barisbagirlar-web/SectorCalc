#!/usr/bin/env node
/**
 * Firebase Hosting (web frameworks) build entry.
 * Called by firebase.json hosting.build.command during deploy.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  acquireGlobalBuildLock,
  releaseGlobalBuildLock,
} from "./lib/global-build-lock.mjs";

const ROOT = process.cwd();
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");
const NEXT_DIR = join(ROOT, ".next");

function ensureManifestStubs() {
  const typesDir = join(NEXT_DIR, "types");
  mkdirSync(typesDir, { recursive: true });

  const serverDir = join(NEXT_DIR, "server");
  mkdirSync(serverDir, { recursive: true });

  const stubs = {
    "build-manifest.json": { pages: {}, devFiles: [], ampDevFiles: [] },
    "types/routes.d.ts": "// stub\ntype AppRoutes = never;\ntype PageRoutes = never;\n",
    "server/pages-manifest.json": {},
    "server/middleware-manifest.json": {},
  };

  for (const [relPath, content] of Object.entries(stubs)) {
    const fullPath = join(NEXT_DIR, relPath);
    if (!existsSync(fullPath)) {
      writeFileSync(fullPath, typeof content === "string" ? content : JSON.stringify(content), "utf8");
    }
  }
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
      NEXT_PUBLIC_SITE_URL:
        process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.sectorcalc.com",
    },
  });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

const forceRebuild = process.env.DEPLOY_FORCE_REBUILD === "1";
const hasBuild = !forceRebuild && existsSync(BUILD_ID_PATH);

if (hasBuild) {
  run("node", ["scripts/finalize-next-build.mjs"]);
  run("node", ["scripts/validate-next-build.mjs"]);
  console.log("firebase-hosting-build: reusing existing .next build for Firebase deploy.");
  process.exit(0);
}

acquireGlobalBuildLock("firebase-hosting-build");

try {
  ensureManifestStubs();
  console.log("firebase-hosting-build: running full npm run build pipeline…");
  run("npm", ["run", "build"]);
} finally {
  releaseGlobalBuildLock();
}
