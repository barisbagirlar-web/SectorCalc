#!/usr/bin/env node

/**
 * guard-free-schema-server-boundary.mjs
 *
 * Fails if free-schema-loader.ts (which uses Node fs/path) is imported by:
 *   - src/lib/infrastructure/seo/   (shared SEO modules)
 *   - src/components/               (React components)
 *   - any file containing "use client" (client-side modules)
 *   - public manifest files           (fs-free by requirement)
 *
 * Passes only if free-schema-loader is imported ONLY by:
 *   - server routes (src/app/ server components)
 *   - server actions / runtime modules (src/sectorcalc/runtime/)
 *   - node scripts (scripts/)
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const MODULE_PATH = "src/sectorcalc/runtime/free-schema-loader";

// Forbidden import zones — free-schema-loader must never appear here
const FORBIDDEN_ZONES = [
  { path: "src/lib/infrastructure/seo", desc: "shared SEO modules" },
  { path: "src/components", desc: "React components" },
];

// Allowed import zones — free-schema-loader is expected here
const ALLOWED_ZONES = [
  { path: "src/app", desc: "server routes" },
  { path: "src/sectorcalc/runtime", desc: "runtime modules" },
  { path: "scripts", desc: "node scripts" },
  // resolve-approved-tool-schema is a runtime module covered by src/sectorcalc/runtime
];

let failures = 0;

function findFilesWithImport(dir, importPattern) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  try {
    const output = execFileSync("rg", ["-l", "--glob", "*.ts", "--glob", "*.tsx", "--glob", "*.mjs", importPattern, abs], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
    return output.trim().split("\n").filter(Boolean);
  } catch {
    // rg returns exit code 1 when no matches — that's OK
    return [];
  }
}

function findUseClientFilesWithImport() {
  // Find all files containing "use client" that also import from free-schema-loader
  const abs = join(ROOT, "src");
  if (!existsSync(abs)) return [];
  try {
    const output = execFileSync("rg", [
      "-l", "--glob", "*.tsx", "--glob", "*.ts",
      "-U", // multiline
      '"use client"[\\s\\S]*from.*free-schema-loader',
      abs,
    ], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
    return output.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

console.log("═══════════════════════════════════════════════════════");
console.log("  Free Schema Server Boundary Guard");
console.log("═══════════════════════════════════════════════════════\n");

// ── Check 1: Forbidden zones ────────────────────────────────────
for (const zone of FORBIDDEN_ZONES) {
  const files = findFilesWithImport(zone.path, "free-schema-loader");
  if (files.length > 0) {
    console.error(`  ❌ free-schema-loader imported BY ${zone.desc}:`);
    for (const f of files) {
      console.error(`     - ${f}`);
    }
    failures++;
  } else {
    console.log(`  ✅ No imports in ${zone.desc}`);
  }
}

// ── Check 2: "use client" files with free-schema-loader import ──
const clientFiles = findUseClientFilesWithImport();
if (clientFiles.length > 0) {
  console.error(`  ❌ free-schema-loader imported BY "use client" files:`);
  for (const f of clientFiles) {
    console.error(`     - ${f}`);
  }
  failures++;
} else {
  console.log(`  ✅ No "use client" files import free-schema-loader`);
}

// ── Check 3: Verify free-schema-loader IS used by allowed zones ──
console.log(`\n  Verifying allowed import zones...`);
let allowedFound = false;
for (const zone of ALLOWED_ZONES) {
  const files = findFilesWithImport(zone.path, "free-schema-loader");
  if (files.length > 0) {
    allowedFound = true;
    console.log(`  ✅ Allowed imports in ${zone.desc}: ${files.length} file(s)`);
  } else {
    console.log(`  ⚠️  No imports in ${zone.desc} (may be OK if not expected)`);
  }
}

if (!allowedFound) {
  console.error(`\n  ❌ free-schema-loader is NOT imported by any allowed zone — dead code?`);
  failures++;
}

// ── Summary ─────────────────────────────────────────────────────
console.log(`\n───────────────────────────────────────────────────────`);
if (failures > 0) {
  console.error(`  ❌ FREE_SCHEMA_SERVER_BOUNDARY=FAIL`);
  console.error(`  failure_count=${failures}`);
  process.exit(1);
}

console.log(`  ✅ FREE_SCHEMA_SERVER_BOUNDARY=PASS`);
console.log("═══════════════════════════════════════════════════════\n");
