// SectorCalc PRO V2 — Product SKU Margin Ranker Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_unit_price: 100,
    n_material_cost_per_unit: 25,
    n_labor_cost_per_unit: 15,
    n_overhead_per_unit: 10,
    n_logistics_cost_per_unit: 5,
    n_annual_volume_units: 10000,
    n_target_margin_percent: 30,
    n_total_portfolio_revenue: 5000000,
    n_total_portfolio_profit: 1000000,
    ...overrides,
  };
}

function run(overrides: Record<string, number> = {}) {
  return calculate(buildInputs(overrides));
}

function allFinite(label: string, overrides: Record<string, number> = {}) {
  const res = run(overrides);
  const ok = Object.values(res.outputs).every((v) => typeof v === "number" && Number.isFinite(v));
  assert(ok, `${label}: all finite`);
}

console.log("\n=== PRODUCT SKU MARGIN RANKER — EDGE TESTS ===\n");

// ── A. Golden fixture — Profitable SKU (GOOD state) ────────────────
console.log("A. PROFITABLE SKU (GOOD state)");
const prof = run().outputs;
assert(prof.out_sku_revenue === 1000000, "revenue = 1,000,000");
assert(prof.out_contribution_margin_percent === 45, "contribution margin = 45%");
assert(prof.out_final_decision_state === 0, "state = GOOD (0)");
assert(prof.out_margin_classification === 0, "margin class = 0 (healthy)");
assert(prof.out_contribution_amount > 0, "contribution positive");
allFinite("A");

// ── B. Weak Margin SKU (REVIEW state) ──────────────────────────────
console.log("\nB. WEAK MARGIN SKU (REVIEW state)");
const weakInputs = buildInputs({
  n_unit_price: 80,
  n_material_cost_per_unit: 35,
  n_labor_cost_per_unit: 20,
  n_overhead_per_unit: 12,
  n_logistics_cost_per_unit: 8,
  n_annual_volume_units: 5000,
  n_target_margin_percent: 30,
  n_total_portfolio_revenue: 3000000,
  n_total_portfolio_profit: 400000,
});
const weak = run(weakInputs).outputs;
assert(weak.out_final_decision_state === 1, "state = REVIEW (1)");
assert(weak.out_margin_classification === 2, "margin class = 2 (low)");
assert(weak.out_contribution_margin_percent > 0, "contribution margin positive but weak");
assert(weak.out_contribution_margin_percent < 30, "contribution margin below target");
allFinite("B", weakInputs);

// ── C. Loss-Making SKU (BLOCKED state) ─────────────────────────────
console.log("\nC. LOSS-MAKING SKU (BLOCKED state)");
const lossInputs = buildInputs({
  n_unit_price: 50,
  n_material_cost_per_unit: 30,
  n_labor_cost_per_unit: 20,
  n_overhead_per_unit: 15,
  n_logistics_cost_per_unit: 10,
  n_annual_volume_units: 1000,
  n_target_margin_percent: 20,
  n_total_portfolio_revenue: 1000000,
  n_total_portfolio_profit: 100000,
});
const loss = run(lossInputs).outputs;
assert(loss.out_final_decision_state === 2, "state = BLOCKED (2)");
assert(loss.out_margin_classification === 3, "margin class = 3 (negative)");
assert(loss.out_contribution_amount < 0, "negative contribution");
assert(loss.out_contribution_margin_percent < 0, "negative contribution margin");
allFinite("C", lossInputs);

// ── D. Zero price ──────────────────────────────────────────────────
console.log("\nD. ZERO PRICE");
const zeroPrice = run({ n_unit_price: 0 }).outputs;
assert(zeroPrice.out_final_decision_state === 1, "price=0 → REVIEW");
allFinite("D", { n_unit_price: 0 });

// ── E. Zero volume ─────────────────────────────────────────────────
console.log("\nE. ZERO VOLUME");
const zeroVol = run({ n_annual_volume_units: 0 }).outputs;
assert(zeroVol.out_final_decision_state === 0, "volume=0 → GOOD");
allFinite("E", { n_annual_volume_units: 0 });

