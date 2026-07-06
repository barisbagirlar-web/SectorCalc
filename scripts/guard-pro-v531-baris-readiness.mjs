#!/usr/bin/env node
// guard-pro-v531-baris-readiness.mjs
// Validates Baris PRO readiness classification (Batch 1: LIVE=10, BLOCKED=35)
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_PATH = resolve(ROOT, "src/sectorcalc/formulas/pro-v531/baris-readiness-data.ts");
const FORMULA_DIR = resolve(ROOT, "src/sectorcalc/formulas/pro-v531");
const GOLDEN_DIR = resolve(ROOT, "tests/golden/pro-v531-baris");

let failures = 0;
function fail(msg) { console.error(`  ❌ FAIL: ${msg}`); failures++; }
function pass(msg) { console.log(`  ✅ PASS: ${msg}`); }

console.log("\n═══ PRO V5.3.1 Baris Readiness Guard ═══\n");

if (!existsSync(DATA_PATH)) { fail("baris-readiness-data.ts not found"); process.exit(1); }
const content = readFileSync(DATA_PATH, "utf-8");

function extractKeys(data, startMarker, endMarker) {
  const start = data.indexOf(startMarker);
  if (start < 0) return [];
  const endIdx = data.indexOf(endMarker, start);
  const section = endIdx > 0 ? data.substring(start, endIdx) : data.substring(start);
  return [...section.matchAll(/tool_key:\s*"([^"]+)"/g)].map(m => m[1]);
}

const liveKeys = extractKeys(content, "LIVE_ENGINE_READY_TOOLS:", "BLOCKED_SOURCE_REQUIRED_TOOLS:");
const sourceKeys = extractKeys(content, "BLOCKED_SOURCE_REQUIRED_TOOLS:", "BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:");
const contractKeys = extractKeys(content, "BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:", "export const ALL_BARIS_TOOLS");

console.log(`  LIVE: ${liveKeys.length}`);
console.log(`  BLOCKED_SOURCE_REQUIRED: ${sourceKeys.length}`);
console.log(`  BLOCKED_RUNTIME_CONTRACT_MISMATCH: ${contractKeys.length}`);
console.log(`  TOTAL: ${liveKeys.length + sourceKeys.length + contractKeys.length}`);

// Check counts
if (liveKeys.length !== 20) fail(`Expected LIVE=20 (Batches 1+2), got ${liveKeys.length}`);
else pass(`LIVE_ENGINE_READY = ${liveKeys.length}`);

if (sourceKeys.length !== 15) fail(`Expected BLOCKED_SOURCE=15, got ${sourceKeys.length}`);
else pass(`BLOCKED_SOURCE_REQUIRED = 15`);

if (contractKeys.length !== 10) fail(`Expected BLOCKED_CONTRACT=10, got ${contractKeys.length}`);
else pass(`BLOCKED_RUNTIME_CONTRACT_MISMATCH = ${contractKeys.length}`);

if (liveKeys.length + sourceKeys.length + contractKeys.length !== 45) fail("Total != 45");
else pass(`Total classified = 45`);

// Verify no duplicates
const allKeys = [...liveKeys, ...sourceKeys, ...contractKeys];
const unique = new Set(allKeys);
if (unique.size !== allKeys.length) fail("Duplicate tool keys found");
else pass("No duplicate tool keys");

// Verify LIVE tools have formula files + golden fixtures
for (const tk of liveKeys) {
  const formulaFile = `${FORMULA_DIR}/${tk}.formula.ts`;
  if (!existsSync(formulaFile)) fail(`LIVE "${tk}" missing .formula.ts`);
  const goldenFile = `${GOLDEN_DIR}/${tk}.golden.json`;
  if (!existsSync(goldenFile)) fail(`LIVE "${tk}" missing golden fixture`);
}
pass(`All ${liveKeys.length} LIVE tools have .formula.ts + golden fixture`);

// Verify BLOCKED tools have NO .formula.ts files
for (const tk of [...sourceKeys, ...contractKeys]) {
  const formulaFile = `${FORMULA_DIR}/${tk}.formula.ts`;
  if (existsSync(formulaFile)) fail(`BLOCKED "${tk}" has unexpected .formula.ts`);
}
pass(`All ${sourceKeys.length + contractKeys.length} BLOCKED tools correctly have no .formula.ts`);

console.log(`\n  Failures: ${failures}`);
if (failures > 0) { console.log("  RESULT: FAIL\n"); process.exit(1); }
else { console.log("  RESULT: PASS\n"); process.exit(0); }
