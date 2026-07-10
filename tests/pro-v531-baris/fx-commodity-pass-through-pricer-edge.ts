// SectorCalc PRO V2 — FX Commodity Pass-Through Pricer Edge Tests
// Tests validation, decision logic, and numeric stability.
// Matches actual formula outputs (15-key standard schema).

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_base_price: 100,
    n_fx_rate_spot: 1.08,
    n_fx_rate_budget: 1.05,
    n_commodity_index_current: 170,
    n_commodity_index_budget: 165,
    n_material_cost_pct: 40,
    n_fx_hedge_pct: 80,
    n_commodity_hedge_pct: 70,
    n_annual_volume: 10000,
    n_source_confidence_ratio: 0.9,
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

// Helper to extract output
function get(key: string, overrides: Record<string, number> = {}) {
  return run(overrides).outputs[key] ?? 0;
}

console.log("\n=== FX COMMODITY PASS-THROUGH PRICER — EDGE TESTS ===\n");

// ── A. Within deadband (total_pass_through < 5) — GOOD ──────────────
console.log("A. GOOD STATE (within deadband)");
const good = run().outputs;
assert(good.out_final_decision_state === 0, "state = GOOD (0)");
assert(good.out_threshold_crossing === 0, "threshold crossing = 0");
assert(good.out_evidence_completeness > 0, "evidence completeness > 0");
assert(good.out_utilization_margin > 1, "utilization margin > 1 (price increased slightly)");
allFinite("A");

// ── B. Mild exposure (total_pass_through < 5) — still GOOD ─────
console.log("\nB. MILD EXPOSURE (within deadband)");
const reviewInputs = {
  n_base_price: 100,
  n_fx_rate_spot: 1.10,
  n_fx_rate_budget: 1.05,
  n_commodity_index_current: 180,
  n_commodity_index_budget: 165,
  n_material_cost_pct: 40,
  n_fx_hedge_pct: 60,
  n_commodity_hedge_pct: 50,
  n_annual_volume: 5000,
  n_target_margin_percent: 20,
  n_source_confidence_ratio: 0.9,
};
const review = calculate(reviewInputs).outputs;
assert(review.out_final_decision_state === 0, "state = GOOD (0) — mild exposure");
assert(review.out_threshold_crossing === 0, "threshold crossing = 0");
assert(review.out_capacity_metric > 0, "capacity metric > 0");
assert(review.out_money_at_risk > 0, "money at risk > 0");
allFinite("B");

// ── C. Severe exposure (>15% total) — fmea_trigger bits set ────
console.log("\nC. SEVERE EXPOSURE (high fmea trigger)");
const blockedInputs = {
  n_base_price: 100,
  n_fx_rate_spot: 1.25,
  n_fx_rate_budget: 1.05,
  n_commodity_index_current: 220,
  n_commodity_index_budget: 150,
  n_material_cost_pct: 50,
  n_fx_hedge_pct: 30,
  n_commodity_hedge_pct: 20,
  n_annual_volume: 2000,
  n_target_margin_percent: 15,
  n_source_confidence_ratio: 0.9,
};
const blocked = calculate(blockedInputs).outputs;
assert(blocked.out_final_decision_state === 1, "state = REPRICE (1) — severe but still repricing");
assert(blocked.out_threshold_crossing === 1, "threshold crossing = 1");
assert(blocked.out_fmea_trigger >= 3, "fmea trigger high (bits set for >15% and low hedge)");
assert(blocked.out_utilization_margin > 1, "utilization margin > 1 (price increased)");
allFinite("C");

// ── D. ZERO BASE PRICE ─────────────────────────────────────────
console.log("\nD. ZERO BASE PRICE");
const zeroBase = run({ n_base_price: 0 });
assert(zeroBase.outputs.out_normalized_demand === 0, "normalized demand = 0");
assert(zeroBase.outputs.out_capacity_metric === 0, "capacity metric = 0");
allFinite("D", { n_base_price: 0 });

// ── E. ZERO BUDGET RATES (division by zero protection) ─────────
console.log("\nE. ZERO BUDGET RATES");
const zeroBudget = run({ n_fx_rate_budget: 0, n_commodity_index_budget: 0 });
assert(zeroBudget.outputs.out_reference_deviation === 1, "reference deviation = 1 (budget=0 fallback)");
assert(zeroBudget.outputs.out_final_decision_state === 0, "zero budget rates → GOOD");
allFinite("E", { n_fx_rate_budget: 0, n_commodity_index_budget: 0 });

// ── F. 100% HEDGE COVERAGE ─────────────────────────────────────
console.log("\nF. 100% HEDGE COVERAGE");
const fullHedge = run({ n_fx_hedge_pct: 100, n_commodity_hedge_pct: 100 });
assert(fullHedge.outputs.out_capacity_metric === 0, "100% hedge → zero capacity metric");
assert(fullHedge.outputs.out_money_at_risk === 0, "100% hedge → zero money at risk");
assert(fullHedge.outputs.out_final_decision_state === 0, "fully hedged → GOOD");
allFinite("F", { n_fx_hedge_pct: 100, n_commodity_hedge_pct: 100 });

