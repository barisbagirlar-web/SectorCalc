#!/usr/bin/env node

// Guard: validate Baris PRO V5.3.1 registry binding. Expected: 10 LIVE registered, 35 BLOCKED not registered.

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let failures = 0;
function fail(msg) { console.error(`  ❌ FAIL: ${msg}`); failures++; }
function pass(msg) { console.log(`  ✅ PASS: ${msg}`); }

console.log("\n═══ PRO V5.3.1 Baris Registry Binding Guard ═══\n");

const MF = resolve(ROOT, "pro_tools_baris_/manifest.json");
const SD = resolve(ROOT, "src/sectorcalc/schemas/pro-v531");
const FD = resolve(ROOT, "src/sectorcalc/formulas/pro-v531");
const RD = resolve(FD, "baris-readiness-data.ts");
const REG = resolve(FD, "baris-formula-registry.ts");
const GD = resolve(ROOT, "tests/golden/pro-v531-baris");

if (!existsSync(MF)) { fail("manifest.json not found"); process.exit(1); }
const manifest = JSON.parse(readFileSync(MF, "utf-8"));
const sc = manifest.schemas || [];
if (sc.length !== 45) fail(`Manifest schemas != 45 (${sc.length})`); else pass(`Manifest: ${sc.length} schemas`);

const sfiles = readdirSync(SD).filter(f => f.endsWith(".schema.json"));
if (sfiles.length !== 45) fail(`Schema files != 45 (${sfiles.length})`); else pass(`Schema files: ${sfiles.length}`);

const rc = readFileSync(RD, "utf-8");
function extract(s, e) {
  const a = rc.indexOf(s); if (a<0) return [];
  const b = rc.indexOf(e, a); return [...rc.substring(a, b>0?b:rc.length).matchAll(/tool_key:\s*"([^"]+)"/g)].map(m=>m[1]);
}
const live = extract("LIVE_ENGINE_READY_TOOLS:", "BLOCKED_SOURCE_REQUIRED_TOOLS:");
const source = extract("BLOCKED_SOURCE_REQUIRED_TOOLS:", "BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:");
const contract = extract("BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:", "export const ALL_BARIS_TOOLS");
const blocked = [...source, ...contract];

if (live.length !== 10) fail(`LIVE != 10 (${live.length})`); else pass(`LIVE = ${live.length}`);
if (source.length !== 15) fail(`SOURCE != 15 (${source.length})`); else pass(`SOURCE = ${source.length}`);
if (contract.length !== 20) fail(`CONTRACT != 20 (${contract.length})`); else pass(`CONTRACT = ${contract.length}`);
if (live.length + blocked.length !== 45) fail(`Total != 45`); else pass(`Total = 45`);

for (const tk of live) {
  const fp = resolve(FD, `${tk}.formula.ts`);
  if (!existsSync(fp)) fail(`LIVE "${tk}" missing .formula.ts`);
  else { const c = readFileSync(fp,"utf-8"); if (!c.includes("server-only")) fail(`"${tk}" missing server-only`); }
  if (!existsSync(resolve(GD, `${tk}.golden.json`))) fail(`LIVE "${tk}" missing golden fixture`);
}
pass(`All ${live.length} LIVE tools have .formula.ts + golden fixture`);

for (const tk of blocked) {
  if (existsSync(resolve(FD, `${tk}.formula.ts`))) fail(`BLOCKED "${tk}" has .formula.ts (should NOT)`);
}
pass(`No BLOCKED tool has .formula.ts`);

if (existsSync(REG)) {
  const regc = readFileSync(REG, "utf-8");
  // Count LIVE_TOOLS entries by matching toolKey in the LIVE_TOOLS array
  const liveMatch = regc.match(/\{ toolKey: "[^"]+", toolId: "PRO_\d{3}" \}/g);
  const nreg = liveMatch ? liveMatch.length : 0;
  if (nreg !== 10) fail(`LIVE tool entries in registry != 10 (${nreg})`); else pass(`LIVE tool entries in registry: ${nreg}`);
  for (const tk of live) {
    if (!regc.includes(`"${tk}"`)) fail(`LIVE "${tk}" not in registry`);
  }
  pass(`All ${live.length} LIVE tools in registry`);
  for (const tk of blocked) {
    const re = new RegExp(`register\\([^)]*${tk}[^)]*\\)`, 's');
    if (re.test(regc)) fail(`BLOCKED "${tk}" in register()`);
  }
  pass(`No BLOCKED tool registered`);
}

console.log(`\n  Failures: ${failures}`);
if (failures > 0) { console.log("  RESULT: FAIL\n"); process.exit(1); }
else { console.log("  RESULT: PASS\n"); process.exit(0); }
