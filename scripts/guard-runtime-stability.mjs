#!/usr/bin/env node
/**
 * Engineering runtime stability regression guard.
 * Validates route uniqueness, auth-session contract, lockfile integrity,
 * and TypeScript compilation without mutating the repository.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
let failed = false;

function pass(label, detail = "") {
  console.log(`✅ ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label, detail = "") {
  console.error(`❌ ${label}${detail ? ` — ${detail}` : ""}`);
  failed = true;
}

function checkExclusiveRoute(label, canonicalPath, conflictingPaths) {
  const canonical = join(ROOT, canonicalPath);
  if (!existsSync(canonical)) {
    fail(label, `missing canonical implementation: ${canonicalPath}`);
    return;
  }
  const conflicts = conflictingPaths.filter((path) => existsSync(join(ROOT, path)));
  if (conflicts.length > 0) {
    fail(label, `duplicate implementations: ${conflicts.join(", ")}`);
    return;
  }
  pass(label, canonicalPath);
}

console.log("\n=== SectorCalc Runtime Stability Guard ===\n");

checkExclusiveRoute("manifest.webmanifest", "src/app/manifest.ts", ["public/manifest.webmanifest"]);
checkExclusiveRoute("robots.txt", "src/app/robots.txt/route.ts", ["src/app/robots.ts", "public/robots.txt"]);

const iconConflicts = [
  ["src/app/icon.png", "public/icon.png"],
  ["src/app/favicon.ico", "public/favicon.ico"],
];
for (const [appPath, publicPath] of iconConflicts) {
  if (existsSync(join(ROOT, appPath)) && existsSync(join(ROOT, publicPath))) {
    fail(appPath, `conflicts with ${publicPath}`);
  } else {
    pass(appPath, "no public/App Router duplicate");
  }
}

const sessionRoute = join(ROOT, "src/app/api/auth/session/route.ts");
if (!existsSync(sessionRoute)) {
  fail("auth session", "route missing");
} else {
  const source = readFileSync(sessionRoute, "utf8");
  const requirements = [
    ["idToken", "ID token input"],
    ["verifyIdToken", "Firebase Admin verification"],
    ["createSessionCookie", "session-cookie creation"],
  ];
  for (const [needle, label] of requirements) {
    source.includes(needle) ? pass(`auth session: ${label}`) : fail(`auth session: ${label}`, `${needle} missing`);
  }
  if (/status\s*:\s*(401|500)/.test(source)) pass("auth session: explicit failure status");
  else fail("auth session: explicit failure status", "401/500 handling missing");
}

if (!existsSync(join(ROOT, "package-lock.json"))) {
  fail("package lock", "package-lock.json missing");
} else {
  const dryRun = spawnSync("npm", ["ci", "--dry-run", "--ignore-scripts"], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 120_000,
  });
  if (dryRun.status === 0) pass("package lock", "npm ci --dry-run reproducible");
  else fail("package lock", (dryRun.stderr || dryRun.stdout || "validation failed").slice(0, 500));
}

const typecheck = spawnSync("./node_modules/.bin/tsc", ["--noEmit"], {
  cwd: ROOT,
  encoding: "utf8",
  timeout: 180_000,
});
if (typecheck.status === 0) pass("TypeScript", "zero errors");
else fail("TypeScript", (typecheck.stderr || typecheck.stdout || "typecheck failed").slice(0, 1000));

console.log(failed ? "\n❌ RUNTIME_STABILITY_GUARD=FAIL" : "\n✅ RUNTIME_STABILITY_GUARD=PASS");
process.exit(failed ? 1 : 0);
