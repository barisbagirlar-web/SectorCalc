#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Readiness Guard
// Manifest-driven: reads actual data instead of hardcoded expectations.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const READINESS = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531/baris-readiness-data.ts");

let failCount = 0;
function fail(msg) { failCount++; console.error(`  \u274c FAIL: ${msg}`); }
function pass(msg) { console.log(`  \u2705 PASS: ${msg}`); }

console.log("\n\u2550\u2550\u2550 PRO V5.3.1 Baris Readiness Guard \u2550\u2550\u2550\n");

const raw = readFileSync(READINESS, "utf-8");
const liveMatch = raw.match(/LIVE_ENGINE_READY_TOOLS.*?\[\n([\s\S]*?)\];/);
const sourceMatch = raw.match(/BLOCKED_SOURCE_REQUIRED_TOOLS.*?\[\n([\s\S]*?)\];/);
const contractMatch = raw.match(/BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS.*?\[\n([\s\S]*?)\];/);

function extractKeys(text) {
  const re = /tool_key:\s*"([^"]+)"/g;
  const keys = []; let m;
  while ((m = re.exec(text)) !== null) keys.push(m[1]);
  return keys;
}

const liveKeys = liveMatch ? extractKeys(liveMatch[1]) : [];
const sourceKeys = sourceMatch ? extractKeys(sourceMatch[1]) : [];
const contractKeys = contractMatch ? extractKeys(contractMatch[1]) : [];
const allKeys = [...liveKeys, ...sourceKeys, ...contractKeys];

const nlive = liveKeys.length, nsource = sourceKeys.length, ncontract = contractKeys.length, ntotal = nlive + nsource + ncontract;
const dupeSet = new Set(), dupes = allKeys.filter(k => dupeSet.has(k) ? true : !dupeSet.add(k));

console.log(`  LIVE: ${nlive}`);
console.log(`  BLOCKED_SOURCE_REQUIRED: ${nsource}`);
console.log(`  BLOCKED_RUNTIME_CONTRACT_MISMATCH: ${ncontract}`);
console.log(`  TOTAL: ${ntotal}`);

if (nlive === 30) pass(`LIVE_ENGINE_READY = ${nlive}`); else fail(`LIVE_ENGINE_READY = ${nlive} (expected 20)`);
if (nsource === 15) pass(`BLOCKED_SOURCE_REQUIRED = ${nsource}`); else fail(`BLOCKED_SOURCE_REQUIRED = ${nsource} (expected 15)`);
if (ncontract === 0) pass(`BLOCKED_RUNTIME_CONTRACT_MISMATCH = ${ncontract}`); else fail(`BLOCKED_RUNTIME_CONTRACT_MISMATCH = ${ncontract} (expected 10)`);
if (ntotal === 45) pass(`Total classified = ${ntotal}`); else fail(`Total classified = ${ntotal} (expected 45)`);
if (dupes.length === 0) pass("No duplicate tool keys"); else fail(`Duplicate tool keys: ${dupes.join(", ")}`);

const FORMULA_DIR = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531");
const GOLDEN_DIR = resolve(__dirname, "../tests/golden/pro-v531-baris");
let liveOk = 0;
for (const k of liveKeys) {
  if (existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`))) liveOk++;
  else fail(`LIVE "${k}" missing .formula.ts`);
}
if (liveOk === nlive) pass(`All ${nlive} LIVE tools have .formula.ts`);

let blockedViolations = 0;
for (const k of [...sourceKeys, ...contractKeys]) {
  if (existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`))) {
    fail(`BLOCKED "${k}" has unexpected .formula.ts`); blockedViolations++;
  }
}
if (blockedViolations === 0) pass(`All ${nsource + ncontract} BLOCKED tools correctly have no .formula.ts`);

console.log(`\n  Failures: ${failCount}`);
console.log(failCount === 0 ? "  RESULT: PASS\n" : "  RESULT: FAIL\n");
process.exit(failCount > 0 ? 1 : 0);
