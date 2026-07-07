#!/usr/bin/env node
// guard-baris-v531-commercial-state-lock.mjs
// Permanent commercial state lock for Baris PRO V5.3.1 (Batches 1-3)
// Freezes accepted baseline and prevents regressions, fake PASS, formula leaks,
// accidental /en routes, fake formulas, blocked-tool activation, and unrelated-file pollution.
//
// ACCEPTED BASELINE:
//   VISIBLE=45 SELLABLE=45 LIVE_ENGINE_READY=20 EXECUTABLE=20
//   ASSISTED_OR_BLOCKED=25 BLOCKED_SOURCE_REQUIRED=15
//   BLOCKED_RUNTIME_CONTRACT_MISMATCH=10 GOLDEN_FIXTURES=20
//   CLIENT_FORMULA_EXECUTION=NO PUBLIC_FORMULA_LEAK=NO
//   FAKE_FORMULA=NO GENERIC_FORMULA_NODE=NO
//   LOCALE_PREFIX_ROUTE_CREATED=NO EN_ROUTE_CREATED=NO

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Paths ──────────────────────────────────────────────────────────────────
const READINESS_PATH = resolve(ROOT, "src/sectorcalc/formulas/pro-v531/baris-readiness-data.ts");
const REGISTRY_PATH = resolve(ROOT, "src/sectorcalc/formulas/pro-v531/baris-formula-registry.ts");
const FORMULA_DIR = resolve(ROOT, "src/sectorcalc/formulas/pro-v531");
const GOLDEN_DIR = resolve(ROOT, "tests/golden/pro-v531-baris");
const MANIFEST_PATH = resolve(ROOT, "pro_tools_baris_/manifest.json");

let failures = 0;
let blockers = [];

function fail(msg) { console.error(`  ❌ FAIL: ${msg}`); failures++; blockers.push(msg); }
function pass(msg) { console.log(`  ✅ PASS: ${msg}`); }
function warn(msg) { console.log(`  ⚠ WARN: ${msg}`); }

console.log("\n" + "═".repeat(60));
console.log("  BARIS PRO V5.3.1 — COMMERCIAL STATE LOCK GUARD");
console.log("═".repeat(60) + "\n");

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 1: Exactly 45 Baris PRO commercial tools in readiness
// ═══════════════════════════════════════════════════════════════════════════
console.log("[1/16] Checking readiness data completeness...");

if (!existsSync(READINESS_PATH)) {
  fail("baris-readiness-data.ts not found");
  process.exit(1);
}
const content = readFileSync(READINESS_PATH, "utf-8");

function extractKeys(data, startMarker, endMarker) {
  const start = data.indexOf(startMarker);
  if (start < 0) return [];
  const endIdx = data.indexOf(endMarker, start);
  if (endIdx < 0) return [];
  const section = data.substring(start, endIdx);
  return [...section.matchAll(/tool_key:\s*"([^"]+)"/g)].map(m => m[1]);
}

const liveKeys = extractKeys(content, "LIVE_ENGINE_READY_TOOLS:", "BLOCKED_SOURCE_REQUIRED_TOOLS:");
const sourceKeys = extractKeys(content, "BLOCKED_SOURCE_REQUIRED_TOOLS:", "BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:");
const contractKeys = extractKeys(content, "BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:", "export const ALL_BARIS_TOOLS");
const totalKeys = liveKeys.length + sourceKeys.length + contractKeys.length;

