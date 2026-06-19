#!/usr/bin/env node
/**
 * Vercel production build entry — deterministic clean, artifact sync, fallback Next build.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
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
import { stripVercelExportMarkers } from "../lib/strip-vercel-export-markers.mjs";

const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, ".next");
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

/** @param {string} rel @param {number} [maxChars] */
function readTail(rel, maxChars = 24_000) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) {
    return "";
  }
  const full = readFileSync(abs, "utf8");
  return full.length > maxChars ? full.slice(-maxChars) : full;
}

/** @param {string} command @param {string[]} args @param {{ label?: string, dumpNextBuildLog?: boolean }} [options] */
function runStep(command, args, options = {}) {
  const label = options.label ?? `${command} ${args.join(" ")}`;
  console.log(`run-vercel-build: ▶ ${label}`);

  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
    },
  });

  if (result.status === 0) {
    return;
  }

  const status = result.status ?? 1;
  const signal = result.signal ?? "none";
  console.error(`run-vercel-build: ✗ step failed — ${label}`);
  console.error(`run-vercel-build: exit status=${status}, signal=${signal}`);

  if (result.error) {
    const message = result.error instanceof Error ? result.error.message : String(result.error);
    console.error(`run-vercel-build: spawn error: ${message}`);
  }

  if (options.dumpNextBuildLog) {
    const tail =
      readTail(".vercel-last-build.log") ||
      readTail(".next/last-next-build.log");
    if (tail) {
      console.error("run-vercel-build: last-next-build.log (tail):\n" + tail);
    } else {
      console.error("run-vercel-build: no .next/last-next-build.log found");
    }
  }

  process.exit(status);
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

function ensureHealthyNextCache() {
  if (!existsSync(NEXT_DIR)) {
    return;
  }
  if (!existsSync(join(NEXT_DIR, "BUILD_ID"))) {
    console.warn("run-vercel-build: partial .next without BUILD_ID — cleaning stale cache");
    cleanNextArtifacts();
  }
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
    ensureHealthyNextCache();
    if (process.env.VERCEL === "1") {
      stripVercelExportMarkers(NEXT_DIR);
    }

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

    runStep("node", ["scripts/i18n-guard-build.mjs"], {
      label: "i18n guard — zero tolerance on English leaks",
    });

    runStep("node", ["scripts/next-build-with-500-fallback.mjs"], {
      label: "next build (with 500 fallback)",
      dumpNextBuildLog: true,
    });

    if (process.env.VERCEL === "1") {
      stripVercelExportMarkers(NEXT_DIR);
    }
  } finally {
    if (useGlobalLock) {
      releaseGlobalBuildLock();
    }
  }
}

main();
