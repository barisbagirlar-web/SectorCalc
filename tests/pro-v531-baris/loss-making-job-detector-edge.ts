// SectorCalc PRO V2 — Loss Making Job Detector Edge Case Tests
// Tests validation, decision logic, and numeric stability.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_batch_quantity: 500,
    n_selling_price_per_unit: 95,
    n_material_cost_per_unit: 25,
    n_cycle_time_seconds_per_unit: 720,
    n_setup_time_minutes_per_batch: 8,
    n_machine_rate_per_hour: 85,
    n_operator_count: 1,
    n_labor_rate_per_hour: 45,
    n_external_processing_per_batch: 0,
    n_packaging_freight_per_batch: 50,
    n_other_job_cost_per_batch: 0,
    n_allocated_overhead: 350,
    n_scrap_rework_percent: 5,
    n_target_revenue_margin_percent: 30,
    n_annual_volume_units: 100000,
    ...overrides,
  };
}

function run(overrides: Record<string, number> = {}) {
  return calculate(buildInputs(overrides));
}

function get(key: string, overrides: Record<string, number> = {}) {
  return run(overrides).outputs[key] ?? 0;
}

function check(label: string, key: string, expected: number, tolerance: number, overrides: Record<string, number> = {}) {
  const actual = get(key, overrides);
  const pass = Math.abs(actual - expected) <= tolerance;
  if (!pass) {
    console.error(`  FAIL: ${label} — expected ${expected}, got ${actual}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label} (${actual})`);
}

function allFinite(label: string, overrides: Record<string, number> = {}) {
  const res = run(overrides);
  const ok = Object.values(res.outputs).every((v) => typeof v === "number" && Number.isFinite(v));
  assert(ok, `${label}: all finite`);
}

console.log("\n=== LOSS-MAKING JOB DETECTOR EDGE TESTS ===\n");

// ── A. Golden fixture — Profitable Repeat Job ──────────────────
console.log("\nA. PROFITABLE JOB (target 30%, margin 42.75%)");
const profInputs = buildInputs();
const profResult = run();
const prof = profResult.outputs;
assert(prof.out_final_decision_state === 2, "state = GOOD (2)");
assert(prof.out_operating_profit > 0, "operating profit positive");
assert(prof.out_revenue_margin_percent > 30, "margin exceeds target 30%");
assert(prof.out_annualized_money_at_risk === 0, "no annual risk");
allFinite("A", profInputs);

// ── B. Low-Margin Job ──────────────────────────────────────────
console.log("\nB. LOW-MARGIN JOB (target 25%, margin ~10.5%)");
const lowMarginInputs = {
  n_batch_quantity: 300,
  n_selling_price_per_unit: 50,
  n_material_cost_per_unit: 22,
  n_cycle_time_seconds_per_unit: 600,
  n_setup_time_minutes_per_batch: 10,
  n_machine_rate_per_hour: 75,
  n_operator_count: 1,
  n_labor_rate_per_hour: 40,
  n_external_processing_per_batch: 0,
  n_packaging_freight_per_batch: 30,
  n_other_job_cost_per_batch: 0,
  n_allocated_overhead: 400,
  n_scrap_rework_percent: 5,
  n_target_revenue_margin_percent: 25,
  n_annual_volume_units: 50000,
};
const lowResult = run(lowMarginInputs);
const low = lowResult.outputs;
assert(low.out_final_decision_state === 1, "state = REVIEW (1)");
assert(low.out_operating_profit > 0, "operating profit positive (covers costs)");
assert(low.out_revenue_margin_percent < 25, "margin below target 25%");
assert(low.out_revenue_margin_percent > 0, "margin positive");
allFinite("B", lowMarginInputs);

// ── C. Loss-Making Job ─────────────────────────────────────────
console.log("\nC. LOSS-MAKING JOB");
const lossInputs = {
  n_batch_quantity: 200,
  n_selling_price_per_unit: 25,
  n_material_cost_per_unit: 12,
  n_cycle_time_seconds_per_unit: 1200,
  n_setup_time_minutes_per_batch: 15,
  n_machine_rate_per_hour: 80,
  n_operator_count: 1,
  n_labor_rate_per_hour: 42,
  n_external_processing_per_batch: 100,
  n_packaging_freight_per_batch: 40,
  n_other_job_cost_per_batch: 50,
  n_allocated_overhead: 200,
  n_scrap_rework_percent: 8,
  n_target_revenue_margin_percent: 20,
  n_annual_volume_units: 12000,
};
const lossResult = run(lossInputs);
const loss = lossResult.outputs;
assert(loss.out_final_decision_state === 0, "state = BLOCKED (0)");
assert(loss.out_operating_profit < 0, "operating profit negative");
assert(loss.out_annualized_money_at_risk > 0, "annual risk > 0");
allFinite("C", lossInputs);

// ── D. ZERO QUANTITY ───────────────────────────────────────────
console.log("\nD. ZERO QUANTITY");
assert(run({ n_batch_quantity: 0 }).outputs.out_final_decision_state === 0, "quantity=0 → BLOCKED");
allFinite("D quantity=0", { n_batch_quantity: 0 });

// ── E. ZERO REVENUE ────────────────────────────────────────────
console.log("\nE. ZERO REVENUE");
assert(run({ n_selling_price_per_unit: 0 }).outputs.out_final_decision_state === 0, "revenue=0 → BLOCKED");
allFinite("E revenue=0", { n_selling_price_per_unit: 0 });

// ── F. MARGIN >= 100% ─────────────────────────────────────────
console.log("\nF. MARGIN >= 100%");
assert(run({ n_target_revenue_margin_percent: 100 }).outputs.out_final_decision_state === 0, "margin=100 → BLOCKED");
allFinite("F margin=100", { n_target_revenue_margin_percent: 100 });

// ── G. MARGIN ABOVE TARGET ──────────────────────────────────────
console.log("\nG. PRICE MEETING TARGET (margin > target)");
assert(prof.out_final_decision_state === 2, "profitable job state = GOOD");

// ── H. HIGH SCRAP ──────────────────────────────────────────────
console.log("\nH. HIGH SCRAP (30%)");
const highScrap = run({ n_scrap_rework_percent: 30 });
assert(highScrap.outputs.out_scrap_rework_cost > 0, "scrap cost > 0");
assert(highScrap.outputs.out_fully_loaded_job_cost > prof.out_fully_loaded_job_cost, "higher scrap increases cost");
allFinite("H", { n_scrap_rework_percent: 30 });

// ── I. ZERO OVERHEAD ───────────────────────────────────────────
console.log("\nI. ZERO OVERHEAD");
const zeroOh = run({ n_allocated_overhead: 0 });
assert(zeroOh.outputs.out_allocated_overhead === 0, "overhead = 0");
assert(zeroOh.outputs.out_operating_profit > prof.out_operating_profit, "profit higher without overhead");
allFinite("I", { n_allocated_overhead: 0 });

// ── J. OPTIONAL FIELDS OMITTED ─────────────────────────────────
console.log("\nJ. OPTIONAL FIELDS (external=0, packaging=0, other=0)");
const opt = run();
assert(opt.outputs.out_external_processing_cost === 0, "external = 0");
assert(opt.outputs.out_other_job_cost === 0, "other = 0");
allFinite("J", {});

// ── K. NO NaN / INFINITY ───────────────────────────────────────
console.log("\nK. NO NAN / INFINITY");
allFinite("K base", buildInputs());
allFinite("K extreme high", {
  n_batch_quantity: 1000000,
  n_selling_price_per_unit: 9999,
  n_machine_rate_per_hour: 5000,
  n_scrap_rework_percent: 80,
});
allFinite("K extreme low", {
  n_batch_quantity: 1,
  n_selling_price_per_unit: 0.01,
  n_cycle_time_seconds_per_unit: 1,
});
allFinite("K negative costs", {
  n_material_cost_per_unit: -1,
  n_machine_rate_per_hour: -1,
  n_labor_rate_per_hour: -1,
});

// ── L. EXACT COMPONENT RECONCILIATION ──────────────────────────
console.log("\nL. COMPONENT RECONCILIATION");
const compSum =
  prof.out_direct_material_cost +
  prof.out_machine_cost +
  prof.out_labor_cost +
  prof.out_external_processing_cost +
  prof.out_packaging_freight_cost +
  prof.out_other_job_cost +
  prof.out_allocated_overhead +
  prof.out_scrap_rework_cost;
const diff = Math.abs(compSum - prof.out_fully_loaded_job_cost);
assert(diff <= 0.05, `component sum matches fully loaded (diff=${diff.toFixed(4)})`);

// ── M. NEGATIVE INPUTS → BLOCKED ──────────────────────────────
console.log("\nM. NEGATIVE INPUTS");
assert(run({ n_batch_quantity: -5 }).outputs.out_final_decision_state === 0, "neg quantity → BLOCKED");
assert(run({ n_selling_price_per_unit: -10 }).outputs.out_final_decision_state === 0, "neg price → BLOCKED");
allFinite("M neg inputs", { n_batch_quantity: -5, n_selling_price_per_unit: -10 });

// ── N. PRICE BELOW VARIABLE COST ───────────────────────────────
console.log("\nN. PRICE BELOW VARIABLE COST");
const belowVar = buildInputs({ n_selling_price_per_unit: 30 });
// Contribution = revenue - variable costs would be negative
const belowResult = run({ n_selling_price_per_unit: 30 });
assert(belowResult.outputs.out_final_decision_state === 0, "price below variable cost → BLOCKED");
allFinite("N", { n_selling_price_per_unit: 30 });

// ── O. PRIMARY LOSS DRIVER ──────────────────────────────────────
console.log("\nO. PRIMARY LOSS DRIVER");
// With high material cost, material should be driver (0)
const matDriver = run({ n_material_cost_per_unit: 200, n_machine_rate_per_hour: 30, n_labor_rate_per_hour: 20, n_selling_price_per_unit: 500 });
assert(matDriver.outputs.out_primary_loss_driver === 0, "material is primary driver");

// With high machine rate, machine should be driver (1)
const machDriver = run({ n_material_cost_per_unit: 5, n_machine_rate_per_hour: 500, n_labor_rate_per_hour: 20, n_selling_price_per_unit: 500 });
assert(machDriver.outputs.out_primary_loss_driver === 1, "machine is primary driver (index=1)");

// With high labor rate, labor should be driver (2)
const labDriver = run({ n_material_cost_per_unit: 5, n_machine_rate_per_hour: 30, n_labor_rate_per_hour: 300, n_selling_price_per_unit: 500, n_operator_count: 2 });
assert(labDriver.outputs.out_primary_loss_driver === 2, "labor is primary driver (index=2)");

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
