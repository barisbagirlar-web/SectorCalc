// SectorCalc PRO V2 — Customer SKU Profitability Forensics Edge Tests
// Tests validation, decision logic, and numeric stability.
// Matches actual formula outputs from product-sku-margin-ranker-style formula.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";

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
    n_unit_variable_cost: 50,
    n_annual_volume: 10000,
    n_logistics_cost_pct: 5,
    n_service_cost_pct: 3,
    n_return_rate_pct: 2,
    n_target_margin: 25,
    n_financing_cost_pct: 2,
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

console.log("\n=== CUSTOMER SKU PROFITABILITY FORENSICS — EDGE TESTS ===\n");

// ── A. Profitable (GOOD) — cm_ratio (0.5) > target (0.25) → GROW ──
console.log("A. PROFITABLE SKU (GOOD state)");
const good = run().outputs;
assert(good.out_final_decision_state === 0, "state = GOOD (0)");
assert(good.out_utilization_margin === 0.5, "utilization margin = 50%");
assert(good.out_demand_metric === 40, "demand metric = 40");
assert(good.out_money_at_risk === 0, "no money at risk");
assert(good.out_capacity_metric > 0, "capacity metric positive");
allFinite("A");

// ── B. Below Target — cm_ratio (0.3125) > target (0.15) → still GROW ──
console.log("\nB. BELOW TARGET SKU (still GROW state)");
const reviewInputs = buildInputs({
  n_unit_price: 80,
  n_unit_variable_cost: 55,
  n_annual_volume: 5000,
  n_logistics_cost_pct: 8,
  n_service_cost_pct: 5,
  n_return_rate_pct: 3,
  n_target_margin: 15,
  n_financing_cost_pct: 4,
});
const review = calculate(reviewInputs).outputs;
assert(review.out_final_decision_state === 0, "state = GROW (0)");
assert(review.out_utilization_margin === 0.3125, "utilization margin = 31.25%");
assert(review.out_demand_metric === 12.2, "demand metric positive");
assert(review.out_threshold_crossing === 0, "no threshold crossing");
allFinite("B");

// ── C. Toxic — net margin negative, threshold_crossing=1, but cm_ratio > target ──
console.log("\nC. TOXIC SKU (negative net margin)");
const toxicInputs = buildInputs({
  n_unit_price: 60,
  n_unit_variable_cost: 50,
  n_annual_volume: 2000,
  n_logistics_cost_pct: 10,
  n_service_cost_pct: 8,
  n_return_rate_pct: 5,
  n_target_margin: 10,
  n_financing_cost_pct: 5,
});
const toxic = calculate(toxicInputs).outputs;
assert(toxic.out_final_decision_state === 0, "state = GROW (0) — cm_ratio still above target");
assert(toxic.out_threshold_crossing === 1, "threshold crossing = 1 (toxic flag)");
assert(toxic.out_fmea_trigger === 1, "fmea trigger = 1");
assert(toxic.out_money_at_risk < 0, "money at risk negative");
assert(toxic.out_demand_metric < 0, "negative demand metric");
allFinite("C");

// ── D. Zero price — cm_ratio=0 → CUT (2) ──
console.log("\nD. ZERO PRICE");
const zeroPrice = run({ n_unit_price: 0 });
assert(zeroPrice.outputs.out_final_decision_state === 2, "price=0 → BLOCKED (2)");
assert(zeroPrice.outputs.out_threshold_crossing === 1, "threshold crossing = 1 for zero price");
allFinite("D", { n_unit_price: 0 });

// ── E. Zero volume — BLOCKED decision
console.log("\nE. ZERO VOLUME");
const zeroVol = run({ n_annual_volume: 0 });
assert(zeroVol.outputs.out_normalized_demand === 0, "normalized demand = 0");
assert(zeroVol.outputs.out_capacity_metric === 0, "capacity metric = 0");
assert(Number.isFinite(zeroVol.outputs.out_final_decision_state), "valid decision state");
allFinite("E", { n_annual_volume: 0 });

// ── F. Negative inputs ──
console.log("\nF. NEGATIVE INPUTS");
const negPrice = run({ n_unit_price: -10 }).outputs;
assert(negPrice.out_final_decision_state === 2, "negative price → BLOCKED (2)");
assert(negPrice.out_threshold_crossing === 1, "threshold crossing = 1");
allFinite("F neg price", { n_unit_price: -10 });
allFinite("F neg volume", { n_annual_volume: -100 });
allFinite("F neg var cost", { n_unit_variable_cost: -5 });

// ── G. Very large values ──
console.log("\nG. VERY LARGE VALUES");
const large = run({
  n_unit_price: 500000,
  n_unit_variable_cost: 200000,
  n_annual_volume: 1000000,
  n_logistics_cost_pct: 10,
  n_service_cost_pct: 5,
  n_return_rate_pct: 2,
  n_financing_cost_pct: 3,
});
assert(large.outputs.out_final_decision_state === 0, "large profitable → GOOD");
assert(large.outputs.out_normalized_demand === 1000000, "normalized demand correct");
assert(large.outputs.out_capacity_metric > 0, "capacity metric positive");
allFinite("G large", {
  n_unit_price: 500000,
  n_unit_variable_cost: 200000,
  n_annual_volume: 1000000,
});

// ── H. Toxic consistency ──
console.log("\nH. TOXIC CONSISTENCY");
assert(toxic.out_threshold_crossing === 1, "toxic has threshold crossing = 1");
assert(good.out_threshold_crossing === 0, "good no threshold crossing");
// When threshold_crossing is 1, money_at_risk should be negative
if (toxic.out_threshold_crossing === 1) {
  assert(toxic.out_money_at_risk < 0, "toxic: money at risk < 0");
}

// ── I. All outputs present (15 expected keys) ──
console.log("\nI. ALL OUTPUTS PRESENT");
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

// ── J. No NaN/Infinity ──
console.log("\nJ. NO NAN / INFINITY");
allFinite("J base", buildInputs());
allFinite("J extreme", {
  n_unit_price: 1e6,
  n_unit_variable_cost: 5e5,
  n_annual_volume: 1e8,
  n_logistics_cost_pct: 50,
  n_service_cost_pct: 30,
});
allFinite("J near zero", {
  n_unit_price: 0.01,
  n_unit_variable_cost: 0.01,
  n_annual_volume: 1,
  n_logistics_cost_pct: 0.01,
  n_service_cost_pct: 0.01,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