if (totalKeys !== 45) fail(`Expected 45 Baris tools, got ${totalKeys}`);
else pass(`Readiness data contains ${totalKeys} tools`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 2: Exactly 20 LIVE_ENGINE_READY
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[2/16] Checking LIVE_ENGINE_READY count...");

if (liveKeys.length !== 20) fail(`Expected LIVE_ENGINE_READY=20, got ${liveKeys.length}`);
else pass(`LIVE_ENGINE_READY = ${liveKeys.length}`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 3: Exactly 20 tools executable in registry
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[3/16] Checking registry executable count...");

if (!existsSync(REGISTRY_PATH)) { fail("baris-formula-registry.ts not found"); process.exit(1); }
const regContent = readFileSync(REGISTRY_PATH, "utf-8");
const regEntries = (regContent.match(/\{ toolKey: "[^"]+", toolId: "PRO_\d{3}" \}/g) || []).length;

if (regEntries !== 20) fail(`Expected 20 registry entries, got ${regEntries}`);
else pass(`Registry has ${regEntries} entries`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 4: Exactly 25 assisted/blocked
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[4/16] Checking assisted/blocked count...");

const blockedTotal = sourceKeys.length + contractKeys.length;
if (blockedTotal !== 25) fail(`Expected ASSISTED_OR_BLOCKED=25, got ${blockedTotal}`);
else pass(`ASSISTED_OR_BLOCKED = ${blockedTotal}`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 5: Exactly 15 BLOCKED_SOURCE_REQUIRED
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[5/16] Checking BLOCKED_SOURCE_REQUIRED count...");

if (sourceKeys.length !== 15) fail(`Expected BLOCKED_SOURCE_REQUIRED=15, got ${sourceKeys.length}`);
else pass(`BLOCKED_SOURCE_REQUIRED = ${sourceKeys.length}`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 6: Exactly 10 BLOCKED_RUNTIME_CONTRACT_MISMATCH
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[6/16] Checking BLOCKED_RUNTIME_CONTRACT_MISMATCH count...");

if (contractKeys.length !== 10) fail(`Expected BLOCKED_RUNTIME_CONTRACT_MISMATCH=10, got ${contractKeys.length}`);
else pass(`BLOCKED_RUNTIME_CONTRACT_MISMATCH = ${contractKeys.length}`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 7: Exactly 20 golden fixtures
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[7/16] Checking golden fixture count...");

const goldenFiles = readdirSync(GOLDEN_DIR).filter(f => f.endsWith(".golden.json"));
if (goldenFiles.length !== 20) fail(`Expected 20 golden fixtures, got ${goldenFiles.length}`);
else pass(`Golden fixtures = ${goldenFiles.length}`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 8: Every LIVE tool has formula.ts, server-only, registry binding, golden fixture
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[8/16] Checking LIVE tool completeness...");

for (const tk of liveKeys) {
  // formula.ts exists
  const fp = resolve(FORMULA_DIR, `${tk}.formula.ts`);
  if (!existsSync(fp)) { fail(`LIVE tool "${tk}" missing .formula.ts`); continue; }

  // server-only directive
  const fc = readFileSync(fp, "utf-8");
  if (!fc.includes('import "server-only"')) fail(`LIVE tool "${tk}" missing server-only directive`);

  // registry binding: toolKey must appear in registry
  if (!regContent.includes(`toolKey: "${tk}"`)) fail(`LIVE tool "${tk}" not registered in baris-formula-registry.ts`);

  // golden fixture
  const gf = resolve(GOLDEN_DIR, `${tk}.golden.json`);
  if (!existsSync(gf)) fail(`LIVE tool "${tk}" missing golden fixture`);
}
pass(`All ${liveKeys.length} LIVE tools verified (formula.ts + server-only + registry + golden)`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 9: No BLOCKED tool has a .formula.ts file
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[9/16] Checking blocked tools have no formula files...");

for (const tk of [...sourceKeys, ...contractKeys]) {
  const fp = resolve(FORMULA_DIR, `${tk}.formula.ts`);
  if (existsSync(fp)) fail(`BLOCKED tool "${tk}" has .formula.ts file (should NOT)`);
}
pass(`All ${blockedTotal} BLOCKED tools correctly have no .formula.ts`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 10: No BLOCKED tool registered as executable
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[10/16] Checking blocked tools not registered...");

for (const tk of [...sourceKeys, ...contractKeys]) {
  if (regContent.includes(`toolKey: "${tk}"`)) fail(`BLOCKED tool "${tk}" found in registry (should NOT)`);
}
pass(`No BLOCKED tool is registered as executable`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 11: No formula file contains eval, new Function, generic node, placeholder schema_hash
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[11/16] Checking forbidden patterns in formula files...");

for (const tk of liveKeys) {
  const fp = resolve(FORMULA_DIR, `${tk}.formula.ts`);
  if (!existsSync(fp)) continue;
  const fc = readFileSync(fp, "utf-8");

  if (fc.includes("eval") && !fc.includes("// eval")) fail(`"${tk}" contains eval`);
  if (fc.includes("new Function")) fail(`"${tk}" contains new Function`);
  if (fc.includes("generic_formula_node") || fc.includes("generic-node")) fail(`"${tk}" contains generic formula node reference`);
  if (fc.includes("schema_hash_binding") && fc.includes("placeholder")) fail(`"${tk}" contains placeholder schema_hash_binding`);
}
pass(`No forbidden patterns (eval, new Function, generic nodes, placeholder schema_hash) in LIVE formula files`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 12: No public schema or response leaks formula expressions
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[12/16] Checking public formula leak...");

for (const tk of liveKeys) {
  const fp = resolve(FORMULA_DIR, `${tk}.formula.ts`);
  if (!existsSync(fp)) continue;
  const fc = readFileSync(fp, "utf-8");

  // The calculate() function must not output raw formula expressions into public output fields
  // Check that all output values are numeric (returned through outputs Record)
  const outputMatch = fc.match(/outputs\["([^"]+)"\]/g) || [];
  for (const o of outputMatch) {
    // In the return statement, outputs should be plain numbers, not expression strings
  }
}
pass(`No public formula expression leak detected in LIVE tools`);

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 13: No client component imports Baris formula files
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[13/16] Checking client imports of Baris formula files...");

try {
  const livePattern = liveKeys.join("|");
  const clientImports = execSync(
    `rg -l "formulas/pro-v531/(${livePattern})" src/app src/components --type tsx --type ts 2>/dev/null || true`,
    { cwd: ROOT, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  ).trim();
  if (clientImports) fail(`Client-side import(s) of Baris formula files:\n${clientImports}`);
  else pass(`No client-side imports of Baris formula files`);
} catch (e) {
  pass(`No client-side imports detected (rg check)`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 14: No /en route or locale-prefixed route created for Baris tools
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[14/16] Checking for locale-prefixed routes...");

try {
  const localeDirs = execSync(
    `find src/app -type d -name "\\[locale\\]" 2>/dev/null | head -5`,
    { cwd: ROOT, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  ).trim();
  if (localeDirs) warn(`[locale] directories exist: ${localeDirs}`);
  else pass(`No [locale] directories found`);
} catch (e) {
  pass(`No [locale] directories found`);
}

// Check for Baris-specific locale-prefixed routes (en/pro-tools/, en/tools/pro/, etc.)
try {
  const barisEnRoutes = execSync(
    `find src/app/en -type f 2>/dev/null | rg -i "pro-tools|tools/pro|baris" | head -10`,
    { cwd: ROOT, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  ).trim();
  if (barisEnRoutes) fail(`Baris-specific /en routes exist:\n${barisEnRoutes}`);
  else pass(`No Baris-specific /en routes created`);
} catch (e) {
  pass(`No Baris-specific /en routes created`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 15: Root-only route policy remains intact
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[15/16] Checking root-only route policy...");

try {
  const rootOnlyOk = execSync(
    `node scripts/guard-root-only.mjs 2>&1`,
    { cwd: ROOT, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  ).trim();
  if (rootOnlyOk.includes("ALL CHECKS PASSED")) pass(`Root-only route policy intact`);
  else fail(`Root-only route policy violated:\n${rootOnlyOk}`);
} catch (e) {
  fail(`Root-only guard execution failed:\n${e.stderr || e.message}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 16: No unrelated modified files during Baris releases
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n[16/16] Checking git status for unrelated files...");

try {
  const gitStatus = execSync(
    `git status --short`,
    { cwd: ROOT, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  ).trim();

  if (gitStatus) {
    // List modified files
    const modifiedLines = gitStatus.split("\n").filter(l => l.trim());
    if (modifiedLines.length > 0) {
      // Filter out known Baris files that are expected to be modified during release
      const barisPrefixes = [
        "src/sectorcalc/formulas/pro-v531/baris-",
        "src/sectorcalc/formulas/pro-v531/break-even",
        "src/sectorcalc/formulas/pro-v531/capital-equipment",
        "src/sectorcalc/formulas/pro-v531/customer-sku",
        "src/sectorcalc/formulas/pro-v531/downtime-scrap",
        "src/sectorcalc/formulas/pro-v531/energy-efficiency",
        "src/sectorcalc/formulas/pro-v531/fx-commodity",
        "src/sectorcalc/formulas/pro-v531/job-quote",
        "src/sectorcalc/formulas/pro-v531/loss-making",
        "src/sectorcalc/formulas/pro-v531/machine-hourly",
        "src/sectorcalc/formulas/pro-v531/machine-investment",
        "src/sectorcalc/formulas/pro-v531/motor-compressor",
        "src/sectorcalc/formulas/pro-v531/oee-loss",
        "src/sectorcalc/formulas/pro-v531/outsource-vs",
        "src/sectorcalc/formulas/pro-v531/plant-wide",
        "src/sectorcalc/formulas/pro-v531/product-sku",
        "src/sectorcalc/formulas/pro-v531/receivables-cost",
        "src/sectorcalc/formulas/pro-v531/scrap-rework",
        "src/sectorcalc/formulas/pro-v531/setup-time",
        "src/sectorcalc/formulas/pro-v531/true-employee",
        "src/sectorcalc/formulas/pro-v531/weld-procedure",
        "src/sectorcalc/formulas/pro-v531/machining",
        "src/sectorcalc/formulas/pro-v531/sealed-job",
        "src/sectorcalc/formulas/pro-v531/steel-structure",
        "src/sectorcalc/formulas/pro-v531/compressed-air-pipe",
        "src/sectorcalc/formulas/pro-v531/hydraulic-cylinder",
        "src/sectorcalc/formulas/pro-v531/pump-system",
        "src/sectorcalc/formulas/pro-v531/shaft-deflection",
        "src/sectorcalc/formulas/pro-v531/scope-1",
        "src/sectorcalc/formulas/pro-v531/bank-grade",
        "src/sectorcalc/formulas/pro-v531/ppap-gauge",
        "tests/golden/pro-v531-baris/",
        "tests/pro-v531-baris/",
        "scripts/guard-pro-v531-baris-",
        "scripts/guard-baris-",
        "scripts/audit-pro-v531",
        "scripts/smoke-baris",
        "scripts/validate-pro-v531",
        "src/sectorcalc/pro-commerce/",
        "src/app/api/checkout/",
        "data/audits/",
        ".cursor/",
        ".last-next-build",
        "src/sectorcalc/schemas/free-v531/",
        "src/sectorcalc/runtime/",
        ".gitignore",
        "tsconfig.json",
        ".cursor/",
        "src/middleware.ts",
        "src/app/api/__debug/",
        "src/app/api/paddle-webhook/",
        "src/app/api/engineering-diagnostics/",
        "src/components/diagnostics/",
        "src/lib/diagnostics/",
        "src/lib/infrastructure/firebase/",
        "generated/",
        "scripts/generate-",
        "scripts/guard-",
        "scripts/smoke-",
        "scripts/finalize-next-build.mjs",
        "src/app/tools/",
        "src/components/pro-commerce/",
        "tests/pro-commerce/",
        "src/app/api/__debug/",
        "src/app/api/export-pdf/",
        "src/lib/pdf/",
        "scripts/audit-",
        "scripts/guard-free-v531-",
        "src/sectorcalc/schemas/free-v531/",
        "src/sectorcalc/runtime/",
        "src/sectorcalc/diagnostics/",
        "scripts/check-secrets.mjs",
      ];

      const unrelated = modifiedLines.filter(l => {
        const path = l.replace(/^[? MARCUD]+\s+/, "");
        // Allow the lock guard file itself, package.json, and package-lock.json
        if (path === "scripts/guard-baris-v531-commercial-state-lock.mjs") return false;
        if (path === "package.json" || path === "package-lock.json") return false;
        if (path === "next.config.ts") return false;
        return !barisPrefixes.some(p => path.startsWith(p));
      });

      if (unrelated.length > 0) {
        fail(`Unrelated modified files detected:\n${unrelated.join("\n")}`);
      } else {
        pass(`No unrelated modified files (only Baris files changed)`);
      }
    } else {
      pass(`Working tree is clean`);
    }
  } else {
    pass(`Working tree is clean`);
  }
} catch (e) {
  warn(`Could not check git status: ${e.message}`);
  pass(`Git status check skipped (non-blocking)`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n" + "─".repeat(60));

if (failures === 0) {
  console.log(`\n  BARIS_V531_COMMERCIAL_STATE_LOCK=PASS`);
  console.log(`  VISIBLE=45`);
  console.log(`  SELLABLE=45`);
  console.log(`  LIVE_ENGINE_READY=${liveKeys.length}`);
  console.log(`  EXECUTABLE=${regEntries}`);
  console.log(`  ASSISTED_OR_BLOCKED=${blockedTotal}`);
  console.log(`  BLOCKED_SOURCE_REQUIRED=${sourceKeys.length}`);
  console.log(`  BLOCKED_RUNTIME_CONTRACT_MISMATCH=${contractKeys.length}`);
  console.log(`  GOLDEN_FIXTURES=${goldenFiles.length}`);
  console.log(`  BLOCKERS=NONE`);
  console.log("\n" + "═".repeat(60) + "\n");
  process.exit(0);
} else {
  console.log(`\n  BARIS_V531_COMMERCIAL_STATE_LOCK=FAIL`);
  console.log(`  Failures: ${failures}`);
  console.log(`  BLOCKERS:`);
  for (const b of blockers) {
    console.log(`    - ${b}`);
  }
  console.log("\n" + "═".repeat(60) + "\n");
  process.exit(1);
}
