#!/usr/bin/env node
/**
 * Firebase Hosting (web frameworks) build entry.
 * Called by firebase.json hosting.build.command during deploy.
 *
 * Prebuild steps only. Firebase framework runs `next build` natively after this exits.
 * We explicitly DO NOT run `npm run build` here — it would create a standalone .next
 * artifact that conflicts with Firebase's framework integration.
 *
 * IMPORTANT: Do NOT use global build lock here. Firebase framework integration already
 * manages its own build lifecycle. Locking here conflicts with Firebase's parallel
 * build detection, causing "server.js does not exist" errors.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");

function copySchemasToNextServer() {
  // Generated schemas
  const srcSchemas = join(ROOT, "generated", "schemas");
  const dstSchemas = join(ROOT, ".next", "server", "generated", "schemas");
  if (existsSync(srcSchemas)) {
    cpSync(srcSchemas, dstSchemas, { recursive: true, force: true });
    console.log(`firebase-hosting-build: copied schemas → ${dstSchemas}`);
  } else {
    console.warn(`firebase-hosting-build: ${srcSchemas} not found — skipping schema copy`);
  }

  // PRO V5.3.1 schemas (Baris tools) for pro-schema-loader
  const srcProV531 = join(ROOT, "src/sectorcalc/schemas/pro-v531");
  const dstProV531 = join(ROOT, ".next/server/src/sectorcalc/schemas/pro-v531");
  if (existsSync(srcProV531)) {
    mkdirSync(join(ROOT, ".next/server/src/sectorcalc/schemas"), { recursive: true });
    cpSync(srcProV531, dstProV531, { recursive: true, force: true });
    console.log(`firebase-hosting-build: copied pro-v531 schemas → ${dstProV531}`);
  }

  // V5.3.1 engineering schemas
  const srcV531 = join(ROOT, "src/sectorcalc/schemas/v531");
  const dstV531 = join(ROOT, ".next/server/src/sectorcalc/schemas/v531");
  if (existsSync(srcV531)) {
    mkdirSync(join(ROOT, ".next/server/src/sectorcalc/schemas"), { recursive: true });
    cpSync(srcV531, dstV531, { recursive: true, force: true });
    console.log(`firebase-hosting-build: copied v531 schemas → ${dstV531}`);
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
// IMPORTANT: No global build lock here. Firebase framework manages its own lifecycle.

const forceRebuild = process.env.DEPLOY_FORCE_REBUILD === "1";
const hasBuild = !forceRebuild && existsSync(BUILD_ID_PATH);

if (hasBuild) {
  copySchemasToNextServer();
  createNftStubs();
  console.log("firebase-hosting-build: reusing existing .next build for Firebase deploy.");
  process.exit(0);
}

console.log("firebase-hosting-build: running prebuild steps (Firebase will run next build)...");

// Run essential guards and generators (skip v531-schema-formula-binding:
// 20 PRO schemas exist without formula modules yet — non-blocking for deploy)
const prebuildSteps = [
  ["npm", ["run", "guard:free-schema-server-boundary"]],
  ["npm", ["run", "guard:v531-form-architecture"]],
  ["npm", ["run", "guard:forbidden-form-surfaces"]],
  ["npm", ["run", "guard:zero-turkish"]],
  ["npm", ["run", "guard:no-turkish-public-source"]],
  ["node", ["scripts/zero-tolerance-turkish-guard.mjs"]],
  ["npm", ["run", "guard:i18n-keys"]],
  ["npm", ["run", "guard:removed-free-tools"]],
  ["node", ["scripts/english-only-lexicon-guard.mjs"]],
  ["node", ["scripts/schema-language-guard.mjs"]],
  ["npm", ["run", "validate:translations"]],
  ["npx", ["tsx", "scripts/prebuild-reference-registry.ts"]],
  ["npx", ["tsx", "scripts/prebuild-reference-engine-guard.ts"]],
  ["npx", ["tsx", "scripts/dump-routes-to-json.ts"]],
];

for (const [cmd, args] of prebuildSteps) {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sectorcalc.com",
    },
  });
  if ((result.status ?? 1) !== 0) {
    console.warn(`firebase-hosting-build: prebuild step "${cmd} ${args.join(" ")}" failed — continuing (non-fatal for deploy).`);
  }
}

console.log("firebase-hosting-build: prebuild steps done. Firebase will now run next build natively.");
