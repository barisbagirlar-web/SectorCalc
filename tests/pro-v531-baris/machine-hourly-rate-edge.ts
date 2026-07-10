// SectorCalc — Machine Hourly Rate Proof Report Formula Edge Case Tests
// Direct-execution script. Run: npx tsx tests/pro-v531-baris/machine-hourly-rate-edge.ts

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";

const CORE_INPUTS: Record<string, number> = {
  n_planned_operating_hours: 2000,
  n_utilization_percent: 80,
  n_planned_downtime_percent: 5,
  n_purchase_price: 85000,
  n_residual_value: 5000,
  n_economic_life_years: 8,
  n_maintenance_cost: 6000,
  n_insurance_tax_cost: 2000,
  n_facility_allocation: 18000,
  n_machine_power_kw: 15,
  n_electricity_price: 0.12,
  n_consumables_cost_per_hour: 2.5,
  n_tooling_cost_per_hour: 3,
  n_operator_count: 1,
  n_labor_rate_per_hour: 45,
  n_current_shop_rate: 85,
  n_target_margin_percent: 25,
  n_financing_cost_percent: 0,
  n_other_annual_fixed_cost: 0,
};

const COMPLETE_SCENARIO: Record<string, number> = {
  n_annual_production_volume: 100000,
  n_cycle_time_seconds: 720,
  n_setup_time_minutes: 8,
  n_average_batch_quantity: 500,
};

function allFinite(obj: Record<string, number>): boolean {
  return Object.values(obj).every(v => typeof v === "number" && Number.isFinite(v));
}

let totalTests = 0;
let passedTests = 0;

function test(label: string, fn: () => boolean) {
  totalTests++;
  const result = fn();
  if (result) {
    passedTests++;
    console.log(`  PASS: ${label}`);
  } else {
    console.log(`  FAIL: ${label}`);
    process.exitCode = 1;
  }
}

// ── A. ZERO PRODUCTIVE HOURS ──────────────────────────────────────────
console.log("A. ZERO PRODUCTIVE HOURS");
test("status = BLOCKED", () => {
  const r = calculate({ ...CORE_INPUTS, n_utilization_percent: 0 });
  return r.status === "BLOCKED";
});
test("no NaN in outputs", () => {
  const r = calculate({ ...CORE_INPUTS, n_utilization_percent: 0 });
  return Object.values(r.outputs).every(v => typeof v === "number" && !Number.isNaN(v));
});
test("no Infinity in outputs", () => {
  const r = calculate({ ...CORE_INPUTS, n_utilization_percent: 0 });
  return Object.values(r.outputs).every(v => typeof v === "number" && Number.isFinite(v));
});
test("final decision state = BLOCKED (2)", () => {
  const r = calculate({ ...CORE_INPUTS, n_utilization_percent: 0 });
  return r.outputs.out_final_decision_state === 2;
});

// ── B. INVALID RESIDUAL VALUE ─────────────────────────────────────────
console.log("B. INVALID RESIDUAL VALUE");
test("residual > purchase → BLOCKED", () => {
  const r = calculate({ ...CORE_INPUTS, n_residual_value: 90000 });
  return r.status === "BLOCKED" && r.outputs.out_final_decision_state === 2;
});

// ── C. INVALID TARGET MARGIN ──────────────────────────────────────────
console.log("C. INVALID TARGET MARGIN");
test("margin >= 100% → BLOCKED", () => {
  const r = calculate({ ...CORE_INPUTS, n_target_margin_percent: 100 });
  return r.status === "BLOCKED" && r.outputs.out_target_sell_rate === 0 && r.outputs.out_final_decision_state === 2;
});
test("margin >= 100% → no NaN/Infinity", () => {
  const r = calculate({ ...CORE_INPUTS, n_target_margin_percent: 100 });
  return allFinite(r.outputs);
});

// ── D. RATE BELOW VARIABLE COST ───────────────────────────────────────
console.log("D. RATE BELOW VARIABLE COST");
test("status = BLOCKED", () => {
  const r = calculate({ ...CORE_INPUTS, n_current_shop_rate: 5, n_labor_rate_per_hour: 100 });
  return r.status === "BLOCKED";
});
test("break_even_status = IMPOSSIBLE (1)", () => {
  const r = calculate({ ...CORE_INPUTS, n_current_shop_rate: 5, n_labor_rate_per_hour: 100 });
  return r.outputs.out_break_even_status === 1;
});
test("utilization_breakeven_percent = 0 (no Infinity)", () => {
  const r = calculate({ ...CORE_INPUTS, n_current_shop_rate: 5, n_labor_rate_per_hour: 100 });
  return r.outputs.out_utilization_breakeven_percent === 0;
});
test("no Infinity in any output", () => {
  const r = calculate({ ...CORE_INPUTS, n_current_shop_rate: 5, n_labor_rate_per_hour: 100 });
  return allFinite(r.outputs);
});