// ── G. ZERO HEDGE COVERAGE ─────────────────────────────────────
console.log("\nG. ZERO HEDGE COVERAGE");
const noHedge = run({
  n_fx_hedge_pct: 0,
  n_commodity_hedge_pct: 0,
  n_fx_rate_spot: 1.15,
  n_fx_rate_budget: 1.05,
  n_commodity_index_current: 190,
  n_commodity_index_budget: 160,
  n_material_cost_pct: 50,
});
assert(noHedge.outputs.out_fmea_trigger >= 5, "zero hedge → high fmea trigger");
assert(noHedge.outputs.out_money_at_risk > 0, "zero hedge → money at risk > 0");
allFinite("G", { n_fx_hedge_pct: 0, n_commodity_hedge_pct: 0, n_fx_rate_spot: 1.15, n_fx_rate_budget: 1.05, n_commodity_index_current: 190, n_commodity_index_budget: 160, n_material_cost_pct: 50 });

// ── H. NEGATIVE INPUTS ─────────────────────────────────────────
console.log("\nH. NEGATIVE INPUTS");
const negPrice = run({ n_base_price: -100 });
assert(negPrice.outputs.out_normalized_demand === -10000, "negative base price → negative demand");
assert(Number.isFinite(negPrice.outputs.out_final_decision_state), "valid decision state");
allFinite("H neg price", { n_base_price: -100 });
allFinite("H neg vol", { n_annual_volume: -100 });

// ── I. VERY LARGE MOVEMENTS ──────────────────────────────────
console.log("\nI. VERY LARGE MOVEMENTS");
const extreme = run({
  n_fx_rate_spot: 2.50,
  n_fx_rate_budget: 1.00,
  n_commodity_index_current: 500,
  n_commodity_index_budget: 100,
  n_fx_hedge_pct: 0,
  n_commodity_hedge_pct: 0,
  n_material_cost_pct: 50,
});
assert(extreme.outputs.out_final_decision_state === 1, "extreme move → REPRICE (1)");
assert(extreme.outputs.out_utilization_margin > 1, "utilization margin > 1");
allFinite("I", { n_fx_rate_spot: 2.50, n_fx_rate_budget: 1.00, n_commodity_index_current: 500, n_commodity_index_budget: 100, n_fx_hedge_pct: 0, n_commodity_hedge_pct: 0, n_material_cost_pct: 50 });

// ── J. HIGH HEDGE LOWERS IMPACT ─────────────────────────────
console.log("\nJ. HIGH HEDGE LOWERS IMPACT");
const lowHedgeVal = get("out_capacity_metric", { n_fx_hedge_pct: 20 });
const highHedgeVal = get("out_capacity_metric", { n_fx_hedge_pct: 80 });
assert(highHedgeVal < lowHedgeVal, "higher FX hedge reduces capacity metric");

// ── K. ALL OUTPUTS PRESENT ──────────────────────────────────
console.log("\nK. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_evidence_completeness",
  "out_normalized_demand",
  "out_reference_deviation",
  "out_derating_factor",
  "out_demand_metric",
  "out_capacity_metric",
  "out_utilization_margin",
  "out_expanded_uncertainty",
  "out_threshold_crossing",
  "out_sensitivity_driver",
  "out_fmea_trigger",
  "out_money_at_risk",
  "out_scenario_delta",
  "out_audit_hash_payload",
  "out_final_decision_state",
];
const actualKeys = Object.keys(good);
for (const key of expectedKeys) {
  assert(actualKeys.includes(key), `output key present: ${key}`);
}
assert(actualKeys.length === expectedKeys.length, "no extra outputs");

// ── L. ALL FINITE ─────────────────────────────────────────────
console.log("\nL. NO NAN / INFINITY");
allFinite("L base");
allFinite("L extreme", {
  n_base_price: 1e6,
  n_annual_volume: 1e6,
  n_fx_rate_spot: 100,
  n_fx_rate_budget: 0.001,
  n_commodity_index_current: 10000,
  n_commodity_index_budget: 0.001,
  n_source_confidence_ratio: 0.9,
});
allFinite("L near zero", {
  n_base_price: 0.01,
  n_annual_volume: 1,
  n_fx_rate_budget: 0.0001,
  n_commodity_index_budget: 0.0001,
  n_source_confidence_ratio: 0.9,
});

// ── M. 100% MATERIAL COST ──────────────────────────────────
console.log("\nM. 100% MATERIAL COST (commodity-only exposure)");
const fullMaterial = run({ n_material_cost_pct: 100, n_fx_hedge_pct: 100 });
assert(fullMaterial.outputs.out_scenario_delta > 0, "commodity impact via material cost");
assert(fullMaterial.status === "OK" || fullMaterial.status === "REVIEW" || fullMaterial.status === "BLOCKED", "valid status");
allFinite("M", { n_material_cost_pct: 100, n_fx_hedge_pct: 100, n_source_confidence_ratio: 0.9 });

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
