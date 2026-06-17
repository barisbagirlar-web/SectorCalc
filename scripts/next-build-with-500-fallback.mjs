#!/usr/bin/env node
/**
 * Production Next.js build with controlled retry + manifest recovery.
 *
 * Stability rules:
 * - Global repo lock (no parallel builds).
 * - Never exit 0 on partial/corrupt `.next` (validate before success).
 * - App Router only — no `src/pages/*` (Pages Router races / _document ENOENT).
 */
import { spawnSync } from "node:child_process";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cleanNextArtifacts } from "./clean-next-artifacts.mjs";
import {
  acquireGlobalBuildLock,
  releaseGlobalBuildLock,
} from "./lib/global-build-lock.mjs";
import { stripVercelExportMarkers } from "./lib/strip-vercel-export-markers.mjs";

const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, ".next");
const BUILD_LOCK = join(NEXT_DIR, ".build.lock");
const BUILD_LOG = join(NEXT_DIR, "last-next-build.log");
const useGlobalLock = process.env.VERCEL !== "1";

/** Minimal routes stub — satisfies next-env.d.ts until Next regenerates types. */
const ROUTES_D_TS_STUB = `// Auto-generated stub (build recovery). Next.js replaces on successful typegen.
type AppRoutes = never;
type PageRoutes = never;
type LayoutRoutes = never;
type RedirectRoutes = never;
type RewriteRoutes = never;
type AppRouteHandlerRoutes = never;
type PageData = Record<string, unknown>;
`;

function acquireBuildLock() {
  if (useGlobalLock) {
    acquireGlobalBuildLock("npm run build");
  }

  if (existsSync(BUILD_LOCK)) {
    rmSync(BUILD_LOCK, { force: true });
  }

  mkdirSync(NEXT_DIR, { recursive: true });
  writeFileSync(
    BUILD_LOCK,
    JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }),
    "utf8",
  );
}

function releaseBuildLock() {
  rmSync(BUILD_LOCK, { force: true });
  if (useGlobalLock) {
    releaseGlobalBuildLock();
  }
}

function ensureNextTypeAndBuildManifestStubs() {
  const typesDir = join(NEXT_DIR, "types");
  mkdirSync(typesDir, { recursive: true });

  const routesPath = join(typesDir, "routes.d.ts");
  if (!existsSync(routesPath)) {
    writeFileSync(routesPath, ROUTES_D_TS_STUB, "utf8");
  }

  const buildManifestPath = join(NEXT_DIR, "build-manifest.json");
  if (!existsSync(buildManifestPath)) {
    writeFileSync(buildManifestPath, JSON.stringify({ pages: {}, devFiles: [], ampDevFiles: [] }), "utf8");
  }
}

function ssgFullyCompleted(log) {
  const matches = [...log.matchAll(/Generating static pages \(\s*(\d+)\/(\d+)\s*\)/g)];
  if (matches.length === 0) {
    return false;
  }
  const last = matches[matches.length - 1];
  return last[1] === last[2];
}

function compileSucceeded(log) {
  return log.includes("Compiled successfully");
}

function recoverableManifestFailure(log) {
  return (
    log.includes("pages-manifest.json") ||
    log.includes("middleware-manifest.json") ||
    log.includes("next-font-manifest.json") ||
    log.includes("app-build-manifest.json") ||
    log.includes("export-detail.json") ||
    log.includes("build-manifest.json") ||
    log.includes("routes.d.ts")
  );
}

function ssgPageModuleRaceFailure(log) {
  return (
    (log.includes("Cannot find module") &&
      (log.includes("/.next/server/app/") || log.includes("/.next/server/pages/"))) ||
    log.includes("Unexpected end of JSON input") ||
    log.includes("Cannot find module for page: /_document") ||
    log.includes("PageNotFoundError")
  );
}

function interruptedBuild(log, status) {
  return status === 143 || status === 130 || /SIGTERM|SIGINT|ENOMEM|JavaScript heap out of memory/i.test(log);
}

