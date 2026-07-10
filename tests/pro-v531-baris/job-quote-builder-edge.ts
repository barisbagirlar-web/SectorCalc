// SectorCalc — Job Quote Builder Formula Edge Case Tests
// Run: npx tsx tests/pro-v531-baris/job-quote-builder-edge.ts

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";

const BASE: Record<string, number> = {
  n_batch_quantity: 500,
  n_material_cost_per_unit: 25,
  n_cycle_time_seconds_per_unit: 720,
  n_setup_time_minutes_per_batch: 8,
  n_machine_rate_per_hour: 85,
  n_labor_rate_per_hour: 45,
  n_operator_count: 1,
  n_annual_unallocated_overhead: 350000,
  n_annual_volume_units: 100000,
  n_scrap_rework_percent: 5,
  n_target_revenue_margin_percent: 30,
  n_tooling_consumables_cost_per_batch: 150,
  n_external_processing_cost_per_batch: 0,
  n_packaging_cost_per_batch: 50,
  n_freight_cost_per_batch: 0,
  n_other_job_cost_per_batch: 0,
  n_contingency_percent: 3,
  n_current_quote_per_unit: 0,
};

let totalTests = 0;
let passedTests = 0;

function test(label: string, fn: () => boolean) {
  totalTests++;
  const result = fn();
  if (result) { passedTests++; console.log(`  PASS: ${label}`); }
  else { console.log(`  FAIL: ${label}`); process.exitCode = 1; }
}

function allFinite(obj: Record<string, number>): boolean {
  return Object.values(obj).every(v => typeof v === "number" && Number.isFinite(v));
}

// A. MARGIN = 100% — blocked
console.log("A. TARGET MARGIN >= 100%");
test("margin 100 blocked", () => calculate({ ...BASE, n_target_revenue_margin_percent: 100 }).status === "BLOCKED");
test("no NaN", () => allFinite(calculate({ ...BASE, n_target_revenue_margin_percent: 100 }).outputs));

// B. SCRAP = 100% — blocked
console.log("B. SCRAP >= 100%");
const scrap100 = calculate({ ...BASE, n_scrap_rework_percent: 100 });
test("scrap 100 blocked", () => scrap100.status === "BLOCKED");
test("no NaN in outputs", () => allFinite(scrap100.outputs));

// C. ZERO BATCH QUANTITY
console.log("C. ZERO / NEGATIVE BATCH QUANTITY");
test("batch = 0 blocked", () => calculate({ ...BASE, n_batch_quantity: 0 }).status === "BLOCKED");
test("batch = -1 blocked", () => calculate({ ...BASE, n_batch_quantity: -1 }).status === "BLOCKED");
test("no NaN batch=0", () => allFinite(calculate({ ...BASE, n_batch_quantity: 0 }).outputs));

// D. ZERO ANNUAL VOLUME
console.log("D. ZERO ANNUAL VOLUME");
test("volume = 0 blocked", () => calculate({ ...BASE, n_annual_volume_units: 0 }).status === "BLOCKED");
test("no NaN vol=0", () => allFinite(calculate({ ...BASE, n_annual_volume_units: 0 }).outputs));

// E. NEGATIVE INPUTS
console.log("E. NEGATIVE INPUTS");
const negMat = calculate({ ...BASE, n_material_cost_per_unit: -10 });
test("negative mat not OK", () => negMat.status !== "OK");
test("outputs finite", () => allFinite(negMat.outputs));
const negMr = calculate({ ...BASE, n_machine_rate_per_hour: -50 });
test("negative rate not OK", () => negMr.status !== "OK");
test("neg rate outputs finite", () => allFinite(negMr.outputs));

// F. NO CURRENT QUOTE — core works, comparison = 0
console.log("F. NO CURRENT QUOTE");
const noQuote = calculate(BASE);
test("status OK", () => noQuote.status === "OK");
test("all finite", () => allFinite(noQuote.outputs));
test("current_quote = 0", () => noQuote.outputs.out_current_quote_per_batch === 0);
test("be_qty = 0", () => noQuote.outputs.out_break_even_batch_quantity === 0);

// G. CURRENT QUOTE BELOW COST
console.log("G. QUOTE BELOW COST");
const lowQuote = calculate({ ...BASE, n_current_quote_per_unit: 40 });
test("all finite", () => allFinite(lowQuote.outputs));
test("price gap negative", () => (lowQuote.outputs.out_price_gap_per_unit ?? 0) < 0);

