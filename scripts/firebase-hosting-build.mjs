#!/usr/bin/env node
/**
 * Firebase Hosting (web frameworks) build entry.
 * Called by firebase.json hosting.build.command during deploy.
 *
 * n8n Node: This is the SINGLE build node in the deploy pipeline.
 * It runs the full build with retry/OOM protection, finalizes the
 * standalone, and leaves .next/ ready for Firebase framework to package.
 *
 * Firebase framework integration detects .next/BUILD_ID after this exits,
 * then creates the SSR function AND hosting files from the SAME .next/.
 * This eliminates the split-brain bug where hosting and function came from
 * different builds (caused by the old shim mechanism).
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");
const SERVER_APP_DIR = join(ROOT, ".next", "server", "app");

// ── Schema copy (always needed for server-side schema loader) ─────────

function copySchemasToNextServer() {
  const srcSchemas = join(ROOT, "generated", "schemas");
  const dstSchemas = join(ROOT, ".next", "server", "generated", "schemas");
  if (existsSync(srcSchemas)) {
    cpSync(srcSchemas, dstSchemas, { recursive: true, force: true });
    console.log(`firebase-hosting-build: copied schemas → ${dstSchemas}`);
  }

  const srcProV531 = join(ROOT, "src/sectorcalc/schemas/pro-v531");
  const dstProV531 = join(ROOT, ".next/server/src/sectorcalc/schemas/pro-v531");
  if (existsSync(srcProV531)) {
    mkdirSync(join(ROOT, ".next/server/src/sectorcalc/schemas"), { recursive: true });
    cpSync(srcProV531, dstProV531, { recursive: true, force: true });
    console.log(`firebase-hosting-build: copied pro-v531 schemas → ${dstProV531}`);
  }

  const srcV531 = join(ROOT, "src/sectorcalc/schemas/v531");
  const dstV531 = join(ROOT, ".next/server/src/sectorcalc/schemas/v531");
  if (existsSync(srcV531)) {
    mkdirSync(join(ROOT, ".next/server/src/sectorcalc/schemas"), { recursive: true });
    cpSync(srcV531, dstV531, { recursive: true, force: true });
    console.log(`firebase-hosting-build: copied v531 schemas → ${dstV531}`);
  }
}

// ── NFT stubs (required by Firebase framework for function packaging) ──

function createNftStubs() {
  if (!existsSync(SERVER_APP_DIR)) {
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
  walk(SERVER_APP_DIR);
  console.log(`firebase-hosting-build: created ${count} .nft.json stubs.`);
}

// ── Prebuild guard runner (warn-only — non-blocking for deploy) ────────

const PREBUILD_GUARDS = [
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

function runPrebuildGuards() {
  for (const [cmd, args] of PREBUILD_GUARDS) {
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
      console.warn(`firebase-hosting-build: guard "${cmd} ${args.join(" ")}" failed — non-fatal.`);
    }
  }
}

// ── Build composer (runs next-build-with-500-fallback + finalize) ──────

function runBuildPipeline() {
  console.log("firebase-hosting-build: running full build pipeline (next-build-with-500-fallback)…");
  const buildResult = spawnSync("node", ["scripts/next-build-with-500-fallback.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192 --dns-result-order=ipv4first",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sectorcalc.com",
    },
  });

  if ((buildResult.status ?? 1) !== 0) {
    console.error("firebase-hosting-build: build pipeline FAILED.");
    return false;
  }

  console.log("firebase-hosting-build: running finalize-next-build…");
  const finalizeResult = spawnSync("node", ["scripts/finalize-next-build.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
  });

  if ((finalizeResult.status ?? 1) !== 0) {
    console.error("firebase-hosting-build: finalize FAILED.");
    return false;
  }

  return true;
}

// ── Main (single-build node) ───────────────────────────────────────────

const forceRebuild = process.env.DEPLOY_FORCE_REBUILD === "1";
const hasBuild = !forceRebuild && existsSync(BUILD_ID_PATH);

// Always run prebuild guards (non-blocking)
runPrebuildGuards();

if (hasBuild) {
  console.log(`firebase-hosting-build: reusing existing .next build (${existsSync(BUILD_ID_PATH) ? "BUILD_ID present" : "BUILD_ID missing"}).`);
  copySchemasToNextServer();
  createNftStubs();
  process.exit(0);
}

// No valid build — run the full pipeline
console.log("firebase-hosting-build: no valid .next build found — running full pipeline.");
if (!runBuildPipeline()) {
  process.exit(1);
}

// Post-build: ensure Firebase framework can package the function
copySchemasToNextServer();
createNftStubs();

console.log("firebase-hosting-build: done. Firebase framework will now package function + hosting from .next/");
process.exit(0);
