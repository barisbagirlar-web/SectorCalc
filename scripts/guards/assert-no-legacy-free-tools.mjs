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
 * 3. Forbidden function definitions/imports/invocations (not string literals)
 * 4. Engine Torque old free route files
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

// ── 3. Forbidden functions — only flag actual definitions/imports/calls ──

const FORBIDDEN_FUNCTIONS = [
  "calculateFreeToolResult",
  "areFreeToolInputsValid",
  "runFreeFullLoopCalculation",
];

// Regex patterns:
//   - import ... from "..." (import statement)
//   - function name( (definition)
//   - name( (call — but not inside a string literal)
//   - export function name (export)
//   - export const name (export const)
const FORBIDDEN_PATTERNS = FORBIDDEN_FUNCTIONS.map(
  (fn) => new RegExp(
    `(?:import\\s+.*\\b${fn}\\b|function\\s+${fn}\\s*\\(|export\\s+(?:function|const)\\s+${fn}|[^"'\`]\\b${fn}\\s*\\()`,
  ),
);

const SRC_DIR = join(ROOT, "src");

function scanForForbidden(dir, depth = 0) {
  if (depth > 6 || !existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "generated")
        continue;
      scanForForbidden(full, depth + 1);
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      try {
        const content = readFileSync(full, "utf-8");
        for (let i = 0; i < FORBIDDEN_FUNCTIONS.length; i++) {
          if (FORBIDDEN_PATTERNS[i].test(content)) {
            fail(`Forbidden function "${FORBIDDEN_FUNCTIONS[i]}"`, `active reference in ${full}`);
          }
        }
      } catch {
        // skip unreadable
      }
    }
  }
}
scanForForbidden(SRC_DIR);

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
