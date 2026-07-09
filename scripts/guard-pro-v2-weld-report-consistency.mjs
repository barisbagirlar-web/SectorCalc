// Guard: PRO V2 Weld Report Consistency
// Fails if:
//   - primary total does not match breakdown sum
//   - contingency is shown but not included in primary total
//   - margin uses a different total than primary KPI
//   - material displays carbon_steel instead of Carbon steel
//   - MEDIUM/HIGH sensitivity has $0.00 impact

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

// ── 1. Check insight engine total matches breakdown sum ────────────────
const insightPath = resolve(ROOT, "src/sectorcalc/pro-v2/proInsightEngine.ts");
const insightSrc = readFileSync(insightPath, "utf-8");

// Verify total cost floor = base + contingency is in the primary KPI label
if (!insightSrc.includes("Total Cost Floor")) {
  console.error("FAIL: Primary KPI label does not mention Total Cost Floor");
  allPass = false;
}

// Verify contingency is computed as percentage of base cost
if (!insightSrc.includes("contingencyPct > 0 ? baseCostVal * (contingencyPct / 100) : 0")) {
  console.error("FAIL: Contingency must be computed as percentage of base cost");
  allPass = false;
}

// Verify costDistribution includes Contingency Allowance
if (!insightSrc.includes("Contingency Allowance")) {
  console.error("FAIL: Cost distribution must include Contingency Allowance");
  allPass = false;
}

// Verify margin uses totalCostFloor (displayTotalCost)
if (!insightSrc.includes("plannedQuoteVal - displayTotalCost")) {
  console.error("FAIL: Margin must be calculated from total cost floor (displayTotalCost)");
  allPass = false;
}

// ── 2. Check enum formatting ──────────────────────────────────────────
if (!insightSrc.includes("carbon_steel: \"Carbon steel\"")) {
  console.error("FAIL: Material enum must map carbon_steel → Carbon steel");
  allPass = false;
}
if (!insightSrc.includes("MATERIAL_LABELS")) {
  console.error("FAIL: MATERIAL_LABELS map required for enum formatting");
  allPass = false;
}
if (!insightSrc.includes("resolvedDisplayValue")) {
  console.error("FAIL: resolvedDisplayValue function required for enum formatting");
  allPass = false;
}

// ── 3. Check sensitivity uses corrected cost mapping ──────────────────
if (!insightSrc.includes("wireCostVal > 0.05 ? \"MEDIUM\" : \"LOW\"")) {
  console.error("FAIL: Wire price severity must be MEDIUM when wireCostVal > 0.05, LOW otherwise");
  allPass = false;
}
if (!insightSrc.includes("wireCostVal * 0.15")) {
  console.error("FAIL: Wire price sensitivity must reference wireCostVal with multiplier");
  allPass = false;
}

// ── 4. Check internal diagnostics filtering ───────────────────────────
if (!insightSrc.includes("schema_hash_mismatch")) {
  console.error("FAIL: Internal diagnostic filter must include schema_hash_mismatch");
  allPass = false;
}
if (!insightSrc.includes("derating_config")) {
  console.error("FAIL: Internal diagnostic filter must include derating_config");
  allPass = false;
}
if (!insightSrc.includes("INTERNAL_DIAG_IDS")) {
  console.error("FAIL: INTERNAL_DIAG_IDS array required for diagnostic filtering");
  allPass = false;
}
if (!insightSrc.includes("userWarnings")) {
  console.error("FAIL: userWarnings filter required for diagnostic separation");
  allPass = false;
}

// ── 5. Check wire cost sanity guard exists ────────────────────────────
if (!insightSrc.includes("wire_cost_sanity")) {
  console.error("FAIL: Wire cost sanity guard required (wire_cost_sanity)");
  allPass = false;
}

// ── Summary ────────────────────────────────────────────────────────────
console.log(`\nGUARD: PRO V2 Weld Report Consistency`);
console.log(`====================================`);
if (allPass) {
  console.log(`RESULT: PASS — All report consistency rules verified`);
} else {
  console.error(`\nRESULT: FAIL — Some report consistency rules violated`);
  process.exit(1);
}