// H. CURRENT QUOTE BETWEEN COST AND TARGET
console.log("H. QUOTE BETWEEN COST AND TARGET");
const midQuote = calculate({ ...BASE, n_current_quote_per_unit: 72 });
test("all finite", () => allFinite(midQuote.outputs));
test("achieved margin present", () => (midQuote.outputs.out_achieved_margin_percent ?? 0) > 0);

// I. CURRENT QUOTE ABOVE TARGET
console.log("I. QUOTE ABOVE TARGET");
const highQuote = calculate({ ...BASE, n_current_quote_per_unit: 120 });
test("all finite", () => allFinite(highQuote.outputs));
test("price gap positive", () => (highQuote.outputs.out_price_gap_per_unit ?? 0) > 0);

// J. ZERO CONTINGENCY
console.log("J. ZERO CONTINGENCY");
const zeroCon = calculate({ ...BASE, n_contingency_percent: 0 });
test("status OK", () => zeroCon.status === "OK");
test("contingency = 0", () => zeroCon.outputs.out_contingency_allowance === 0);

// K. ZERO OVERHEAD
console.log("K. ZERO OVERHEAD");
const zeroOh = calculate({ ...BASE, n_annual_unallocated_overhead: 0 });
test("status OK", () => zeroOh.status === "OK");
test("overhead = 0", () => zeroOh.outputs.out_overhead_cost_per_batch === 0);

// L. HIGH SCRAP
console.log("L. HIGH SCRAP (15%)");
const highScrap = calculate({ ...BASE, n_scrap_rework_percent: 15 });
test("scrap allowance > 0", () => (highScrap.outputs.out_scrap_rework_allowance ?? 0) > 0);

// M. ALL FINITE BASE
console.log("M. FORMULA SAFETY");
test("BASE all finite", () => allFinite(calculate(BASE).outputs));

// N. SMALL BATCH HIGH SETUP
console.log("N. SMALL BATCH HIGH SETUP");
const smallBatch = calculate({ ...BASE, n_batch_quantity: 10, n_setup_time_minutes_per_batch: 60 });
test("setup hours = 1", () => Math.abs((smallBatch.outputs.out_setup_hours ?? 0) - 1) < 0.01);
test("all finite", () => allFinite(smallBatch.outputs));

// O. PRIMARY COST DRIVER
console.log("O. PRIMARY COST DRIVER");
const matDominant = calculate({
  ...BASE, n_material_cost_per_unit: 5000, n_machine_rate_per_hour: 10,
  n_labor_rate_per_hour: 10, n_annual_unallocated_overhead: 0,
});
test("material is driver (code=0)", () => (matDominant.outputs.out_primary_cost_driver ?? -1) === 0);

const machDominant = calculate({
  ...BASE, n_material_cost_per_unit: 1, n_machine_rate_per_hour: 1000,
  n_labor_rate_per_hour: 10, n_annual_unallocated_overhead: 0,
  n_cycle_time_seconds_per_unit: 3600, n_batch_quantity: 100,
  n_annual_volume_units: 100000, n_tooling_consumables_cost_per_batch: 0,
  n_packaging_cost_per_batch: 0,
});
test("machine is driver (code=1)", () => (machDominant.outputs.out_primary_cost_driver ?? -1) === 1);

const laborDominant = calculate({
  ...BASE, n_material_cost_per_unit: 1, n_machine_rate_per_hour: 10,
  n_labor_rate_per_hour: 500, n_operator_count: 3,
  n_cycle_time_seconds_per_unit: 3600, n_batch_quantity: 100,
  n_annual_volume_units: 100000, n_annual_unallocated_overhead: 0,
  n_tooling_consumables_cost_per_batch: 0, n_packaging_cost_per_batch: 0,
});
test("labor is driver (code=2)", () => (laborDominant.outputs.out_primary_cost_driver ?? -1) === 2);

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`Passed: ${passedTests}/${totalTests}`);
if (passedTests === totalTests) {
  console.log("RESULT: ALL PASS");
} else {
  console.log(`RESULT: ${totalTests - passedTests} FAILED`);
  process.exit(1);
}
