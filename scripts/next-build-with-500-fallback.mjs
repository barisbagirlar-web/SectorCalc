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


/**
 * Pre-flight: run TypeScript syntax validation on all generated tool files.
 * Catches syntax errors in generated/*.ts before webpack tries to compile them,
 * which produces opaque "Syntax Error" messages without line numbers.
 */
function prebuildValidateGeneratedSyntax() {
  const result = spawnSync(
    "npx",
    ["tsx", "scripts/prebuild-validate-generated-syntax.ts"],
    { cwd: ROOT, stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error(
      "next-build-with-500-fallback: generated file syntax validation FAILED — aborting build.",
    );
    process.exit(1);
  }
}

const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, ".next");
const WEBPACK_CACHE_DIR = join(ROOT, "node_modules/.cache/webpack");
const BUILD_LOCK = join(NEXT_DIR, ".build.lock");
const BUILD_LOG = join(NEXT_DIR, "last-next-build.log");
const PERSISTENT_BUILD_LOG = join(ROOT, ".last-next-build.log");
const useGlobalLock = true;

/** Minimal routes stub — satisfies next-env.d.ts until Next regenerates types. */
const ROUTES_D_TS_STUB = `// Auto-generated stub (build recovery). Next.js replaces on successful typegen.
type AppRoutes = never;
type PageRoutes = never;
type LayoutRoutes = never;
type RedirectRoutes = never;
type RewriteRoutes = never;
type AppRouteHandlerRoutes = never;
type PageData = Record<string, unknown>;
export {};
`;

function acquireBuildLock() {
  if (useGlobalLock && process.env.SECTORCALC_BUILD_LOCK_SKIP !== "1") {
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
  if (useGlobalLock && process.env.SECTORCALC_BUILD_LOCK_SKIP !== "1") {
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

  const serverDir = join(NEXT_DIR, "server");
  mkdirSync(serverDir, { recursive: true });
  const pagesManifestPath = join(serverDir, "pages-manifest.json");
  if (!existsSync(pagesManifestPath)) {
    writeFileSync(pagesManifestPath, JSON.stringify({}), "utf8");
  }

  const middlewareManifestPath = join(serverDir, "middleware-manifest.json");
  if (!existsSync(middlewareManifestPath)) {
    writeFileSync(middlewareManifestPath, JSON.stringify({}));
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
  return log.includes("Compiled successfully") || log.includes("Compiled with warnings");
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
      (log.includes("/.next/server/") || log.includes("/.next/server/pages/"))) ||
    log.includes("Unexpected end of JSON input") ||
    log.includes("Cannot find module for page: /_document") ||
    log.includes("PageNotFoundError")
  );
}

function interruptedBuild(log, status) {
  return status === 143 || status === 130 || status === 137 || /SIGTERM|SIGINT|SIGKILL|ENOMEM|JavaScript heap out of memory/i.test(log);
}

function preserveBuildLogForDiagnostics() {
  if (!existsSync(BUILD_LOG)) {
    return;
  }
  const chunk = readFileSync(BUILD_LOG, "utf8");
  const prior = existsSync(PERSISTENT_BUILD_LOG) ? readFileSync(PERSISTENT_BUILD_LOG, "utf8") : "";
  writeFileSync(PERSISTENT_BUILD_LOG, `${prior}\n--- build attempt ---\n${chunk}`, "utf8");
}

function readPersistentBuildLogTail(maxChars = 48_000) {
  if (!existsSync(PERSISTENT_BUILD_LOG)) {
    return "";
  }
  const full = readFileSync(PERSISTENT_BUILD_LOG, "utf8");
  return full.length > maxChars ? full.slice(-maxChars) : full;
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
      // DNS resolution order: force IPv4 first to avoid intermittent
      // "getaddrinfo ENOTFOUND" failures on Vercel builders (Node.js 17+
      // defaults to verbatim/ipv6first, which can fail for Google Fonts
      // and other CDNs).
      NODE_OPTIONS:
        process.env.NODE_OPTIONS ??
        "--max-old-space-size=8192 --dns-result-order=ipv4first",
      FORCE_COLOR: "0",
    },
    stdio: ["inherit", logFd, logFd],
  });
  if (logFd !== null) {
    closeSync(logFd);
  }

  const output = readBuildLogTail();

  if (result.error) {
    const message = result.error instanceof Error ? result.error.message : String(result.error);
    console.error(`next-build-with-500-fallback: spawn error: ${message}`);
    return { status: 1, output: `${output}\n${message}`, signal: result.signal };
  }

  return { status: result.status ?? 1, output, signal: result.signal };
}

