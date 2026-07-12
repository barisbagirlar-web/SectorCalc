#!/usr/bin/env node
/**
 * ENGINEERING RUNTIME STABILIZATION v1 — Regression Guards
 *
 * Guards:
 *   duplicate-route  — no static file conflicts with App Router routes
 *   manifest         — /manifest.webmanifest served via App Router only
 *   auth-session     — POST /api/auth/session contract invariant
 *   package-lock     — npm ci passes (lockfile == node_modules)
 *
 * Usage:
 *   node scripts/guard-runtime-stability.mjs
 *   node scripts/guard-runtime-stability.mjs --manifest-only
 *   node scripts/guard-runtime-stability.mjs --auth-only
 *   node scripts/guard-runtime-stability.mjs --lock-only
 *   node scripts/guard-runtime-stability.mjs --route-only
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const PASS_MARK = "✅";
const FAIL_MARK = "❌";
let exitCode = 0;

function pass(label, detail) {
  console.log(`  ${PASS_MARK} ${label}${detail ? " — " + detail : ""}`);
}

function fail(label, detail) {
  console.log(`  ${FAIL_MARK} ${label}${detail ? " — " + detail : ""}`);
  exitCode = 1;
}

function heading(text) {
  console.log(`\n═══════════════════════════════════════`);
  console.log(`  ${text}`);
  console.log(`═══════════════════════════════════════`);
}

// ── manifest guard ─────────────────────────────────────────
function guardManifest() {
  heading("MANIFEST GUARD");
  const appRoute = join(ROOT, "src/app/manifest.ts");
  const publicStatic = join(ROOT, "public/manifest.webmanifest");

  if (!existsSync(appRoute)) {
    fail("manifest", "src/app/manifest.ts missing — manifest.webmanifest would 404");
    return;
  }
  pass("app route", "src/app/manifest.ts exists");

  if (existsSync(publicStatic)) {
    fail("manifest", "public/manifest.webmanifest still exists — duplicate route conflict");
    return;
  }
  pass("static", "public/manifest.webmanifest removed — no duplicate");
}

// ── duplicate-route guard ──────────────────────────────────
function guardDuplicateRoutes() {
  heading("DUPLICATE ROUTE GUARD");

  // robots.txt: only route.ts must exist, not robots.ts
  const robotsRoute = join(ROOT, "src/app/robots.txt/route.ts");
  const robotsMeta = join(ROOT, "src/app/robots.ts");
  if (existsSync(robotsMeta)) {
    fail("robots.txt", "src/app/robots.ts still exists — MetadataRoute conflicts with robots.txt/route.ts");
  } else if (existsSync(robotsRoute)) {
    pass("robots.txt", "only robots.txt/route.ts exists");
  } else {
    fail("robots.txt", "no implementation found");
  }

  // manifest.webmanifest: app route only, no public static
  const manifestApp = join(ROOT, "src/app/manifest.ts");
  const manifestPublic = join(ROOT, "public/manifest.webmanifest");
  if (existsSync(manifestPublic)) {
    fail("manifest.webmanifest", "public/manifest.webmanifest conflicts with src/app/manifest.ts");
  } else if (existsSync(manifestApp)) {
    pass("manifest.webmanifest", "only src/app/manifest.ts exists");
  } else {
    fail("manifest.webmanifest", "no implementation found");
  }
}

// ── auth-session guard ─────────────────────────────────────
function guardAuthSession() {
  heading("AUTH SESSION GUARD");

  const sessionRoute = join(ROOT, "src/app/api/auth/session/route.ts");
  if (!existsSync(sessionRoute)) {
    fail("auth-session", "src/app/api/auth/session/route.ts missing");
    return;
  }

  // Check that the session route requires an idToken and never silently passes
  const source = readFileSync(sessionRoute, "utf8");
  if (!source.includes("idToken")) {
    fail("auth-session", "session route does not reference idToken — may silently pass");
  } else {
    pass("auth-session", "route handles idToken verification");
  }

  if (!source.includes("!response.ok") && !source.includes("status: 401") && !source.includes("status: 500")) {
    fail("auth-session", "session route may silently ignore failures — no error status codes found");
  } else {
    pass("auth-session", "route returns error status codes on failure");
  }

  if (source.includes("error: \"Authentication service unavailable\"")) {
    pass("auth-session", "non-token failures produce distinct message");
  }
}

// ── package-lock guard ─────────────────────────────────────
function guardPackageLock() {
  heading("PACKAGE LOCK GUARD");

  if (!existsSync(join(ROOT, "package-lock.json"))) {
    fail("package-lock", "package-lock.json missing");
    return;
  }
  pass("package-lock", "package-lock.json exists");

  // Run npm ci in dry-run mode to verify lockfile is valid without installing
  const result = spawnSync("npm", ["ci", "--dry-run"], {
    cwd: ROOT,
    stdio: "pipe",
    timeout: 60_000,
  });

  if (result.status === 0) {
    pass("npm ci --dry-run", "lockfile is valid and reproducible");
  } else {
    const stderr = result.stderr?.toString() ?? "";
    fail("npm ci --dry-run", `lockfile validation failed: ${stderr.slice(0, 200)}`);
  }
}

function guardTypecheck() {
  heading("TYPECHECK GUARD");
  const result = spawnSync("npx", ["tsc", "--noEmit"], {
    cwd: ROOT,
    stdio: "pipe",
    timeout: 120_000,
  });
  if (result.status === 0) {
    pass("npx tsc --noEmit", "zero type errors");
  } else {
    const stderr = result.stderr?.toString() ?? "";
    fail("npx tsc --noEmit", stderr.slice(0, 500));
  }
}

// ── Main ───────────────────────────────────────────────────
const args = process.argv.slice(2);
const onlyManifest = args.includes("--manifest-only");
const onlyAuth = args.includes("--auth-only");
const onlyLock = args.includes("--lock-only");
const onlyRoute = args.includes("--route-only");

if (onlyManifest) { guardManifest(); }
else if (onlyAuth) { guardAuthSession(); }
else if (onlyLock) { guardPackageLock(); }
else if (onlyRoute) { guardDuplicateRoutes(); }
else {
  guardManifest();
  guardDuplicateRoutes();
  guardAuthSession();
  guardPackageLock();
  guardTypecheck();
}

console.log(`\n${exitCode === 0 ? "✅ ALL GUARDS PASS" : "❌ SOME GUARDS FAILED"}`);
process.exit(exitCode);
