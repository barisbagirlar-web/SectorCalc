#!/usr/bin/env node
/**
 * Vercel production build entry — deterministic clean, artifact sync, fallback Next build.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { cleanNextArtifacts } from "../clean-next-artifacts.mjs";
import {
  acquireGlobalBuildLock,
  releaseGlobalBuildLock,
} from "../lib/global-build-lock.mjs";
import {
  allSchemasHaveGeneratedTools,
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

  if (process.env.SECTORCALC_FORCE_FULL_STATIC !== "1" && process.env.SECTORCALC_VERCEL_BUILD_LIMIT !== "0") {
    process.env.SECTORCALC_VERCEL_BUILD_LIMIT = "1";
  }

  if (process.env.SECTORCALC_SKIP_GENERATE_ALL !== "0") {
    process.env.SECTORCALC_SKIP_GENERATE_ALL = "1";
  }
}

function assertRegistryParity() {
  if (!existsSync(SCHEMAS_DIR) || !existsSync(REGISTRY_FILE)) {
    return;
  }

  if (!registryParityOk() || !allSchemasHaveGeneratedTools()) {
    const state = describeGeneratedArtifactState();
    console.error(
      `run-vercel-build: registry parity failed — ${state.loaderCount} loaders vs ${state.toolCount} generated tools (${state.schemaCount} schemas)`,
    );
    if (!allSchemasHaveGeneratedTools()) {
      console.error("run-vercel-build: at least one schema JSON lacks a matching generated/*.ts file");
    }
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

  // Vercel CI is isolated — skip global lock on remote builders.
  const useGlobalLock = process.env.VERCEL !== "1";
  if (useGlobalLock) {
    acquireGlobalBuildLock("vercel-build");
  }

  try {
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
  } finally {
    if (useGlobalLock) {
      releaseGlobalBuildLock();
    }
  }
}

main();
