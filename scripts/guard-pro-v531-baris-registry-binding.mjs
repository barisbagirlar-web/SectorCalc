#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Registry Binding Guard
// Manifest-driven: reads actual readiness data instead of hardcoded counts.

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const READINESS = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531/baris-readiness-data.ts");
const REGISTRY = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531/baris-formula-registry.ts");

let failCount = 0;
function fail(msg) { failCount++; console.error(`  \u274c FAIL: ${msg}`); }
function pass(msg) { console.log(`  \u2705 PASS: ${msg}`); }

console.log("\n\u2550\u2550\u2550 PRO V5.3.1 Baris Registry Binding Guard \u2550\u2550\u2550\n");

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

const nlive = liveKeys.length, nsource = sourceKeys.length, ncontract = contractKeys.length, ntotal = nlive + nsource + ncontract;

const regRaw = readFileSync(REGISTRY, "utf-8");
const regToolKeys = []; const regRe = /toolKey:\s*"([^"]+)"/g; let m2;
while ((m2 = regRe.exec(regRaw)) !== null) regToolKeys.push(m2[1]);

const FORMULA_DIR = resolve(__dirname, "../src/sectorcalc/formulas/pro-v531");
const GOLDEN_DIR = resolve(__dirname, "../tests/golden/pro-v531-baris");
const SCHEMA_DIR = resolve(__dirname, "../src/sectorcalc/schemas/pro-v531");
let schemaCount = 0;
try { schemaCount = readdirSync(SCHEMA_DIR).filter(f => f.endsWith(".schema.json")).length; } catch {}

console.log(`  Schema files: ${schemaCount}, LIVE: ${nlive}, SOURCE: ${nsource}, CONTRACT: ${ncontract}, Registry: ${regToolKeys.length}`);

if (schemaCount === 45) pass(`Manifest: ${schemaCount} schemas`); else fail(`Manifest schemas: ${schemaCount}`);
if (nlive === 30) pass(`LIVE = ${nlive}`); else fail(`LIVE = ${nlive} (expected 30)`);
if (nsource === 15) pass(`SOURCE = ${nsource}`); else fail(`SOURCE = ${nsource}`);
if (ncontract === 0) pass(`CONTRACT = ${ncontract}`); else fail(`CONTRACT = ${ncontract}`);
if (ntotal === 45) pass(`Total = ${ntotal}`); else fail(`Total = ${ntotal}`);

let liveFilesOk = 0;
for (const k of liveKeys) { if (existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`))) liveFilesOk++; else fail(`LIVE "${k}" missing .formula.ts`); }
if (liveFilesOk === nlive) pass(`All ${nlive} LIVE tools have .formula.ts`);

let blockedViolations = 0;
for (const k of blockedKeys) { if (existsSync(resolve(FORMULA_DIR, `${k}.formula.ts`))) { fail(`BLOCKED "${k}" has .formula.ts`); blockedViolations++; } }
if (blockedViolations === 0) pass("No BLOCKED tool has .formula.ts");

if (regToolKeys.length === nlive) pass(`LIVE tool entries: ${regToolKeys.length}`); else fail(`LIVE tool entries: ${regToolKeys.length} (expected ${nlive})`);

let liveInReg = 0;
for (const k of liveKeys) { if (regToolKeys.includes(k)) liveInReg++; else fail(`LIVE "${k}" NOT in registry`); }
if (liveInReg === nlive) pass(`All ${nlive} LIVE tools in registry`);

let blockedInReg = 0;
for (const k of blockedKeys) { if (regToolKeys.includes(k)) { fail(`BLOCKED "${k}" is registered`); blockedInReg++; } }
if (blockedInReg === 0) pass("No BLOCKED tool registered");

console.log(`\n  Failures: ${failCount}`);
console.log(failCount === 0 ? "  RESULT: PASS\n" : "  RESULT: FAIL\n");
process.exit(failCount > 0 ? 1 : 0);