// ── F. Zero portfolio revenue (division by zero safety) ────────────
console.log("\nF. ZERO PORTFOLIO REVENUE");
const zeroPR = run({ n_total_portfolio_revenue: 0, n_total_portfolio_profit: 0 }).outputs;
assert(Number.isFinite(zeroPR.out_revenue_share_percent), "revenue share finite with zero portfolio");
assert(Number.isFinite(zeroPR.out_profit_share_percent), "profit share finite with zero portfolio");
allFinite("F", { n_total_portfolio_revenue: 0, n_total_portfolio_profit: 0 });

// ── G. Negative inputs ─────────────────────────────────────────────
console.log("\nG. NEGATIVE INPUTS");
assert(run({ n_unit_price: -100 }).outputs.out_final_decision_state === 1, "negative price → REVIEW");
assert(run({ n_annual_volume_units: -100 }).outputs.out_final_decision_state === 0, "negative volume → GOOD");
assert(run({ n_material_cost_per_unit: -100 }).outputs.out_final_decision_state >= 0, "negative cost still produces valid state");
allFinite("G neg", { n_unit_price: -100 });
allFinite("G neg vol", { n_annual_volume_units: -100 });

// ── H. Very large values ───────────────────────────────────────────
console.log("\nH. VERY LARGE VALUES");
const big = run({
  n_unit_price: 100000,
  n_material_cost_per_unit: 25000,
  n_labor_cost_per_unit: 15000,
  n_overhead_per_unit: 10000,
  n_logistics_cost_per_unit: 5000,
  n_annual_volume_units: 1000000,
  n_total_portfolio_revenue: 500000000000,
  n_total_portfolio_profit: 100000000000,
});
assert(big.outputs.out_final_decision_state === 0, "large profitable → GOOD");
assert(big.outputs.out_contribution_margin_percent === 45, "large margin = 45%");
allFinite("H", {
  n_unit_price: 100000,
  n_material_cost_per_unit: 25000,
  n_labor_cost_per_unit: 15000,
  n_overhead_per_unit: 10000,
  n_logistics_cost_per_unit: 5000,
  n_annual_volume_units: 1000000,
  n_total_portfolio_revenue: 500000000000,
  n_total_portfolio_profit: 100000000000,
});

// ── I. Component reconciliation ────────────────────────────────────
console.log("\nI. COMPONENT RECONCILIATION");
// out_contribution_amount should equal unit_price - out_variable_cost
const contribRec = 100 - prof.out_variable_cost;
assert(Math.abs(contribRec - prof.out_contribution_amount) <= 0.05, "unit_price - variable_cost = contribution_amount");

// ── J. All outputs present ─────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_sku_revenue", "out_variable_cost", "out_contribution_amount",
  "out_contribution_margin_percent", "out_fully_loaded_profit", "out_fully_loaded_margin",
  "out_unit_cost", "out_revenue_share_percent", "out_profit_share_percent",
  "out_margin_classification", "out_repricing_priority", "out_concentration_risk",
  "out_final_decision_state",
];
const actualKeys = Object.keys(prof);
for (const key of expectedKeys) {
  assert(actualKeys.includes(key), `output key present: ${key}`);
}
assert(actualKeys.length === expectedKeys.length, "no extra outputs");

// ── K. No NaN/Infinity ─────────────────────────────────────────────
console.log("\nK. NO NAN / INFINITY");
allFinite("K base");
allFinite("K extreme", {
  n_unit_price: 1e8,
  n_material_cost_per_unit: 5e7,
  n_annual_volume_units: 1e7,
  n_total_portfolio_revenue: 1e18,
  n_total_portfolio_profit: 1e17,
});
allFinite("K near zero", {
  n_unit_price: 0.01,
  n_annual_volume_units: 1,
  n_total_portfolio_revenue: 0.01,
  n_total_portfolio_profit: 0.01,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
