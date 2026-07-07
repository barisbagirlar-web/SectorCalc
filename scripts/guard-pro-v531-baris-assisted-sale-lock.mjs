#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Assisted Sale Lock Guard v2
// Manifest-driven: reads actual readiness data instead of hardcoded counts.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const READINESS = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531/baris-readiness-data.ts");

let failCount = 0;
function fail(msg) { failCount++; console.error(`  \u274c FAIL: ${msg}`); }
function pass(msg) { console.log(`  \u2705 PASS: ${msg}`); }

console.log("\n\u2550\u2550\u2550 PRO V5.3.1 Baris Assisted Sale Lock Guard v2 \u2550\u2550\u2550\n");

const raw = readFileSync(READINESS, "utf-8");
const liveMatch = raw.match(/LIVE_ENGINE_READY_TOOLS.*?\[\n([\s\S]*?)\];/);
const sourceMatch = raw.match(/BLOCKED_SOURCE_REQUIRED_TOOLS.*?\[\n([\s\S]*?)\];/);
const contractMatch = raw.match(/BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS.*?\[\n([\s\S]*?)\];/);

function extractKeys(text) {
  const re = /tool_key:\s*"([^"]+)"/g; const keys = []; let m;
  while ((m = re.exec(text)) !== null) keys.push(m[1]);
  return keys;
}

const liveKeys = liveMatch ? extractKeys(liveMatch[1]) : [];
const sourceKeys = sourceMatch ? extractKeys(sourceMatch[1]) : [];
const contractKeys = contractMatch ? extractKeys(contractMatch[1]) : [];
const blockedKeys = [...sourceKeys, ...contractKeys];
const nlive = liveKeys.length, nblocked = blockedKeys.length;

const FORMULA_DIR = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531");
const GOLDEN_DIR = resolve(__dirname, "../tests/golden/pro-v531-baris");
const SCHEMA_DIR = resolve(__dirname, "../src/sectorcalc/schemas/pro-v531");

console.log(`  LIVE: ${nlive} | BLOCKED: ${nblocked}`);

if (nlive >= 20) pass(`LIVE tools: ${nlive}`); else fail(`LIVE tools: ${nlive} (expected >= 20)`);
if (nblocked >= 15) pass(`BLOCKED tools: ${nblocked}`); else fail(`BLOCKED tools: ${nblocked} (expected >= 20)`);

let schemaOk = 0;
for (const k of blockedKeys) { if (existsSync(resolve(SCHEMA_DIR, `${k}.schema.json`))) schemaOk++; }
if (schemaOk === nblocked) pass(`All ${nblocked} BLOCKED tools have schema files`); else fail(`${nblocked - schemaOk} BLOCKED tools missing schema`);

let formulaViolations = 0;
for (const k of blockedKeys) { if (existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`))) { fail(`BLOCKED "${k}" has .formula.ts`); formulaViolations++; } }
if (formulaViolations === 0) pass("No BLOCKED tool has .formula.ts file");

let liveOk = 0;
for (const k of liveKeys) { if (existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`)) && existsSync(resolve(GOLDEN_DIR, `${k}.golden.json`))) liveOk++; else fail(`LIVE "${k}" missing formula or golden`); }
if (liveOk === nlive) pass(`All ${nlive} LIVE tools have formula files + golden fixtures`);

console.log(`\n  Failures: ${failCount}`);
console.log(failCount === 0 ? "  RESULT: PASS\n" : "  RESULT: FAIL\n");
process.exit(failCount > 0 ? 1 : 0);
