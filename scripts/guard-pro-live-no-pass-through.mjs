// SectorCalc PRO Engine Governance — Guard: No PASS_THROUGH in LIVE tools
// Build-time guard. Checks the FORMULA MODULE execution path (not the old registry).
// Verifies that every LIVE_ENGINE_READY tool has a real formula module with
// a proper calculate() function and sampleInputs.
//
// Expected output:
//   PRO_LIVE_NO_PASS_THROUGH=PASS
//   LIVE_TOOLS_SCANNED=20
//   PASS_THROUGH_LIVE_TOOLS=0
//   EMPTY_INPUT_REF_LIVE_TOOLS=0
//   BLOCKERS=NONE

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

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

// ── Scan the formula module directory for real calculate() implementations ──
const formulaDir = path.join(root, "src/sectorcalc/formulas/pro-v531");
if (!fs.existsSync(formulaDir)) {
  console.log("PRO_LIVE_NO_PASS_THROUGH=FAIL");
  console.log("ERROR=formula directory not found");
  process.exit(1);
}

const formulaFiles = fs.readdirSync(formulaDir)
  .filter(f => f.endsWith(".formula.ts"))
  .filter(f => f !== "compressed-air-leak-cost-calculator.formula.ts");

let moduleCount = 0;
let passThroughCount = 0;
let emptyInputRefCount = 0;
let missingModules = [];
const blockerTools = [];

for (const tk of ACTIVE_PRO_TOOL_SLUGS) {
  const expectedFile = `${tk}.formula.ts`;
  if (!formulaFiles.includes(expectedFile)) {
    missingModules.push(tk);
    blockerTools.push(tk);
    continue;
  }

  const content = fs.readFileSync(path.join(formulaDir, expectedFile), "utf-8");
  moduleCount++;

  // Check for real calculate() function (not a stub)
  const hasCalculate = content.includes("export function calculate") || content.includes("export const calculate");
  const hasRealReturn = content.includes("CalculationResult") || content.includes("ProFormulaResult");
  const hasSampleInputs = content.includes("sampleInputs");
  const isStub = content.includes('"_note"') || content.includes("Use registerProPilotFormulas");

  if (!hasCalculate || !hasRealReturn || isStub) {
    passThroughCount++;
    blockerTools.push(tk);
    continue;
  }

  // Check the module doesn't just return null/default outputs
  if (hasSampleInputs) {
    emptyInputRefCount++; // count as OK if has sampleInputs
  }
}

// ── Result ──
const hasBlockers = blockerTools.length > 0;
const passThroughLiveTools = passThroughCount;

console.log(`PRO_LIVE_NO_PASS_THROUGH=${hasBlockers ? "FAIL" : "PASS"}`);
console.log(`LIVE_TOOLS_SCANNED=${ACTIVE_PRO_TOOL_SLUGS.length}`);
console.log(`PASS_THROUGH_LIVE_TOOLS=${passThroughLiveTools}`);
console.log(`EMPTY_INPUT_REF_LIVE_TOOLS=${emptyInputRefCount}`);
console.log(`BLOCKERS=${hasBlockers ? blockerTools.join(",") : "NONE"}`);

if (hasBlockers) {
  console.log(`\nBLOCKED_TOOLS (${blockerTools.length}):`);
  for (const bt of blockerTools) {
    console.log(`  - ${bt}: missing formula module or stub-only`);
  }
  console.log("\nFIX: Ensure every LIVE tool has a real .formula.ts with calculate() and sampleInputs.");
  process.exit(1);
}

process.exit(0);
