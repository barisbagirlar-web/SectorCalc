#!/usr/bin/env node
// guard-baris-v531-runtime-registration-import.mjs
// Permanent runtime registration import guard for Baris PRO V5.3.1 engines.
// Prevents the root-cause regression where baris-formula-registry.ts was not
// imported by the server execution route, making formulaRegistry.register()
// calls never execute at runtime.

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const EXECUTE_ROUTE = resolve(ROOT, "src/app/api/pro-calculator/execute/route.ts");
const REGISTRY_PATH = resolve(ROOT, "src/sectorcalc/formulas/pro-v531/baris-formula-registry.ts");
const READINESS_PATH = resolve(ROOT, "src/sectorcalc/formulas/pro-v531/baris-readiness-data.ts");
const FORMULA_DIR = resolve(ROOT, "src/sectorcalc/formulas/pro-v531");
const GOLDEN_DIR = resolve(ROOT, "tests/golden/pro-v531-baris");

const EXPECTED_IMPORT = `import "@/sectorcalc/formulas/pro-v531/baris-formula-registry"`;

let failures = 0;
let blockers = [];

function fail(msg) { console.error(`  ❌ FAIL: ${msg}`); failures++; blockers.push(msg); }
function pass(msg) { console.log(`  ✅ PASS: ${msg}`); }

console.log("\n" + "═".repeat(60));
console.log("  BARIS V5.3.1 — RUNTIME REGISTRATION IMPORT GUARD");
console.log("═".repeat(60) + "\n");

if (!existsSync(EXECUTE_ROUTE)) { fail("execute route not found"); process.exit(1); }
const routeContent = readFileSync(EXECUTE_ROUTE, "utf-8");
const lines = routeContent.split("\n");

if (!existsSync(REGISTRY_PATH)) { fail("baris-formula-registry.ts not found"); process.exit(1); }
const regContent = readFileSync(REGISTRY_PATH, "utf-8");

if (!existsSync(READINESS_PATH)) { fail("baris-readiness-data.ts not found"); process.exit(1); }
const readContent = readFileSync(READINESS_PATH, "utf-8");

function extractKeys(data, startMarker, endMarker) {
  const start = data.indexOf(startMarker);
  if (start < 0) return [];
  const endIdx = data.indexOf(endMarker, start);
  if (endIdx < 0) return [];
  const section = data.substring(start, endIdx);
  return [...section.matchAll(/tool_key:\s*"([^"]+)"/g)].map(m => m[1]);
}

const liveKeys = extractKeys(readContent, "LIVE_ENGINE_READY_TOOLS:", "BLOCKED_SOURCE_REQUIRED_TOOLS:");
const sourceKeys = extractKeys(readContent, "BLOCKED_SOURCE_REQUIRED_TOOLS:", "BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:");
const contractKeys = extractKeys(readContent, "BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:", "export const ALL_BARIS_TOOLS");

// ── CHECK 1: Import exists at top level ──────────────────────────────────
console.log("[1/5] Checking execute route import...");
const importLine = lines.findIndex(l => l.trim() === EXPECTED_IMPORT || l.trim() === EXPECTED_IMPORT + ";");
if (importLine === -1) { fail(`Missing side-effect import: ${EXPECTED_IMPORT}`); }
else { pass(`Side-effect import found at line ${importLine + 1}`); }

// ── CHECK 2: Top-level (before function/export) ──────────────────────────
const topLevelCheck = lines.slice(0, 45).join("\n");
if (topLevelCheck.includes(EXPECTED_IMPORT) || topLevelCheck.includes(EXPECTED_IMPORT + ";")) {
  pass("Import is top-level (before any function/export block)");
} else { fail("Import must be top-level"); }

