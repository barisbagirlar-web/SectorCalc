#!/usr/bin/env node
/**
 * Vercel production build entry — deterministic clean, artifact sync, fallback Next build.
 *
 * Why not bare `next build`:
 * - Large SSG trees hit MODULE_NOT_FOUND races (missing page.js / manifests).
 * - `generated/` is gitignored; registry must be regenerated from committed schemas.
 * - Preview/production on Vercel must cap static params to stay within memory/time limits.
 *
 * Fast-build env (defaults ON for VERCEL=1 — override with =0):
 * - SECTORCALC_SKIP_TEST_GENERATED=1 — skip 3300+ sequential import test
 * - SECTORCALC_SKIP_GENERATE_ALL=1 — skip generate:all when artifacts complete (=0 force regen)
 * - SECTORCALC_KEEP_NEXT_CACHE=1 — keep .next for Vercel incremental cache (=0 force clean)
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { cleanNextArtifacts } from "../clean-next-artifacts.mjs";
import {
  describeGeneratedArtifactState,
  registryParityOk,
} from "./generated-artifact-parity.mjs";

const ROOT = process.cwd();
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const REGISTRY_FILE = join(ROOT, "src/lib/generated-tools/calculator-registry.ts");

/** @param {string} name @param {boolean} defaultOnVercel */
function envEnabled(name, defaultOnVercel) {
  const value = process.env[name];
  if (value === "1" || value === "true") {
    return true;
  }
  if (value === "0" || value === "false") {
    return false;
  }
  return defaultOnVercel && process.env.VERCEL === "1";
}

/** @param {string} command @param {string[]} args */
function runStep(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=6144",
    },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function configureVercelBuildEnv() {
  if (process.env.VERCEL !== "1") {
    return;
  }

  // Cap SSG on Vercel unless explicitly overridden (22k+ pages OOM/ENOENT on Hobby/Pro).
  if (process.env.SECTORCALC_FORCE_FULL_STATIC !== "1" && process.env.SECTORCALC_VERCEL_BUILD_LIMIT !== "0") {
    process.env.SECTORCALC_VERCEL_BUILD_LIMIT = "1";
  }
}

function assertRegistryParity() {
  if (!existsSync(SCHEMAS_DIR) || !existsSync(REGISTRY_FILE)) {
    return;
  }

  if (!registryParityOk()) {
    const state = describeGeneratedArtifactState();
    console.error(
      `run-vercel-build: registry parity failed — ${state.loaderCount} loaders vs ${state.toolCount} generated tools (${state.schemaCount} schemas)`,
    );
    process.exit(1);
  }

  const state = describeGeneratedArtifactState();
  console.log(
    `run-vercel-build: registry parity OK — ${state.loaderCount} loaders, ${state.toolCount} tools, ${state.schemaCount} schemas`,
  );
}

function logFastBuildFlags() {
  const skipTest = envEnabled("SECTORCALC_SKIP_TEST_GENERATED", true);
  const keepCache = envEnabled("SECTORCALC_KEEP_NEXT_CACHE", true);
  const skipGenerate = process.env.SECTORCALC_SKIP_GENERATE_ALL ?? "auto";
  console.log(
    `run-vercel-build: fast flags — skipTest=${skipTest}, keepNextCache=${keepCache}, skipGenerateAll=${skipGenerate}`,
  );
}

function main() {
  configureVercelBuildEnv();
  logFastBuildFlags();

  const shouldCleanNext =
    process.env.VERCEL === "1" && !envEnabled("SECTORCALC_KEEP_NEXT_CACHE", true);

  if (shouldCleanNext) {
    console.log("run-vercel-build: cleaning .next for deterministic Vercel SSG");
    cleanNextArtifacts();
  } else if (process.env.VERCEL === "1") {
    console.log("run-vercel-build: keeping .next cache (SECTORCALC_KEEP_NEXT_CACHE=1)");
  }

  runStep("node", ["scripts/vercel/ensure-build-prereqs.mjs"]);
  runStep("node", ["scripts/deepseek/ensure-generated-artifacts.mjs"]);
  assertRegistryParity();

  if (!envEnabled("SECTORCALC_SKIP_TEST_GENERATED", true)) {
    runStep("npm", ["run", "test:generated"]);
  } else {
    console.log("run-vercel-build: skipping test:generated (SECTORCALC_SKIP_TEST_GENERATED=1)");
  }

  runStep("node", ["scripts/next-build-with-500-fallback.mjs"]);
}

main();
