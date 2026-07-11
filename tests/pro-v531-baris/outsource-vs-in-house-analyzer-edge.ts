// SectorCalc PRO V2 — Outsource vs In-House Analyzer Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_in_house_material_cost_per_unit: 30,
    n_in_house_labor_cost_per_unit: 25,
    n_in_house_overhead_per_unit: 20,
    n_in_house_setup_cost_per_batch: 500,
    n_outsource_unit_price: 95,
    n_outsource_logistics_per_unit: 8,
    n_quality_defect_allowance_pct: 3,
    n_inventory_lead_time_cost_pct: 2,
    n_capacity_opportunity_cost_pct: 5,
    n_annual_volume: 5000,
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

console.log("\n=== OUTSOURCE VS IN-HOUSE ANALYZER — EDGE TESTS ===\n");

// ── A. Standard comparison (GOOD state — clear make decision) ────────
console.log("A. STANDARD MAKE DECISION (GOOD state)");
const good = run().outputs;
assert(good.out_in_house_variable_cost === 75, "in-house variable cost = $75/unit");
assert(good.out_in_house_total_cost > 0, "in-house total cost > 0");
assert(good.out_outsource_total_landed_cost > 0, "outsource landed cost > 0");
assert(good.out_final_decision_state === 0, "state = GOOD (0)");
allFinite("A");

// ── B. Outsource-favorable scenario (GOOD state — buy decision) ──────
console.log("\nB. OUTSOURCE FAVORABLE (GOOD state — buy)");
const buyInputs = buildInputs({
  n_in_house_material_cost_per_unit: 55,
  n_in_house_labor_cost_per_unit: 40,
  n_in_house_overhead_per_unit: 35,
  n_in_house_setup_cost_per_batch: 2000,
  n_outsource_unit_price: 85,
  n_outsource_logistics_per_unit: 12,
  n_annual_volume: 10000,
});
const buy = calculate(buyInputs).outputs;
assert(buy.out_make_buy_decision === 1, "decision = BUY (1)");
assert(buy.out_cost_difference > 0, "cost difference positive (in-house more expensive)");
assert(buy.out_final_decision_state === 0, "state = GOOD (0)");
allFinite("B", buyInputs);

// ── C. Borderline costs (REVIEW state) ───────────────────────────────
console.log("\nC. BORDERLINE COSTS (REVIEW state)");
const reviewInputs = buildInputs({
  n_in_house_material_cost_per_unit: 45,
  n_in_house_labor_cost_per_unit: 30,
  n_in_house_overhead_per_unit: 25,
  n_in_house_setup_cost_per_batch: 1000,
  n_outsource_unit_price: 88,
  n_outsource_logistics_per_unit: 5,
  n_quality_defect_allowance_pct: 2,
  n_inventory_lead_time_cost_pct: 1,
  n_capacity_opportunity_cost_pct: 3,
  n_annual_volume: 8000,
});
const review = calculate(reviewInputs).outputs;
assert(review.out_final_decision_state === 1, "state = REVIEW (1)");
allFinite("C", reviewInputs);

// ── D. Zero inputs boundary ─────────────────────────────────────────
console.log("\nD. ZERO INPUTS");
const zero = run({
  n_in_house_material_cost_per_unit: 0,
  n_in_house_labor_cost_per_unit: 0,
  n_in_house_overhead_per_unit: 0,
  n_in_house_setup_cost_per_batch: 0,
  n_outsource_unit_price: 0,
  n_outsource_logistics_per_unit: 0,
  n_quality_defect_allowance_pct: 0,
  n_inventory_lead_time_cost_pct: 0,
  n_capacity_opportunity_cost_pct: 0,
  n_annual_volume: 0,
}).outputs;
assert(zero.out_in_house_total_cost === 0, "zero inputs → in-house total = 0");
assert(zero.out_outsource_total_landed_cost === 0, "zero inputs → outsource landed = 0");
assert(zero.out_cost_difference === 0, "zero inputs → cost diff = 0");
assert(Number.isFinite(zero.out_break_even_volume), "zero inputs → break-even finite");
allFinite("D", {
  n_in_house_material_cost_per_unit: 0,
  n_in_house_labor_cost_per_unit: 0,
  n_in_house_overhead_per_unit: 0,
  n_in_house_setup_cost_per_batch: 0,
  n_outsource_unit_price: 0,
  n_outsource_logistics_per_unit: 0,
  n_quality_defect_allowance_pct: 0,
  n_inventory_lead_time_cost_pct: 0,
  n_capacity_opportunity_cost_pct: 0,
  n_annual_volume: 0,
});

