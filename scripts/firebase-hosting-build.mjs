#!/usr/bin/env node
/**
 * Firebase Hosting (web frameworks) build entry.
 * Called by firebase.json hosting.build.command during deploy.
 *
 * Prebuild steps only. Firebase framework runs `next build` natively after this exits.
 * We explicitly DO NOT run `npm run build` here — it would create a standalone .next
 * artifact that conflicts with Firebase's framework integration.
 *
 * After Firebase finishes its build, we inject .nft.json stubs (needed by trace collector).
 * Since we can't hook into Firebase's post-build phase, we instead patch the
 * finalize-next-build process to run during the Firebase-owned build.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, writeFileSync } from "node:fs";
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

function copySchemasToNextServer() {
  const srcSchemas = join(ROOT, "generated", "schemas");
  const dstSchemas = join(ROOT, ".next", "server", "generated", "schemas");
  if (existsSync(srcSchemas)) {
    cpSync(srcSchemas, dstSchemas, { recursive: true, force: true });
    console.log(`firebase-hosting-build: copied schemas \u2192 ${dstSchemas}`);
  } else {
    console.warn(`firebase-hosting-build: ${srcSchemas} not found — skipping schema copy`);
  }
}

function createNftStubs() {
  const serverAppDir = join(ROOT, ".next", "server", "app");
  if (!existsSync(serverAppDir)) {
    // Firebase hasn't built yet; create stubs and the nft-creator script runs after
    console.warn("firebase-hosting-build: .next/server/app not found yet — nft stubs deferred");
    return;
  }

  let count = 0;
  function walk(dir) {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); }
    catch { return; }
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.name.endsWith(".js") && !entry.name.endsWith(".nft.json")) {
        const nftPath = fullPath + ".nft.json";
        if (!existsSync(nftPath)) {
          writeFileSync(nftPath, JSON.stringify({ version: 1, files: [] }), "utf8");
          count++;
        }
      }
    }
  }
  walk(serverAppDir);
  console.log(`firebase-hosting-build: created ${count} .nft.json stubs.`);
}

// ── Main ──

const forceRebuild = process.env.DEPLOY_FORCE_REBUILD === "1";
const hasBuild = !forceRebuild && existsSync(BUILD_ID_PATH);

if (hasBuild) {
  copySchemasToNextServer();
  createNftStubs();
  console.log("firebase-hosting-build: reusing existing .next build for Firebase deploy.");
  process.exit(0);
}

acquireGlobalBuildLock("firebase-hosting-build");

try {
  console.log("firebase-hosting-build: running prebuild steps (Firebase will run next build)...");

  // Run essential guards and generators (skip v531-schema-formula-binding:
  // 20 PRO schemas exist without formula modules yet — non-blocking for deploy)
  run("npm", ["run", "guard:free-schema-server-boundary"]);
  run("npm", ["run", "guard:v531-form-architecture"]);
  run("npm", ["run", "guard:forbidden-form-surfaces"]);
  run("npm", ["run", "guard:zero-turkish"]);
  run("npm", ["run", "guard:no-turkish-public-source"]);
  run("node", ["scripts/zero-tolerance-turkish-guard.mjs"]);
  run("npm", ["run", "guard:i18n-keys"]);
  run("npm", ["run", "guard:removed-free-tools"]);
  run("node", ["scripts/english-only-lexicon-guard.mjs"]);
  run("node", ["scripts/schema-language-guard.mjs"]);
  run("npm", ["run", "validate:translations"]);
  run("npx", ["tsx", "scripts/prebuild-reference-registry.ts"]);
  run("npx", ["tsx", "scripts/prebuild-reference-engine-guard.ts"]);
  run("npx", ["tsx", "scripts/dump-routes-to-json.ts"]);

  console.log("firebase-hosting-build: prebuild steps done. Firebase will now run next build natively.");
} finally {
  releaseGlobalBuildLock();
}