function readBuildLogTail(maxChars = 200_000) {
  if (!existsSync(BUILD_LOG)) {
    return "";
  }
  const full = readFileSync(BUILD_LOG, "utf8");
  return full.length > maxChars ? full.slice(-maxChars) : full;
}

function runNextBuild() {
  mkdirSync(NEXT_DIR, { recursive: true });
  const logFd = openSync(BUILD_LOG, "w");

  const nextCli = join(ROOT, "node_modules/next/dist/bin/next");
  const result = spawnSync(process.execPath, [nextCli, "build", "--no-lint"], {
    cwd: ROOT,
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
      FORCE_COLOR: "0",
    },
    stdio: ["inherit", logFd, logFd],
  });
  closeSync(logFd);

  const output = readBuildLogTail();
  if (process.env.VERCEL === "1" && output) {
    process.stdout.write(output);
  }

  if (result.error) {
    const message = result.error instanceof Error ? result.error.message : String(result.error);
    process.stderr.write(`next-build-with-500-fallback: spawn error: ${message}\n`);
    return { status: 1, output: `${output}\n${message}` };
  }

  return { status: result.status ?? 1, output };
}

function finalizeAndValidate() {
  const finalize = spawnSync(process.execPath, ["scripts/finalize-next-build.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if ((finalize.status ?? 1) !== 0) {
    return false;
  }

  // Last-chance strip between finalize and validate (cached export-marker.json → Vercel NOT_FOUND).
  stripVercelExportMarkers(NEXT_DIR);

  const validate = spawnSync(process.execPath, ["scripts/validate-next-build.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  return (validate.status ?? 1) === 0;
}

function shouldRecover500Export(result) {
  const { output } = result;
  const rename500Failure =
    output.includes(".next/server/pages/500.html") ||
    output.includes(".next/server/pages/500.json") ||
    output.includes("Export encountered an error on /500");

  return ssgFullyCompleted(output) && rename500Failure;
}

function shouldRetryWithManifestStub(result) {
  const { output } = result;
  return recoverableManifestFailure(output) && (compileSucceeded(output) || output.includes("routes.d.ts"));
}

function shouldRetryWithFullClean(result) {
  const { output, status } = result;
  return ssgPageModuleRaceFailure(output) || interruptedBuild(output, status);
}

const MAX_ATTEMPTS = process.env.VERCEL === "1" ? 5 : 3;
let lastOutput = "";

try {
  acquireBuildLock();
  ensureNextTypeAndBuildManifestStubs();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 1) {
      console.warn(`next-build-with-500-fallback: retry ${attempt}/${MAX_ATTEMPTS}…`);
    }

    const result = runNextBuild();
    lastOutput = result.output;

    if (result.status === 0 && finalizeAndValidate()) {
      process.exit(0);
    }

    if (shouldRecover500Export(result)) {
      console.warn("next-build-with-500-fallback: SSG complete — applying 500 static fallback…");
      const recovered = spawnSync(process.execPath, ["scripts/finalize-next-build.mjs"], {
        cwd: ROOT,
        stdio: "inherit",
      });
      if ((recovered.status ?? 1) === 0 && finalizeAndValidate()) {
        console.warn("next-build-with-500-fallback: recovered after 500-export.");
        process.exit(0);
      }
    }

    if (shouldRetryWithManifestStub(result) && attempt < MAX_ATTEMPTS) {
      console.warn("next-build-with-500-fallback: stubbing missing type/manifest files and retrying…");
      ensureNextTypeAndBuildManifestStubs();
      continue;
    }

    if (shouldRetryWithFullClean(result) && attempt < MAX_ATTEMPTS) {
      console.warn("next-build-with-500-fallback: SSG race detected — full clean retry…");
      cleanNextArtifacts();
      acquireBuildLock();
      ensureNextTypeAndBuildManifestStubs();
      continue;
    }

    if (attempt < MAX_ATTEMPTS) {
      console.warn("next-build-with-500-fallback: full clean before next attempt…");
      cleanNextArtifacts();
      acquireBuildLock();
      ensureNextTypeAndBuildManifestStubs();
    }
  }

  process.stderr.write(lastOutput || readBuildLogTail());
  process.exit(1);
} finally {
  releaseBuildLock();
}
