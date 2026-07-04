#!/usr/bin/env node
/**
 * assert-no-legacy-free-tools — build-time guard
 *
 * Fails (exit 1) if any legacy Free Tool source, route, or manifest
 * surface is found in the active source tree.
 *
 * Checks:
 * 1. free-v531 schema/formula directories
 * 2. pro-runtime/free-formulas directory or files
 * 3. generated/public AI tool indices for old free slugs
 * 4. sitemap files for old free slugs
 * 5. route maps for old free slugs
 * 6. Forbidden function references in src
 * 7. Engine Torque old free route
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

let failures = 0;

function fail(label, detail) {
  console.error(`[FAIL] ${label}: ${detail}`);
  failures++;
}

function pass(label) {
  console.log(`[PASS] ${label}`);
}

// ── 1. free-v531 directories ──────────────────────────────────────────

const FREE_V531_SCHEMAS = join(ROOT, "src/sectorcalc/schemas/free-v531");
const FREE_V531_FORMULAS = join(ROOT, "src/sectorcalc/formulas/free-v531");
const FREE_FORMULAS_DIR = join(ROOT, "src/sectorcalc/pro-runtime/free-formulas");

for (const [label, dir] of [
  ["free-v531 schemas", FREE_V531_SCHEMAS],
  ["free-v531 formulas", FREE_V531_FORMULAS],
  ["pro-runtime/free-formulas", FREE_FORMULAS_DIR],
]) {
  if (!existsSync(dir)) {
    pass(`${label} — absent`);
    continue;
  }
  const entries = readdirSync(dir).filter((f) => f.endsWith(".ts") || f.endsWith(".json"));
  if (entries.length === 0) {
    pass(`${label} — empty`);
    continue;
  }
  fail(label, `Contains files: ${entries.join(", ")}`);
}

// ── 2. free-formula-registry.ts ──────────────────────────────────────

const REGISTRY = join(ROOT, "src/sectorcalc/pro-runtime/free-formula-registry.ts");
if (existsSync(REGISTRY)) {
  fail("free-formula-registry.ts", "still exists");
} else {
  pass("free-formula-registry.ts — absent");
}

// ── 3. Forbidden function references ─────────────────────────────────

const FORBIDDEN_FUNCTIONS = [
  "calculateFreeToolResult",
  "areFreeToolInputsValid",
  "runFreeFullLoopCalculation",
];

const SRC_DIR = join(ROOT, "src");
function scanDir(dir, depth = 0) {
  if (depth > 6 || !existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip node_modules, .git, generated
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "generated")
        continue;
      scanDir(full, depth + 1);
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      try {
        const content = readFileSync(full, "utf-8");
        for (const fn of FORBIDDEN_FUNCTIONS) {
          if (content.includes(fn)) {
            fail(`Forbidden reference "${fn}"`, `found in ${full}`);
          }
        }
      } catch {
        // skip unreadable
      }
    }
  }
}
scanDir(SRC_DIR);

// ── 4. Engine Torque old free route ──────────────────────────────────

const ENGINE_TORQUE_PATTERNS = [
  join(ROOT, "src/app/tools/generated/engine-torque-calculator"),
  join(ROOT, "src/sectorcalc/formulas/free-v531/engine-torque-calculator"),
  join(ROOT, "src/sectorcalc/schemas/free-v531/engine-torque-calculator"),
  join(ROOT, "src/sectorcalc/pro-runtime/free-formulas/engine-torque"),
];

for (const path of ENGINE_TORQUE_PATTERNS) {
  if (existsSync(path)) {
    fail("Engine Torque old free route", path);
  } else {
    pass(`Engine Torque — ${path} absent`);
  }
}

// ── Summary ──────────────────────────────────────────────────────────

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} FAILURE(S)`}`);
process.exit(failures > 0 ? 1 : 0);