// ── E. Negative inputs boundary ──────────────────────────────────────
console.log("\nE. NEGATIVE INPUTS");
const neg = run({
  n_in_house_material_cost_per_unit: -50,
  n_in_house_labor_cost_per_unit: -30,
  n_in_house_overhead_per_unit: -20,
  n_in_house_setup_cost_per_batch: -100,
  n_annual_volume: -100,
}).outputs;
assert(neg.out_in_house_variable_cost === 0, "negative → variable cost = 0");
assert(neg.out_in_house_total_cost === 0, "negative → total cost = 0");
assert(neg.out_final_decision_state >= 0, "negative → valid state");
allFinite("E", { n_in_house_material_cost_per_unit: -50, n_in_house_labor_cost_per_unit: -30, n_annual_volume: -100 });

// ── F. Extreme / high values ─────────────────────────────────────────
console.log("\nF. EXTREME VALUES");
const extreme = run({
  n_in_house_material_cost_per_unit: 5000,
  n_in_house_labor_cost_per_unit: 3000,
  n_in_house_overhead_per_unit: 2000,
  n_in_house_setup_cost_per_batch: 100000,
  n_outsource_unit_price: 8000,
  n_outsource_logistics_per_unit: 500,
  n_quality_defect_allowance_pct: 10,
  n_inventory_lead_time_cost_pct: 10,
  n_capacity_opportunity_cost_pct: 10,
  n_annual_volume: 1000000,
}).outputs;
assert(extreme.out_in_house_total_cost > 0, "extreme total cost positive");
assert(Number.isFinite(extreme.out_in_house_total_cost), "extreme total cost finite");
allFinite("F", extreme);

// ── G. Component reconciliation ──────────────────────────────────────
console.log("\nG. COMPONENT RECONCILIATION");
const recon = run().outputs;
// cost_difference = in_house_total_cost - outsource_total_landed_cost
assert(Math.abs(recon.out_cost_difference - (recon.out_in_house_total_cost - recon.out_outsource_total_landed_cost)) <= 0.05, "cost difference reconciled");

// ── H. Make/Buy decision logic ───────────────────────────────────────
console.log("\nH. MAKE/BUY DECISION LOGIC");
// When in-house is cheaper → MAKE (0)
const makeScenario = run({
  n_in_house_material_cost_per_unit: 20,
  n_in_house_labor_cost_per_unit: 15,
  n_in_house_overhead_per_unit: 10,
  n_outsource_unit_price: 100,
  n_annual_volume: 1000,
}).outputs;
assert(makeScenario.out_make_buy_decision === 0, "cheaper in-house → MAKE (0)");

// When outsource is more expensive → MAKE (0)
const buyScenario = run({
  n_in_house_material_cost_per_unit: 100,
  n_in_house_labor_cost_per_unit: 80,
  n_in_house_overhead_per_unit: 60,
  n_outsource_unit_price: 500,
  n_outsource_logistics_per_unit: 5,
  n_quality_defect_allowance_pct: 0,
  n_inventory_lead_time_cost_pct: 0,
  n_capacity_opportunity_cost_pct: 0,
  n_annual_volume: 1000,
}).outputs;
assert(buyScenario.out_make_buy_decision === 0, "expensive outsource → MAKE (0)");

// ── I. Break-even volume calculation ─────────────────────────────────
console.log("\nI. BREAK-EVEN VOLUME");
const be = run({ n_in_house_setup_cost_per_batch: 5000, n_annual_volume: 5000 }).outputs;
assert(be.out_break_even_volume >= 0, "break-even volume non-negative");
assert(Number.isFinite(be.out_break_even_volume), "break-even volume finite");

// ── J. All outputs present ───────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_in_house_variable_cost", "out_in_house_allocated_fixed",
  "out_in_house_total_cost", "out_supplier_unit_price",
  "out_logistics_import_cost", "out_quality_defect_allowance",
  "out_inventory_lead_time_cost", "out_capacity_opportunity_cost",
  "out_outsource_total_landed_cost", "out_cost_difference",
  "out_break_even_volume", "out_make_buy_decision",
  "out_primary_decision_driver", "out_final_decision_state",
];
const actualKeys = Object.keys(good);
for (const key of expectedKeys) {
  assert(actualKeys.includes(key), `output key present: ${key}`);
}
assert(actualKeys.length === expectedKeys.length, "no extra outputs");

// ── K. No NaN/Infinity ──────────────────────────────────────────────
console.log("\nK. NO NAN / INFINITY");
allFinite("K base");
allFinite("K extreme", {
  n_in_house_material_cost_per_unit: 1e6,
  n_in_house_labor_cost_per_unit: 1e6,
  n_in_house_overhead_per_unit: 1e6,
  n_in_house_setup_cost_per_batch: 1e9,
  n_outsource_unit_price: 1e6,
  n_outsource_logistics_per_unit: 1e6,
  n_quality_defect_allowance_pct: 100,
  n_inventory_lead_time_cost_pct: 100,
  n_capacity_opportunity_cost_pct: 100,
  n_annual_volume: 1e9,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
