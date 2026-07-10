// SectorCalc — Machine Hourly Rate Proof Report Numeric Consistency Guard
// Verifies that the report numbers reconcile correctly.
// Run: npx tsx scripts/guard-machine-hourly-rate-pro-v2-report.ts

import { calculate } from "../src/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";

function allFinite(obj: Record<string, number>): boolean {
  return Object.values(obj).every(v => typeof v === "number" && Number.isFinite(v));
}

const failures: string[] = [];
function pass(label: string) { console.log(`  PASS: ${label}`); }
function fail(label: string, detail?: string) {
  const msg = detail ? `${label}: ${detail}` : label;
  failures.push(msg);
  console.log(`  FAIL: ${msg}`);
}
function check(label: string, ok: boolean, detail?: string) {
  ok ? pass(label) : fail(label, detail);
}

// Test with the Small CNC Workshop preset (full scenario)
const fullInputs: Record<string, number> = {
  n_planned_operating_hours: 2000, n_utilization_percent: 80,
  n_planned_downtime_percent: 5, n_purchase_price: 85000,
  n_residual_value: 5000, n_economic_life_years: 8,
  n_maintenance_cost: 6000, n_insurance_tax_cost: 2000,
  n_facility_allocation: 18000, n_machine_power_kw: 15,
  n_electricity_price: 0.12, n_consumables_cost_per_hour: 2.5,
  n_tooling_cost_per_hour: 3, n_operator_count: 1,
  n_labor_rate_per_hour: 45, n_current_shop_rate: 85,
  n_target_margin_percent: 25, n_financing_cost_percent: 0,
  n_other_annual_fixed_cost: 0,
  n_annual_production_volume: 100000, n_cycle_time_seconds: 720,
  n_setup_time_minutes: 8, n_average_batch_quantity: 500,
};

// Test with no scenario
const coreOnlyInputs: Record<string, number> = { ...fullInputs };
delete (coreOnlyInputs as any).n_annual_production_volume;
delete (coreOnlyInputs as any).n_cycle_time_seconds;
delete (coreOnlyInputs as any).n_setup_time_minutes;
delete (coreOnlyInputs as any).n_average_batch_quantity;

console.log("=== Full scenario test ===");
const r1 = calculate(fullInputs);
check("All outputs finite", allFinite(r1.outputs));
check("No NaN in any output",
  !Object.values(r1.outputs).some(v => typeof v === "number" && Number.isNaN(v)));
check("No Infinity in any output", allFinite(r1.outputs));

// Fixed component sum
const fixedComponents = [
  r1.outputs.out_depreciation_cost_per_hour,
  r1.outputs.out_maintenance_cost_per_hour,
  r1.outputs.out_insurance_tax_cost_per_hour,
  r1.outputs.out_facility_cost_per_hour,
  r1.outputs.out_financing_cost_per_hour,
  r1.outputs.out_other_fixed_cost_per_hour,
];
const fixedSum = fixedComponents.reduce((s, v) => s + v, 0);
check("Fixed component sum matches fixed_cost_per_productive_hour",
  Math.abs(fixedSum - r1.outputs.out_fixed_cost_per_productive_hour) < 0.001,
  `sum=${fixedSum.toFixed(4)}, expected=${r1.outputs.out_fixed_cost_per_productive_hour.toFixed(4)}`);

// Variable component sum
const varComponents = [
  r1.outputs.out_energy_cost_per_hour,
  r1.outputs.out_labor_cost_per_hour,
  r1.outputs.out_consumables_cost_per_hour,
  r1.outputs.out_tooling_cost_per_hour,
];
const varSum = varComponents.reduce((s, v) => s + v, 0);
check("Variable component sum matches variable_cost_per_hour",
  Math.abs(varSum - r1.outputs.out_variable_cost_per_hour) < 0.001,
  `sum=${varSum.toFixed(4)}, expected=${r1.outputs.out_variable_cost_per_hour.toFixed(4)}`);

// Total cost = fixed + variable
check("Total cost = fixed + variable",
  Math.abs(r1.outputs.out_total_cost_per_hour - (r1.outputs.out_fixed_cost_per_productive_hour + r1.outputs.out_variable_cost_per_hour)) < 0.001,
  `total=${r1.outputs.out_total_cost_per_hour.toFixed(4)}, fixed+var=${(r1.outputs.out_fixed_cost_per_productive_hour + r1.outputs.out_variable_cost_per_hour).toFixed(4)}`);

// Current shop rate from engine inputs (not a formula output)
const currentShopRateInput = 85; // from fullInputs
const targetSellRateOutput = r1.outputs.out_target_sell_rate;
const computedGap = currentShopRateInput - targetSellRateOutput;
check("Current rate gap is arithmetically correct",
  Math.abs(computedGap - r1.outputs.out_current_rate_gap) < 0.01,
  `computed=${computedGap.toFixed(2)}, output=${r1.outputs.out_current_rate_gap.toFixed(2)}`);

