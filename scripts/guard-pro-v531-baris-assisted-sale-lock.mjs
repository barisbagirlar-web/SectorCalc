#!/usr/bin/env node
// Guard: verify 35 blocked tools cannot execute, 10 LIVE tools are executable
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const FORMULA_DIR = resolve(ROOT, "src/sectorcalc/formulas/pro-v531");
const READINESS_PATH = resolve(FORMULA_DIR, "baris-readiness-data.ts");
const REGISTRY_PATH = resolve(FORMULA_DIR, "baris-formula-registry.ts");
const GOLDEN_DIR = resolve(ROOT, "tests/golden/pro-v531-baris");

let failures = 0;
function fail(msg) { console.error(`  ❌ FAIL: ${msg}`); failures++; }
function pass(msg) { console.log(`  ✅ PASS: ${msg}`); }

console.log("\n═══ PRO V5.3.1 Baris Assisted Sale Lock Guard ═══\n");

if (!existsSync(READINESS_PATH)) { fail("baris-readiness-data.ts not found"); process.exit(1); }
const content = readFileSync(READINESS_PATH, "utf-8");

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
const allBlocked = [...sourceKeys, ...contractKeys];

if (liveKeys.length !== 10) fail(`Expected 10 LIVE, got ${liveKeys.length}`);
else pass(`LIVE tools: ${liveKeys.length}`);

if (allBlocked.length !== 35) fail(`Expected 35 BLOCKED, got ${allBlocked.length}`);
else pass(`BLOCKED tools: ${allBlocked.length}`);

// Check all blocked tools exist in schema dir
const schemaDir = resolve(ROOT, "src/sectorcalc/schemas/pro-v531");
const schemaFiles = readdirSync(schemaDir).filter(f => f.endsWith(".schema.json"));
const schemaKeys = new Set(schemaFiles.map(f => f.replace(".schema.json", "")));
for (const tk of allBlocked) {
  if (!schemaKeys.has(tk)) fail(`BLOCKED tool "${tk}" missing schema file`);
}
pass(`All ${allBlocked.length} BLOCKED tools have schema files`);

// Check no blocked tool has formula file
for (const tk of allBlocked) {
  const formulaPath = resolve(FORMULA_DIR, `${tk}.formula.ts`);
  if (existsSync(formulaPath)) fail(`BLOCKED tool "${tk}" has .formula.ts file (should NOT)`);
}
pass(`No BLOCKED tool has .formula.ts file`);

// Check LIVE tools have formula files + golden fixtures
for (const tk of liveKeys) {
  const formulaPath = resolve(FORMULA_DIR, `${tk}.formula.ts`);
  if (!existsSync(formulaPath)) fail(`LIVE tool "${tk}" missing .formula.ts`);
  else {
    const fc = readFileSync(formulaPath, "utf-8");
    if (!fc.includes("server-only")) fail(`LIVE tool "${tk}" missing server-only`);
    if (!fc.includes("export function calculate")) fail(`LIVE tool "${tk}" missing calculate()`);
  }
  const goldenPath = resolve(GOLDEN_DIR, `${tk}.golden.json`);
  if (!existsSync(goldenPath)) fail(`LIVE tool "${tk}" missing golden fixture`);
}
pass(`All ${liveKeys.length} LIVE tools have formula files + golden fixtures`);

// Check registry registers exactly 10 tools
if (existsSync(REGISTRY_PATH)) {
  const regContent = readFileSync(REGISTRY_PATH, "utf-8");
  const regCalls = (regContent.match(/formulaRegistry\.register\(/g) || []).length;
  if (regCalls !== 10) fail(`Expected 10 register() calls, found ${regCalls}`);
  else pass(`Registry has ${regCalls} register() calls`);
}

console.log(`\n  Failures: ${failures}`);
if (failures > 0) { console.log("  RESULT: FAIL\n"); process.exit(1); }
else { console.log("  RESULT: PASS\n"); process.exit(0); }