// ── E. PARTIAL OPTIONAL SCENARIO ──────────────────────────────────────
console.log("E. PARTIAL OPTIONAL SCENARIO");
test("scenario_state = NOT_COMPUTED (-1)", () => {
  const r = calculate({ ...CORE_INPUTS, n_annual_production_volume: 100000 });
  return r.outputs.out_production_scenario_state === -1;
});
test("core outputs are still valid", () => {
  const r = calculate({ ...CORE_INPUTS, n_annual_production_volume: 100000 });
  return r.outputs.out_total_cost_per_hour > 0 && allFinite(r.outputs);
});

// ── F. COMPLETE OPTIONAL SCENARIO ─────────────────────────────────────
console.log("F. COMPLETE OPTIONAL SCENARIO");
test("all 6 optional outputs present", () => {
  const r = calculate({ ...CORE_INPUTS, ...COMPLETE_SCENARIO });
  const keys = ["out_setup_count_per_year","out_required_machine_hours","out_capacity_requirement_percent","out_cost_per_part","out_target_sell_price_per_part","out_production_scenario_state"];
  return keys.every(k => typeof r.outputs[k] === "number");
});

// ── G. NO OPTIONAL SCENARIO ───────────────────────────────────────────
console.log("G. NO OPTIONAL SCENARIO");
test("scenario_state = -1 when no scenario supplied", () => {
  const r = calculate({ ...CORE_INPUTS });
  return r.outputs.out_production_scenario_state === -1;
});
test("core outputs valid with no scenario", () => {
  const r = calculate({ ...CORE_INPUTS });
  return allFinite(r.outputs);
});

// ── H. CAPACITY ABOVE 100% ────────────────────────────────────────────
console.log("H. CAPACITY ABOVE 100%");
test("capacity_requirement_percent preserved above 100 (not clamped)", () => {
  const r = calculate({ ...CORE_INPUTS, ...COMPLETE_SCENARIO });
  return r.outputs.out_capacity_requirement_percent > 100;
});
test("scenario_state = CAPACITY_BLOCKED (1)", () => {
  const r = calculate({ ...CORE_INPUTS, ...COMPLETE_SCENARIO });
  return r.outputs.out_production_scenario_state === 1;
});

// ── I. BREAK-EVEN ABOVE 100% ──────────────────────────────────────────
console.log("I. BREAK-EVEN ABOVE 100%");
test("be_pct > 100 preserved (not clamped)", () => {
  const r = calculate({
    n_planned_operating_hours: 2000, n_utilization_percent: 70, n_planned_downtime_percent: 5,
    n_purchase_price: 750000, n_residual_value: 75000, n_economic_life_years: 12,
    n_maintenance_cost: 35000, n_insurance_tax_cost: 12000, n_facility_allocation: 95000,
    n_machine_power_kw: 30, n_electricity_price: 0.15,
    n_consumables_cost_per_hour: 15, n_tooling_cost_per_hour: 22,
    n_operator_count: 1, n_labor_rate_per_hour: 95,
    n_current_shop_rate: 250, n_target_margin_percent: 30,
    n_financing_cost_percent: 4, n_other_annual_fixed_cost: 10000,
  });
  return r.outputs.out_utilization_breakeven_percent > 100 && r.outputs.out_break_even_status === 0;
});

// ── J. POSITIVE RATE SURPLUS ──────────────────────────────────────────
console.log("J. POSITIVE RATE SURPLUS");
test("positive gap and GOOD status", () => {
  const r = calculate({
    ...CORE_INPUTS,
    n_purchase_price: 50000, n_residual_value: 5000, n_economic_life_years: 10,
    n_maintenance_cost: 3000, n_insurance_tax_cost: 1000, n_facility_allocation: 10000,
    n_machine_power_kw: 10, n_electricity_price: 0.10,
    n_consumables_cost_per_hour: 1, n_tooling_cost_per_hour: 2,
    n_operator_count: 1, n_labor_rate_per_hour: 35,
    n_current_shop_rate: 150, n_target_margin_percent: 20,
  });
  return r.outputs.out_current_rate_gap > 0 && r.outputs.out_annual_under_recovery_or_surplus > 0 && r.status === "OK";
});

// ── K. NEGATIVE COST INPUTS ──────────────────────────────────────────
console.log("K. NEGATIVE COST INPUTS");
test("negative economic_life → BLOCKED", () => {
  const r = calculate({ ...CORE_INPUTS, n_economic_life_years: -5 });
  return r.status === "BLOCKED" && allFinite(r.outputs);
});

// ── L. OPTIONAL FINANCING OMITTED ─────────────────────────────────────
console.log("L. OPTIONAL FINANCING OMITTED");
test("financing_cost defaults to 0 when field omitted", () => {
  const inputs = { ...CORE_INPUTS };
  delete (inputs as any).n_financing_cost_percent;
  const r = calculate(inputs);
  return r.outputs.out_annual_financing_cost === 0 && allFinite(r.outputs);
});

// ── SUMMARY ───────────────────────────────────────────────────────────
console.log("");
console.log(`Tests: ${totalTests}, Passed: ${passedTests}, Failed: ${totalTests - passedTests}`);
if (passedTests === totalTests) {
  console.log("ALL EDGE TESTS PASS");
} else {
  console.log("SOME EDGE TESTS FAILED");
  process.exit(1);
}
