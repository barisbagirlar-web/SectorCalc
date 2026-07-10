// SectorCalc PRO V2 — Plant-Wide Shop Rate Cost Structure Audit Edge Tests
// Tests validation, decision logic, and numeric stability.
// Matches actual formula outputs (15-key standard schema).

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_total_annual_cost: 2000000,
    n_total_productive_hours: 40000,
    n_machine_group_cost: 500000,
    n_machine_group_hours: 15000,
    n_overhead_pool: 600000,
    n_overhead_allocation_base: 40000,
    n_current_shop_rate: 85,
    n_target_margin_pct: 25,
    n_utilization_pct: 80,
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

console.log("\n=== PLANT-WIDE SHOP RATE — EDGE TESTS ===\n");

// ── A. Rate adequate (current >= pricingFloor) → GOOD ──────────────
console.log("A. GOOD STATE (Rate Adequate)");
const good = run().outputs;
// plantWideRate=50, pricingFloor=62.5, currentRate=85 >= 62.5 → decision=0
assert(good.out_final_decision_state === 0, "state = GOOD (0)");
assert(good.out_demand_metric === 50, "demand metric (plant-wide rate) = $50/hr");
assert(good.out_scenario_delta === -22.5, "scenario delta = -22.5 (positive gap)");
assert(good.out_money_at_risk > 0, "money at risk > 0");
assert(good.out_threshold_crossing === 0, "threshold crossing = 0");
allFinite("A");

// ── B. REPRICE — current rate < pricingFloor ─────────────────────
console.log("\nB. REPRICE STATE (Rate Below Pricing Floor)");
const reviewInputs = buildInputs({
  n_total_annual_cost: 1500000,
  n_total_productive_hours: 30000,
  n_current_shop_rate: 55,
  n_target_margin_pct: 20,
  n_utilization_pct: 65,
});
const review = calculate(reviewInputs).outputs;
// plantWideRate=50, pricingFloor=60, currentRate=55 < 60 → decision=1
assert(review.out_final_decision_state === 1, "state = REPRICE (1)");
assert(review.out_demand_metric === 50, "demand metric = $50/hr");
assert(review.out_scenario_delta === 5, "scenario delta = 5 (gap)");
assert(review.out_threshold_crossing === 1, "threshold crossing = 1");
allFinite("B");

// ── C. REPRICE — another pricing floor case ──────────────────────
console.log("\nC. REPRICE STATE (Low Margin Rate)");
const floorInputs = buildInputs({
  n_current_shop_rate: 50,
  n_target_margin_pct: 10,
});
const floor = calculate(floorInputs).outputs;
// plantWideRate=50, pricingFloor=55, currentRate=50 < 55 → decision=1
assert(floor.out_final_decision_state === 1, "state = REPRICE (1)");
assert(floor.out_scenario_delta > 0, "positive scenario delta");
allFinite("C");

// ── D. REPRICE — rate below cost ────────────────────────────────
console.log("\nD. REPRICE STATE (Rate Below Cost)");
const blockedInputs = buildInputs({
  n_total_annual_cost: 1800000,
  n_total_productive_hours: 25000,
  n_current_shop_rate: 50,
  n_target_margin_pct: 15,
  n_utilization_pct: 75,
});
const blocked = calculate(blockedInputs).outputs;
// plantWideRate=72, pricingFloor=82.8, currentRate=50 < 82.8 → decision=1
assert(blocked.out_final_decision_state === 1, "state = REPRICE (1)");
assert(blocked.out_demand_metric === 72, "demand metric (plant-wide rate) = $72/hr");
allFinite("D");

// ── E. ZERO ANNUAL COST ──────────────────────────────────────────
console.log("\nE. ZERO ANNUAL COST");
assert(run({ n_total_annual_cost: 0 }).outputs.out_final_decision_state === 0, "zero cost → GOOD (rate >= floor)");
allFinite("E", { n_total_annual_cost: 0 });