function logAttemptFailure(attempt, phase, result) {
  const status = result.status ?? 1;
  const signal = result.signal ?? "none";
  console.error(
    `next-build-with-500-fallback: attempt ${attempt}/${MAX_ATTEMPTS} failed — ${phase} (status=${status}, signal=${signal})`,
  );
  const tail = result.output?.slice(-4000) ?? "";
  if (tail) {
    console.error(`next-build-with-500-fallback: log tail:\n${tail}`);
  }
}

function dumpFinalDiagnostics() {
  console.error("\nnext-build-with-500-fallback: all attempts exhausted.");
  const diagnosticLog = readPersistentBuildLogTail() || lastOutput || readBuildLogTail();
  if (diagnosticLog) {
    console.error(diagnosticLog.slice(-24_000));
  } else {
    console.error("next-build-with-500-fallback: no build log captured.");
  }
}

function runValidateOnly() {
  const validate = spawnSync(process.execPath, ["scripts/validate-next-build.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  return (validate.status ?? 1) === 0;
}

function finalizeAndValidate() {
  const finalize = spawnSync(process.execPath, ["scripts/finalize-next-build.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if ((finalize.status ?? 1) !== 0) {
    console.error(
      `next-build-with-500-fallback: finalize-next-build failed (status=${finalize.status ?? 1})`,
    );
    return false;
  }

  const validate = spawnSync(process.execPath, ["scripts/validate-next-build.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if ((validate.status ?? 1) !== 0) {
    console.error(
      `next-build-with-500-fallback: validate-next-build failed (status=${validate.status ?? 1})`,
    );
    return false;
  }
  return true;
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

const MAX_ATTEMPTS = 5;
let lastOutput = "";

try {
  acquireBuildLock();
  if (existsSync(PERSISTENT_BUILD_LOG)) {
    rmSync(PERSISTENT_BUILD_LOG, { force: true });
  }

  // i18n hardcoded-text gate — fail fast before expensive build
  const i18nAudit = spawnSync(
    process.execPath,
    ["scripts/audit-i18n-hardcoded.mjs"],
    { cwd: ROOT, stdio: "inherit" },
  );
  if (i18nAudit.status !== 0 && process.env.SECTORCALC_SKIP_I18N_AUDIT !== "1") {
    process.exit(1);
  }

  // Generated-file syntax gate — catch TS syntax errors in generated/*.ts
  // before webpack/SWC encounters them and produces opaque error messages.
  prebuildValidateGeneratedSyntax();

  ensureNextTypeAndBuildManifestStubs();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 1) {
      console.warn(`next-build-with-500-fallback: retry ${attempt}/${MAX_ATTEMPTS}…`);
    }

    const result = runNextBuild();
    if (result.output) {
      lastOutput = result.output;
    }

    if (result.status === 0) {
      if (finalizeAndValidate()) {
        process.exit(0);
      }

      logAttemptFailure(attempt, "finalize/validate after successful next build", {
        ...result,
        output: lastOutput,
      });

      if (runValidateOnly()) {
        console.error("next-build-with-500-fallback: recovered via validate-only strip retry.");
        process.exit(0);
      }

      dumpFinalDiagnostics();
      process.exit(1);
    }

    logAttemptFailure(attempt, "next build", result);

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
      preserveBuildLogForDiagnostics();
      cleanNextArtifacts();
      // Remove webpack filesystem cache — corrupted JSON causes SSG parse failures.
      try { rmSync(WEBPACK_CACHE_DIR, { recursive: true, force: true }); } catch {}
      acquireBuildLock();
      ensureNextTypeAndBuildManifestStubs();
      continue;
    }

    if (attempt < MAX_ATTEMPTS) {
      // Check if the build log exists — it may have the actual error even if result.output is empty.
      const fullLog = existsSync(BUILD_LOG) ? readBuildLogTail(4000) : "";
      if (recoverableManifestFailure(fullLog) || result.status === 1) {
        console.warn("next-build-with-500-fallback: manifest race — stubbing and retrying without full clean…");
        ensureNextTypeAndBuildManifestStubs();
        continue;
      }
      console.warn("next-build-with-500-fallback: full clean before next attempt…");
      preserveBuildLogForDiagnostics();
      cleanNextArtifacts();
      try { rmSync(WEBPACK_CACHE_DIR, { recursive: true, force: true }); } catch {}
      acquireBuildLock();
      ensureNextTypeAndBuildManifestStubs();
    }
  }

  dumpFinalDiagnostics();
  process.exit(1);
} finally {
  releaseBuildLock();
}
