// SectorCalc PRO Engine Governance — Guard: Count Consistency
// Build-time guard. Fails if LIVE tool count != formula module count !=
// golden fixture count != registry binding count.
//
// Expected output:
//   PRO_FORMULA_COUNT_CONSISTENCY=PASS
//   LIVE=20
//   MODULES=20
//   GOLDEN=20
//   REGISTRY=20

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// ── 1. LIVE tools from active-tool-allowlist.ts ──
const ACTIVE_PRO_TOOL_SLUGS = [
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "loss-making-job-detector",
  "receivables-cost-payment-term-addendum",
  "setup-time-reduction-roi-smed",
  "product-sku-margin-ranker",
  "true-employee-cost-statement",
  "job-quote-builder-pro-pack",
  "machine-investment-feasibility-buy-lease-keep",
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "fx-commodity-pass-through-pricer",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "motor-compressor-replacement-roi",
  "weld-procedure-cost-consumable-estimation-suite",
];

const liveCount = ACTIVE_PRO_TOOL_SLUGS.length;

// ── 2. Formula module files ──
const formulaDir = path.join(root, "src/sectorcalc/formulas/pro-v531");
let formulaFiles;
try {
  formulaFiles = fs.readdirSync(formulaDir)
    .filter(f => f.endsWith(".formula.ts"))
    .filter(f => f !== "compressed-air-leak-cost-calculator.formula.ts"); // excluded: typed-op registry only
} catch {
  formulaFiles = [];
}
const moduleCount = formulaFiles.length;

// Verify each module exports calculate()
let validModuleCount = 0;
const moduleKeys = new Set(formulaFiles.map(f => f.replace(".formula.ts", "")));
for (const modKey of moduleKeys) {
  const fp = path.join(formulaDir, `${modKey}.formula.ts`);
  const content = fs.readFileSync(fp, "utf-8");
  if (content.includes("export function calculate") || content.includes("export const calculate")) {
    validModuleCount++;
  }
}

// ── 3. Golden fixtures ──
const goldenDir = path.join(root, "tests/golden/pro-v531-baris");
let goldenFiles;
try {
  goldenFiles = fs.readdirSync(goldenDir).filter(f => f.endsWith(".golden.json"));
} catch {
  goldenFiles = [];
}
const goldenCount = goldenFiles.length;

const goldenKeys = new Set(goldenFiles.map(f => f.replace(".golden.json", "")));

// ── 4. Registry bindings from baris-formula-registry.ts ──
const registryPath = path.join(root, "src/sectorcalc/formulas/pro-v531/baris-formula-registry.ts");
let registryContent;
try {
  registryContent = fs.readFileSync(registryPath, "utf-8");
} catch {
  registryContent = "";
}

const toolIdMatches = registryContent.matchAll(/toolId:\s*"([^"]+)"/g);
const registryIds = new Set([...toolIdMatches].map(m => m[1]));
const registryCount = registryIds.size;

// ── Validation ──
let allConsistent = true;

if (liveCount !== moduleCount) {
  console.log(`INCONSISTENCY: LIVE_TOOLS=${liveCount} != FORMULA_MODULES=${moduleCount}`);
  allConsistent = false;
}
if (moduleCount !== validModuleCount) {
  console.log(`INCONSISTENCY: FORMULA_MODULES=${moduleCount} != VALID_EXPORTS=${validModuleCount}`);
  allConsistent = false;
}
if (liveCount !== goldenCount) {
  console.log(`INCONSISTENCY: LIVE_TOOLS=${liveCount} != GOLDEN_FIXTURES=${goldenCount}`);
  allConsistent = false;
}
if (liveCount !== registryCount) {
  console.log(`INCONSISTENCY: LIVE_TOOLS=${liveCount} != REGISTRY_BINDINGS=${registryCount}`);
  allConsistent = false;
}

// Check module ↔ golden mapping
for (const mk of moduleKeys) {
  if (!goldenKeys.has(mk)) {
    console.log(`MISSING_GOLDEN: formula module "${mk}" has no golden fixture`);
    allConsistent = false;
  }
}
for (const gk of goldenKeys) {
  if (!moduleKeys.has(gk)) {
    console.log(`ORPHAN_GOLDEN: golden fixture "${gk}" has no formula module`);
    allConsistent = false;
  }
}

console.log(`PRO_FORMULA_COUNT_CONSISTENCY=${allConsistent ? "PASS" : "FAIL"}`);
console.log(`LIVE=${liveCount}`);
console.log(`MODULES=${moduleCount}`);
console.log(`VALID_EXPORTS=${validModuleCount}`);
console.log(`GOLDEN=${goldenCount}`);
console.log(`REGISTRY=${registryCount}`);

if (!allConsistent) {
  process.exit(1);
}
process.exit(0);
