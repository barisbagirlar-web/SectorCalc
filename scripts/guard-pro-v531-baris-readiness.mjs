#!/usr/bin/env node

// guard-pro-v531-baris-readiness.mjs
//
// Validates Barış PRO V5.3.1 tool classification consistency:
//   1. All 45 manifest tools are classified (none unclassified)
//   2. No tool appears in more than one category
//   3. LIVE_ENGINE_READY tools have a corresponding .formula.ts file
//   4. BLOCKED_* tools do NOT have a corresponding .formula.ts file
//   5. Exits 0 (PASS) on valid, 1 (FAIL) on issues.
//
// Only Node.js built-in modules (fs, path). No external dependencies.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── Paths ──────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const MANIFEST_PATH = path.join(ROOT, "pro_tools_baris_", "manifest.json");
const DATA_PATH = path.join(
  ROOT,
  "src",
  "sectorcalc",
  "formulas",
  "pro-v531",
  "baris-readiness-data.ts",
);
const FORMULAS_DIR = path.join(
  ROOT,
  "src",
  "sectorcalc",
  "formulas",
  "pro-v531",
);

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Extract tool_key values from a named array in the TS data file.
 * Handles both:
 *   - `export const NAME: string[] = ["key1", "key2"]`
 *   - `export const NAME: BarisReadinessRecord[] = [{tool_key: "key1", ...}, ...]`
 */
function extractToolKeys(content, name) {
  // Find the array block for `export const NAME: TYPE = [...]`
  const re = new RegExp(
    `export\\s+const\\s+${name}\\s*:\\s*(?:string\\[\\]|BarisReadinessRecord\\[\\])\\s*=\\s*\\[([\\s\\S]*?)\\];`,
  );
  const match = content.match(re);
  if (!match) return [];
  const body = match[1];

  // First try: extract tool_key values from objects `tool_key: "..."` or `tool_key: '...'`
  const toolKeyRe = /tool_key\s*:\s*"([^"]*)"|tool_key\s*:\s*'([^']*)'/g;
  const keys = [];
  let m;
  while ((m = toolKeyRe.exec(body)) !== null) {
    keys.push(m[1] ?? m[2]);
  }
  if (keys.length > 0) return keys;

  // Fallback: extract bare string literals
  const strRe = /"([^"]*)"|'([^']*)'/g;
  while ((m = strRe.exec(body)) !== null) {
    keys.push(m[1] ?? m[2]);
  }
  return keys;
}

/** Read manifest and return the set of tool_keys */
function readManifestToolKeys() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error("FAIL — Manifest not found:", MANIFEST_PATH);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  if (!Array.isArray(raw.schemas)) {
    console.error("FAIL — Manifest has no 'schemas' array");
    process.exit(1);
  }
  return raw.schemas.map((s) => s.tool_key);
}

/** Read classification data from TS file */
function readClassification() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error("FAIL — Data file not found:", DATA_PATH);
    process.exit(1);
  }
  const content = fs.readFileSync(DATA_PATH, "utf-8");

  return {
    live: new Set(
      extractToolKeys(content, "LIVE_ENGINE_READY_TOOLS"),
    ),
    blockedSource: new Set(
      extractToolKeys(content, "BLOCKED_SOURCE_REQUIRED_TOOLS"),
    ),
    blockedContract: new Set(
      extractToolKeys(
        content,
        "BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS",
      ),
    ),
  };
}

/** Check if a .formula.ts file exists for the given tool_key */
function formulaFileExists(toolKey) {
  const filePath = path.join(FORMULAS_DIR, `${toolKey}.formula.ts`);
  return fs.existsSync(filePath);
}

/** Check if the tool_key is registered in the baris-formula-registry.ts */
function inBarisRegistry(toolKey) {
  const registryPath = path.join(FORMULAS_DIR, "baris-formula-registry.ts");
  if (!fs.existsSync(registryPath)) return false;
  const content = fs.readFileSync(registryPath, "utf-8");
  return content.includes(`"${toolKey}"`);
}

// ── Main ───────────────────────────────────────────────────────────