// ── F. ZERO PRODUCTIVE HOURS ────────────────────────────────────
console.log("\nF. ZERO PRODUCTIVE HOURS");
assert(run({ n_total_productive_hours: 0 }).outputs.out_final_decision_state === 1, "zero hours → REPRICE");
allFinite("F", { n_total_productive_hours: 0 });

// ── G. VERY HIGH UTILIZATION ────────────────────────────────────
console.log("\nG. HIGH UTILIZATION (100%)");
const highUtil = run({ n_utilization_pct: 100 });
assert(highUtil.outputs.out_money_at_risk === 0, "100% util → zero money at risk");
assert(highUtil.outputs.out_final_decision_state === 0, "100% util → GOOD");
allFinite("G", { n_utilization_pct: 100 });

// ── H. NEGATIVE INPUTS ──────────────────────────────────────────
console.log("\nH. NEGATIVE INPUTS");
assert(run({ n_total_annual_cost: -100 }).outputs.out_final_decision_state === 0, "negative cost → GOOD");
assert(run({ n_total_productive_hours: -100 }).outputs.out_final_decision_state === 1, "negative hours → REPRICE");
assert(run({ n_current_shop_rate: -100 }).outputs.out_final_decision_state === 2, "negative rate → REVIEW");
allFinite("H neg cost", { n_total_annual_cost: -100 });
allFinite("H neg hours", { n_total_productive_hours: -100 });

// ── I. ALL OUTPUTS PRESENT (15 keys) ──────────────────────────
console.log("\nI. ALL EXPECTED OUTPUTS PRESENT");
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

// ── J. NO NaN / INFINITY ───────────────────────────────────────
console.log("\nJ. NO NAN / INFINITY");
allFinite("J base", buildInputs());
allFinite("J extreme", {
  n_total_annual_cost: 1e8,
  n_total_productive_hours: 1e6,
  n_current_shop_rate: 1e4,
  n_machine_group_cost: 5e7,
  n_machine_group_hours: 5e5,
  n_overhead_pool: 5e7,
  n_overhead_allocation_base: 5e5,
  n_source_confidence_ratio: 0.9,
});
allFinite("J near zero", {
  n_total_annual_cost: 0.01,
  n_total_productive_hours: 1,
  n_source_confidence_ratio: 0.01,
});

// ── K. LARGE VALUES ──────────────────────────────────────────
console.log("\nK. LARGE VALUES");
const big = run({ n_total_annual_cost: 50000000, n_total_productive_hours: 200000, n_current_shop_rate: 500, n_utilization_pct: 90 });
assert(big.outputs.out_final_decision_state === 0, "large profitable → GOOD");
assert(big.outputs.out_demand_metric === 250, "demand metric = $250/hr");
allFinite("K", { n_total_annual_cost: 50000000, n_total_productive_hours: 200000, n_source_confidence_ratio: 0.9 });

// ── L. RATE THRESHOLD EDGE ────────────────────────────────────
console.log("\nL. THRESHOLD EDGE");
// currentRate exactly at pricingFloor (62.5) → decision=0
const threshold = run({ n_current_shop_rate: 62.5, n_target_margin_pct: 25 });
assert(threshold.outputs.out_final_decision_state === 0, "exactly at pricing floor → GOOD");
assert(threshold.outputs.out_scenario_delta === 0, "scenario delta = 0 at threshold");
allFinite("L", { n_current_shop_rate: 62.5, n_target_margin_pct: 25, n_source_confidence_ratio: 0.9 });

// ── M. UNDER-RECOVERY CONSISTENCY ──────────────────────────────
console.log("\nM. UNDER-RECOVERY CONSISTENCY");
assert(good.out_money_at_risk >= 0, "money-at-risk non-negative");
assert(highUtil.outputs.out_money_at_risk === 0, "100% util → zero money at risk");

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
