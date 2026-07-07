#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Registry Binding Guard
// Manifest-driven: verifies all LIVE tools have registry entries,
// blocked tools have NO registry entries.
// Reads actual data from baris-readiness-data.ts and baris-formula-registry.ts.

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let failCount = 0;
function fail(msg) { failCount++; console.log(`  ❌ FAIL: ${msg}`); }
function pass(msg) { console.log(`  ✅ PASS: ${msg}`); }

console.log(`\n${"═".repeat(50)}`);
console.log("Registry Binding Guard (manifest-driven)");
console.log(`${"═".repeat(50)}\n`);

const SCHEMA_DIR = resolve(__dirname, "../src/sectorcalc/schemas/pro-v531");
const FORMULA_DIR = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531");
const READINESS_FILE = resolve(FORMULA_DIR, "baris-readiness-data.ts");
const REGISTRY_FILE = resolve(FORMULA_DIR, "baris-formula-registry.ts");

function extractKeys(text) {
  const re = /tool_key:\s*"([^"]+)"/g;
  const keys = [];
  let m;
  while ((m = re.exec(text)) !== null) keys.push(m[1]);
  return keys;
}

const raw = readFileSync(READINESS_FILE, "utf-8");
const regRaw = readFileSync(REGISTRY_FILE, "utf-8");

const liveMatch = raw.match(/LIVE_ENGINE_READY_TOOLS.*?\[\n([\s\S]*?)\];/);
const sourceMatch = raw.match(/BLOCKED_SOURCE_REQUIRED_TOOLS.*?\[\n([\s\S]*?)\];/);
const contractMatch = raw.match(/BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS.*?\[\n([\s\S]*?)\];/);

const liveKeys = liveMatch ? extractKeys(liveMatch[1]) : [];
const sourceKeys = sourceMatch ? extractKeys(sourceMatch[1]) : [];
const contractKeys = contractMatch ? extractKeys(contractMatch[1]) : [];
const blockedKeys = [...sourceKeys, ...contractKeys];

const nlive = liveKeys.length, nsource = sourceKeys.length, ncontract = contractKeys.length, ntotal = nlive + nsource + ncontract;

// Count registry entries (toolKey in baris-formula-registry.ts)
const regRe = /toolKey:\s*"([^"]+)"/g;
const regToolKeys = [];
let rm;
while ((rm = regRe.exec(regRaw)) !== null) regToolKeys.push(rm[1]);

// Schema manifest count
const schemaFiles = readdirSync(SCHEMA_DIR).filter(f => f.endsWith(".schema.json"));
const schemaCount = schemaFiles.length;

console.log(`  Schema files: ${schemaCount}, LIVE: ${nlive}, SOURCE: ${nsource}, CONTRACT: ${ncontract}, Registry: ${regToolKeys.length}`);

// Counts
if (nlive === 20) pass(`LIVE = ${nlive}`); else fail(`LIVE = ${nlive} (expected 20)`);
if (nsource === 15) pass(`SOURCE = ${nsource}`); else fail(`SOURCE = ${nsource} (expected 15)`);
if (ncontract === 10) pass(`CONTRACT = ${ncontract}`); else fail(`CONTRACT = ${ncontract} (expected 10)`);
if (ntotal === 45) pass(`Total = ${ntotal}`); else fail(`Total = ${ntotal} (expected 45)`);

// LIVE tools must have formula files and be in registry
let liveFilesOk = 0;
for (const k of liveKeys) {
  if (existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`))) liveFilesOk++;
  else fail(`LIVE "${k}" missing .formula.ts`);
}
if (liveFilesOk === nlive) pass(`All ${nlive} LIVE tools have .formula.ts`);

// Registry contains all LIVE tools
const regSet = new Set(regToolKeys);
let liveInReg = 0;
for (const k of liveKeys) { if (regSet.has(k)) liveInReg++; else fail(`LIVE "${k}" NOT in registry`); }
if (liveInReg === nlive) pass(`All ${nlive} LIVE tools in registry`);

// BLOCKED tools must NOT be in registry
let blockedInReg = 0;
for (const k of blockedKeys) { if (regSet.has(k)) { blockedInReg++; fail(`BLOCKED "${k}" registered in formula registry`); } }
if (blockedInReg === 0) pass(`No BLOCKED tool registered`);
else fail(`${blockedInReg} BLOCKED tools incorrectly registered`);

// BLOCKED tools must NOT have formula files
let blockedFileCount = 0;
for (const k of blockedKeys) {
  if (existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`))) {
    blockedFileCount++;
    fail(`BLOCKED "${k}" has .formula.ts (should NOT)`);
  }
}
if (blockedFileCount === 0) pass(`No BLOCKED tool has .formula.ts`);

console.log(`\n  Failures: ${failCount}`);
if (failCount === 0) console.log("  RESULT: PASS\n");
else console.log("  RESULT: FAIL\n");
process.exit(failCount > 0 ? 1 : 0);