const manifestKeys = readManifestToolKeys();
const expectedTotal = manifestKeys.length;
console.log(`\n  Manifest tool count: ${expectedTotal}`);

const cls = readClassification();

// ── 1. Check coverage (no unclassified tools) ──────────────────────
const allClassified = new Set([
  ...cls.live,
  ...cls.blockedSource,
  ...cls.blockedContract,
]);

const unclassified = manifestKeys.filter((k) => !allClassified.has(k));
const covered = manifestKeys.filter((k) => allClassified.has(k));

if (unclassified.length > 0) {
  console.log(
    `  UNCLASSIFIED: ${unclassified.length} tool(s) not in any category`,
  );
  unclassified.forEach((k) => console.log(`    - ${k}`));
} else {
  console.log(`  Coverage: ${covered.length}/${expectedTotal} (all classified)`);
}

// ── 2. Check no tool appears in more than one category ────────────
const categoryMap = {};
for (const k of cls.live) {
  (categoryMap[k] = categoryMap[k] || []).push("LIVE_ENGINE_READY");
}
for (const k of cls.blockedSource) {
  (categoryMap[k] = categoryMap[k] || []).push("BLOCKED_SOURCE_REQUIRED");
}
for (const k of cls.blockedContract) {
  (categoryMap[k] = categoryMap[k] || []).push(
    "BLOCKED_RUNTIME_CONTRACT_MISMATCH",
  );
}

const duplicates = Object.entries(categoryMap).filter(
  ([, cats]) => cats.length > 1,
);

if (duplicates.length > 0) {
  console.log(
    `  DUPLICATES: ${duplicates.length} tool(s) in multiple categories`,
  );
  duplicates.forEach(([k, cats]) =>
    console.log(`    - ${k} appears in: ${cats.join(", ")}`),
  );
} else {
  console.log("  No duplicates (each tool in exactly one category)");
}

// ── 3. Check formula.ts file existence consistency ─────────────────
const formulaIssues = [];

for (const k of cls.live) {
  if (!formulaFileExists(k) && !inBarisRegistry(k)) {
    formulaIssues.push(
      `  LIVE tool "${k}" is MISSING its .formula.ts file and NOT in baris-formula-registry.ts`,
    );
  }
}

for (const k of cls.blockedSource) {
  if (formulaFileExists(k)) {
    formulaIssues.push(
      `  BLOCKED_SOURCE tool "${k}" has a .formula.ts file (should NOT)`,
    );
  }
}

for (const k of cls.blockedContract) {
  if (formulaFileExists(k)) {
    formulaIssues.push(
      `  BLOCKED_CONTRACT tool "${k}" has a .formula.ts file (should NOT)`,
    );
  }
}

if (formulaIssues.length > 0) {
  console.log(`  Formula consistency issues: ${formulaIssues.length}`);
  formulaIssues.forEach((issue) => console.log(`    ${issue}`));
} else {
  console.log("  Formula file consistency: PASS");
}

// ── Summary ────────────────────────────────────────────────────────
const liveCount = cls.live.size;
const blockedSourceCount = cls.blockedSource.size;
const blockedContractCount = cls.blockedContract.size;

console.log("\n  ── Classification Summary ──");
console.log(`  LIVE_ENGINE_READY:                   ${liveCount}`);
console.log(`  BLOCKED_SOURCE_REQUIRED:              ${blockedSourceCount}`);
console.log(`  BLOCKED_RUNTIME_CONTRACT_MISMATCH:    ${blockedContractCount}`);
console.log(`  Unclassified:                         ${unclassified.length}`);
console.log(`  Duplicates:                           ${duplicates.length}`);
console.log(`  Formula file issues:                  ${formulaIssues.length}`);
console.log(`  Total classified:                     ${covered.length}/${expectedTotal}`);
console.log("");

// ── Exit ───────────────────────────────────────────────────────────
const hasError =
  unclassified.length > 0 ||
  duplicates.length > 0 ||
  formulaIssues.length > 0;

if (hasError) {
  console.log("  RESULT: FAIL — classification issues found\n");
  process.exit(1);
} else {
  console.log("  RESULT: PASS — all checks valid\n");
  process.exit(0);
}