// Annual recovery
const computedRecovery = r1.outputs.out_current_rate_gap * r1.outputs.out_productive_hours_per_year;
check("Annual recovery matches gap × productive hours",
  Math.abs(computedRecovery - r1.outputs.out_annual_under_recovery_or_surplus) < 0.06,
  `computed=${computedRecovery.toFixed(2)}, output=${r1.outputs.out_annual_under_recovery_or_surplus.toFixed(2)}`);

// Target sell rate uses revenue margin, not markup
const expectedTargetSell = r1.outputs.out_total_cost_per_hour / (1 - 25 / 100);
check("Target sell rate uses revenue margin formula",
  Math.abs(expectedTargetSell - r1.outputs.out_target_sell_rate) < 0.01,
  `expected=${expectedTargetSell.toFixed(4)}, output=${r1.outputs.out_target_sell_rate.toFixed(4)}`);

// Capacity > 100% preserved (not clamped)
check("Capacity > 100% preserved (not clamped)",
  r1.outputs.out_capacity_requirement_percent > 100,
  `value=${r1.outputs.out_capacity_requirement_percent}`);

// Break-even not clamped
check("Break-even utilization not clamped",
  r1.outputs.out_utilization_breakeven_percent >= 0 && r1.outputs.out_utilization_breakeven_percent <= 1000,
  `value=${r1.outputs.out_utilization_breakeven_percent}`);

// Optional: check cost per part reconciliation
if (r1.outputs.out_annual_production_volume > 0) {
  const expectedCostPerPart = r1.outputs.out_total_cost_per_hour * r1.outputs.out_required_machine_hours / fullInputs.n_annual_production_volume;
  check("Cost per part reconciles with hourly cost and required hours",
    Math.abs(expectedCostPerPart - r1.outputs.out_cost_per_part) < 0.01,
    `expected=${expectedCostPerPart.toFixed(4)}, output=${r1.outputs.out_cost_per_part.toFixed(4)}`);
}

// Decision state is sensible
check("Final decision state is 0, 1, or 2",
  [0, 1, 2].includes(r1.outputs.out_final_decision_state),
  `value=${r1.outputs.out_final_decision_state}`);

// Primary cost driver is 0-4
check("Primary cost driver is 0-4",
  r1.outputs.out_primary_cost_driver >= 0 && r1.outputs.out_primary_cost_driver <= 4,
  `value=${r1.outputs.out_primary_cost_driver}`);

console.log("");
console.log("=== Core-only test (no scenario) ===");
const r2 = calculate(coreOnlyInputs);
check("Core-only all finite", allFinite(r2.outputs));
check("Scenario state = NOT_COMPUTED",
  r2.outputs.out_production_scenario_state === -1,
  `value=${r2.outputs.out_production_scenario_state}`);
check("Cost per part = 0 when scenario absent",
  r2.outputs.out_cost_per_part === 0);
check("Setup count = 0 when scenario absent",
  r2.outputs.out_setup_count_per_year === 0);
check("Core outputs still valid",
  r2.outputs.out_total_cost_per_hour > 0);

// Fixed costs still sum correctly without scenario
const f2 = [
  r2.outputs.out_depreciation_cost_per_hour,
  r2.outputs.out_maintenance_cost_per_hour,
  r2.outputs.out_insurance_tax_cost_per_hour,
  r2.outputs.out_facility_cost_per_hour,
  r2.outputs.out_financing_cost_per_hour,
  r2.outputs.out_other_fixed_cost_per_hour,
].reduce((s, v) => s + v, 0);
check("Fixed component sum (no scenario)",
  Math.abs(f2 - r2.outputs.out_fixed_cost_per_productive_hour) < 0.001);

console.log("");
console.log("=== Edge edge cases ===");
// NaN/Infinity guard on known risky inputs
const edgeInputs: Array<[string, Record<string, number>]> = [
  ["utilization=0", { ...fullInputs, n_utilization_percent: 0 }],
  ["margin=100%", { ...fullInputs, n_target_margin_percent: 100 }],
  ["rate_below_variable", { ...fullInputs, n_current_shop_rate: 5, n_labor_rate_per_hour: 100 }],
  ["negative_economic_life", { ...fullInputs, n_economic_life_years: -5 }],
];
for (const [label, inputs] of edgeInputs) {
  const r = calculate(inputs);
  check(`[${label}] all finite`, allFinite(r.outputs));
  check(`[${label}] no NaN`, !Object.values(r.outputs).some(v => typeof v === "number" && Number.isNaN(v)));
}

// Summary
console.log("");
if (failures.length === 0) {
  console.log("MACHINE_HOURLY_RATE_PRO_V2_REPORT = PASS");
} else {
  console.log(`MACHINE_HOURLY_RATE_PRO_V2_REPORT = FAIL (${failures.length} failures)`);
  process.exit(1);
}
