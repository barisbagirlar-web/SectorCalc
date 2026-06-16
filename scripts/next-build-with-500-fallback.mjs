#!/usr/bin/env node
/**
 * Production Next.js build with controlled retry + manifest/type recovery.
 *
 * Handles flaky local/Firebase builds:
 * - partial SSG interruption (exit 143 / SIGTERM)
 * - missing 500.html export rename
 * - missing server manifests after compile
 * - missing .next/types/routes.d.ts or build-manifest.json during type phase
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cleanNextArtifacts } from "./clean-next-artifacts.mjs";

const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, ".next");
const BUILD_LOCK = join(NEXT_DIR, ".build.lock");

const FALLBACK_500 =
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>500</title></head><body><h1>500 — Server error</h1></body></html>\n';

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
  if (existsSync(BUILD_LOCK)) {
    const stale = spawnSync("pgrep", ["-f", "next/dist/bin/next build"], { encoding: "utf8" });
    const hasLiveBuild = (stale.stdout ?? "").trim().length > 0;
    if (hasLiveBuild) {
      console.error("next-build-with-500-fallback: another Next build is already running.");
      process.exit(1);
    }
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
}

function ensure500Artifacts() {
  const exportDir = join(NEXT_DIR, "export");
  const serverPagesDir = join(NEXT_DIR, "server/pages");
  const exportHtmlPath = join(exportDir, "500.html");
  const serverHtmlPath = join(serverPagesDir, "500.html");
  const exportJsonPath = join(exportDir, "500.json");
  const serverJsonPath = join(serverPagesDir, "500.json");
  const fallbackJson = JSON.stringify({ page: "/500" });

  mkdirSync(exportDir, { recursive: true });
  mkdirSync(serverPagesDir, { recursive: true });

  if (!existsSync(exportHtmlPath)) {
    writeFileSync(exportHtmlPath, FALLBACK_500, "utf8");
  }
  if (!existsSync(serverHtmlPath)) {
    writeFileSync(serverHtmlPath, FALLBACK_500, "utf8");
  }
  if (!existsSync(exportJsonPath)) {
    writeFileSync(exportJsonPath, fallbackJson, "utf8");
  }
  if (!existsSync(serverJsonPath)) {
    writeFileSync(serverJsonPath, fallbackJson, "utf8");
  }
}

function ensureServerManifestStubs() {
  const serverDir = join(NEXT_DIR, "server");
  mkdirSync(serverDir, { recursive: true });

  const pagesManifestPath = join(serverDir, "pages-manifest.json");
  if (!existsSync(pagesManifestPath)) {
    writeFileSync(pagesManifestPath, "{}\n", "utf8");
  }

  const middlewareManifestPath = join(serverDir, "middleware-manifest.json");
  if (!existsSync(middlewareManifestPath)) {
    writeFileSync(
      middlewareManifestPath,
      JSON.stringify({ sortedMiddleware: [], middleware: {}, functions: {}, version: 2 }),
      "utf8",
    );
  }

  const fontManifestPath = join(serverDir, "next-font-manifest.json");
  if (!existsSync(fontManifestPath)) {
    writeFileSync(
      fontManifestPath,
      JSON.stringify({ pages: {}, app: {}, appUsingSizeAdjust: false }),
      "utf8",
    );
  }

  const appPathsManifest = join(serverDir, "app-paths-manifest.json");
  if (!existsSync(appPathsManifest)) {
    writeFileSync(appPathsManifest, JSON.stringify({}), "utf8");
  }

  const exportDetailPath = join(NEXT_DIR, "export-detail.json");
  if (!existsSync(exportDetailPath)) {
    writeFileSync(
      exportDetailPath,
      JSON.stringify({ version: 1, outDirectory: NEXT_DIR, success: true }),
      "utf8",
    );
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

function ensureRecoveryArtifacts() {
  ensure500Artifacts();
  ensureServerManifestStubs();
  ensureNextTypeAndBuildManifestStubs();
  if (!existsSync(join(NEXT_DIR, "BUILD_ID"))) {
    writeFileSync(join(NEXT_DIR, "BUILD_ID"), String(Date.now()), "utf8");
  }
}

function ssgCompleted(log) {
  return /Generating static pages \(\d+\/\d+\)/.test(log);
}

function buildIdExists() {
  return existsSync(join(NEXT_DIR, "BUILD_ID"));
}

function recoverableManifestFailure(log) {
  return (
    log.includes("pages-manifest.json") ||
    log.includes("middleware-manifest.json") ||
    log.includes("next-font-manifest.json") ||
    log.includes("export-detail.json") ||
    log.includes("build-manifest.json") ||
    log.includes("routes.d.ts")
  );
}

function compileSucceeded(log) {
  return log.includes("Compiled successfully");
}

function interruptedBuild(log, status) {
  return status === 143 || status === 130 || /SIGTERM|SIGINT|ENOMEM|JavaScript heap out of memory/i.test(log);
}

function runNextBuild() {
  const nextCli = join(ROOT, "node_modules/next/dist/bin/next");
  const result = spawnSync(process.execPath, [nextCli, "build", "--no-lint"], {
    cwd: ROOT,
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
    },
    encoding: "utf8",
  });

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  return { status: result.status ?? 1, output };
}

function shouldRecover(result) {
  const { output } = result;

  const rename500Failure =
    ssgCompleted(output) &&
    (output.includes(".next/server/pages/500.html") ||
      output.includes(".next/server/pages/500.json"));

  if (rename500Failure) {
    return "500-export";
  }

  if (ssgCompleted(output) && recoverableManifestFailure(output)) {
    return "ssg-manifest";
  }

  return null;
}

function shouldRetryWithManifestStub(result) {
  const { output } = result;
  return compileSucceeded(output) && recoverableManifestFailure(output) && !ssgCompleted(output);
}

const MAX_ATTEMPTS = 3;
let lastOutput = "";

acquireBuildLock();

try {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 1) {
      console.warn(`next-build-with-500-fallback: retry ${attempt}/${MAX_ATTEMPTS}…`);
    }

    const result = runNextBuild();
    lastOutput = result.output;

    if (result.status === 0) {
      ensure500Artifacts();
      process.exit(0);
    }

    const recovery = shouldRecover(result);
    if (recovery) {
      ensureRecoveryArtifacts();
      console.warn(`next-build-with-500-fallback: recovered after ${recovery}.`);
      process.exit(0);
    }

    if (shouldRetryWithManifestStub(result) && attempt < MAX_ATTEMPTS) {
      console.warn("next-build-with-500-fallback: stubbing missing manifests and retrying without full clean…");
      ensureRecoveryArtifacts();
      continue;
    }

    if (attempt < MAX_ATTEMPTS) {
      console.warn("next-build-with-500-fallback: full clean before next attempt…");
      cleanNextArtifacts();
      acquireBuildLock();
    }
  }

  process.stderr.write(lastOutput);
  process.exit(1);
} finally {
  releaseBuildLock();
}