// ── CHECK 3: Not dynamic import() ────────────────────────────────────────
const dynamicImportPattern = /import\(\s*["']@\/sectorcalc\/formulas\/pro-v531\/baris-formula-registry/;
if (dynamicImportPattern.test(routeContent)) { fail("Import must not be dynamic import()"); }
else { pass("Import is static (not dynamic import())"); }

// ── CHECK 4: Not inside a function ───────────────────────────────────────
let fnBeforeImport = false;
for (const fnMarker of ["export async function", "export function", "function "]) {
  for (let i = 0; i < Math.min(importLine >= 0 ? importLine : 45, lines.length); i++) {
    if (lines[i].trim().startsWith(fnMarker) && !lines[i].trim().startsWith("function " + "extract")) {
      fnBeforeImport = true;
    }
  }
}
if (fnBeforeImport) { fail("Import appears after function declaration"); }
else { pass("Import is not inside a function body"); }

// ── CHECK 5: Not commented out ───────────────────────────────────────────
const uncommented = lines.filter(l => l.trim() === EXPECTED_IMPORT || l.trim() === EXPECTED_IMPORT + ";");
if (uncommented.length === 0) { fail("Import is commented out or missing"); }
else { pass("Import is not commented out"); }

// ── CHECK 6: Route must not import Baris formula files directly ─────────
console.log("\n[6/5] Checking route does not import Baris formula files directly...");
const barisDirectFormulas = liveKeys.filter(tk => {
  const pattern = `from "@/sectorcalc/formulas/pro-v531/${tk}"`;
  return routeContent.includes(pattern);
});
if (barisDirectFormulas.length > 0) { fail(`Route imports Baris formula files directly: ${barisDirectFormulas.join(", ")}`); }
else { pass("Route does not import Baris formula files directly"); }

// ── CHECK 7: Route imports the registry side-effect entrypoint ──────────
console.log("\n[7/5] Route imports the registry side-effect entrypoint...");
if (routeContent.includes(EXPECTED_IMPORT) || routeContent.includes(EXPECTED_IMPORT + ";")) {
  pass("Route imports the registry side-effect entrypoint");
} else { fail("Route must import the registry side-effect entrypoint"); }

// ── CHECK 8: Registry must register exactly 20 LIVE tools ────────────────
console.log("\n[8/5] Checking registry registers exactly 20 LIVE tools...");
const regEntries = (regContent.match(/\{ toolKey: "[^"]+", toolId: "PRO_\d{3}" \}/g) || []).length;
if (regEntries !== 20) fail(`Expected 20 registry entries, got ${regEntries}`);
else pass(`Registry has ${regEntries} entries`);

// ── CHECK 9: Every LIVE tool must be registered ─────────────────────────
console.log("\n[9/5] Checking every LIVE tool is registered at runtime...");
let allRegistered = true;
for (const tk of liveKeys) {
  if (!regContent.includes(`toolKey: "${tk}"`)) { fail(`LIVE "${tk}" not registered`); allRegistered = false; }
}
if (allRegistered) pass(`All ${liveKeys.length} LIVE tools registered`);

// ── CHECK 10: formula.ts + server-only + golden for each LIVE tool ──────
console.log("\n[10/5] Checking formula + server-only + golden...");
for (const tk of liveKeys) {
  const fp = resolve(FORMULA_DIR, `${tk}.formula.ts`);
  if (!existsSync(fp)) { fail(`LIVE "${tk}" missing .formula.ts`); continue; }
  const fc = readFileSync(fp, "utf-8");
  if (!fc.includes('import "server-only"')) fail(`LIVE "${tk}" missing server-only`);
  if (!existsSync(resolve(GOLDEN_DIR, `${tk}.golden.json`))) fail(`LIVE "${tk}" missing golden`);
}
pass(`All ${liveKeys.length} LIVE tools have formula + server-only + golden`);

// ── CHECK 11: No BLOCKED tool registered ────────────────────────────────
console.log("\n[11/5] Checking no BLOCKED tool is registered...");
let blockedReg = 0;
for (const tk of [...sourceKeys, ...contractKeys]) {
  if (regContent.includes(`toolKey: "${tk}"`)) { fail(`BLOCKED "${tk}" is registered`); blockedReg++; }
}
if (blockedReg === 0) pass("No BLOCKED tool is registered");

// ── SUMMARY ──────────────────────────────────────────────────────────────
console.log("\n" + "─".repeat(60));
if (failures === 0) {
  console.log(`\n  BARIS_V531_RUNTIME_REGISTRATION_IMPORT=PASS`);
  console.log(`  EXECUTE_ROUTE_IMPORT=PASS`);
  console.log(`  LIVE_REGISTERED_TOOLS=${liveKeys.length}`);
  console.log(`  BLOCKED_REGISTERED_TOOLS=${blockedReg}`);
  console.log(`  BLOCKERS=NONE`);
  console.log("\n" + "═".repeat(60) + "\n");
  process.exit(0);
} else {
  console.log(`\n  BARIS_V531_RUNTIME_REGISTRATION_IMPORT=FAIL`);
  console.log(`  BLOCKERS:`);
  for (const b of blockers) { console.log(`    - ${b}`); }
  console.log("\n" + "═".repeat(60) + "\n");
  process.exit(1);
}
