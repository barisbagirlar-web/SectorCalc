// SectorCalc PRO V2 — True Employee Cost Statement Edge Tests

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";

function assert(condition: boolean, label: string) {
  if (!condition) { console.error(`  FAIL: ${label}`); process.exit(1); }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_annual_base_salary: 50000,
    n_payroll_tax_rate: 12,
    n_health_insurance_annual: 4000,
    n_pension_contribution_rate: 4,
    n_bonus_target_rate: 5,
    n_paid_leave_weeks: 4,
    n_training_budget_annual: 1000,
    n_equipment_it_annual: 1500,
    n_workspace_facility_annual: 2500,
    n_recruitment_allocation_rate: 2,
    n_other_benefits_annual: 0,
    n_productive_hours_per_year: 1664,
    ...overrides,
  };
}

function run(overrides: Record<string, number> = {}) { return calculate(buildInputs(overrides)); }
function get(key: string, overrides: Record<string, number> = {}) { return run(overrides).outputs[key] ?? 0; }
function allFinite(label: string, overrides: Record<string, number> = {}) {
  const res = run(overrides);
  assert(Object.values(res.outputs).every((v) => typeof v === "number" && Number.isFinite(v)), `${label}: all finite`);
}

console.log("\n=== TRUE EMPLOYEE COST — EDGE TESTS ===\n");

// ── A. Golden fixture — Standard Employee (GOOD) ─────────────────
console.log("A. STANDARD EMPLOYEE (GOOD)");
const resA = run();
const OA = resA.outputs;
assert(OA.out_final_decision_state === 0, "state = GOOD (0)");
assert(OA.out_base_salary === 50000, "base salary = 50k");
assert(OA.out_fully_loaded_annual_cost > 50000, "loaded cost > base");
assert(OA.out_base_to_loaded_multiplier > 1, "multiplier > 1");
assert(OA.out_base_to_loaded_multiplier <= 1.5, "multiplier <= 1.5");
allFinite("A", buildInputs());

// ── B. Highly Compensated (REVIEW) ──────────────────────────────
console.log("\nB. HIGHLY COMPENSATED (REVIEW)");
const resB = run({ n_annual_base_salary: 150000, n_payroll_tax_rate: 25, n_health_insurance_annual: 12000, n_pension_contribution_rate: 8, n_bonus_target_rate: 20, n_paid_leave_weeks: 5, n_training_budget_annual: 5000, n_equipment_it_annual: 8000, n_workspace_facility_annual: 15000, n_recruitment_allocation_rate: 5, n_other_benefits_annual: 3000, n_productive_hours_per_year: 1600 });
assert(resB.outputs.out_final_decision_state === 1, "state = REVIEW (1)");
assert(resB.outputs.out_base_to_loaded_multiplier > 1.5, "multiplier > 1.5");
assert(resB.outputs.out_base_to_loaded_multiplier <= 2.5, "multiplier <= 2.5");
allFinite("B", { n_annual_base_salary: 150000 });

// ── C. Executive Package (BLOCKED) ─────────────────────────────
console.log("\nC. EXECUTIVE PACKAGE (BLOCKED)");
const resC = run({ n_annual_base_salary: 300000, n_payroll_tax_rate: 28, n_health_insurance_annual: 30000, n_pension_contribution_rate: 15, n_bonus_target_rate: 50, n_paid_leave_weeks: 6, n_training_budget_annual: 15000, n_equipment_it_annual: 15000, n_workspace_facility_annual: 40000, n_recruitment_allocation_rate: 8, n_other_benefits_annual: 20000, n_productive_hours_per_year: 1500 });
assert(resC.outputs.out_final_decision_state === 2, "state = BLOCKED (2)");
assert(resC.outputs.out_base_to_loaded_multiplier > 2.5, "multiplier > 2.5");
allFinite("C", { n_annual_base_salary: 300000 });

// ── D. ZERO BASE SALARY ─────────────────────────────────────────
console.log("\nD. ZERO BASE SALARY");
assert(run({ n_annual_base_salary: 0 }).outputs.out_final_decision_state === 2, "salary=0 → BLOCKED");
allFinite("D", { n_annual_base_salary: 0 });

// ── E. NEGATIVE BASE SALARY ─────────────────────────────────────
console.log("\nE. NEGATIVE BASE SALARY");
assert(run({ n_annual_base_salary: -100 }).outputs.out_final_decision_state === 2, "negative salary → BLOCKED");
allFinite("E", { n_annual_base_salary: -100 });

// ── F. HOURLY WAGE (< 1000 → annual conversion) ─────────────────
console.log("\nF. HOURLY WAGE CONVERSION");
const hourly = run({ n_annual_base_salary: 45 });
assert(hourly.outputs.out_base_salary === 45 * 2080, "hourly 45 → annual 93600");
assert(hourly.outputs.out_fully_loaded_annual_cost > 93600, "loaded > annual base");
allFinite("F", { n_annual_base_salary: 45 });

// ── G. ZERO OVERHEAD / ALL OPTIONALS MISSING ────────────────────
console.log("\nG. ZERO OVERHEAD (all optionals = 0)");
const minimal = calculate({
  n_annual_base_salary: 50000,
  n_payroll_tax_rate: 0,
  n_health_insurance_annual: 0,
  n_pension_contribution_rate: 0,
  n_bonus_target_rate: 0,
  n_paid_leave_weeks: 0,
  n_training_budget_annual: 0,
  n_equipment_it_annual: 0,
  n_workspace_facility_annual: 0,
  n_recruitment_allocation_rate: 0,
  n_other_benefits_annual: 0,
  n_productive_hours_per_year: 0,
});
assert(minimal.outputs.out_fully_loaded_annual_cost > 50000, "defaults fill in (leave, training, etc)");
allFinite("G", { n_payroll_tax_rate: 0 });

// ── H. EXTREME VALUES ───────────────────────────────────────────
console.log("\nH. EXTREME VALUES");
const extreme = run({ n_payroll_tax_rate: 60, n_bonus_target_rate: 100 });
assert(extreme.status === "OK" || extreme.status === "REVIEW", "valid status");
allFinite("H extreme", { n_payroll_tax_rate: 60, n_bonus_target_rate: 100 });

// ── I. COMPONENT RECONCILIATION ─────────────────────────────────
console.log("\nI. COMPONENT RECONCILIATION");
const compSum = OA.out_base_salary + OA.out_payroll_taxes + OA.out_health_insurance +
  OA.out_pension_contribution + OA.out_bonus_allocation + OA.out_paid_leave_cost +
  OA.out_training_cost + OA.out_recruitment_allocation + OA.out_equipment_it_cost +
  OA.out_workspace_facility_cost + OA.out_other_benefits;
assert(Math.abs(compSum - OA.out_fully_loaded_annual_cost) <= 0.05, "components sum = fully loaded");

// ── J. NO NaN / INFINITY ────────────────────────────────────────
console.log("\nJ. NO NAN / INFINITY");
allFinite("J base", buildInputs());
allFinite("J extreme high", {
  n_annual_base_salary: 1e7,
  n_payroll_tax_rate: 50,
  n_bonus_target_rate: 100,
});
allFinite("J minimal", {
  n_annual_base_salary: 1,
  n_payroll_tax_rate: 0,
  n_paid_leave_weeks: 0,
});

// ── K. ALL OUTPUTS PRESENT ──────────────────────────────────────
console.log("\nK. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_base_salary", "out_payroll_taxes", "out_health_insurance",
  "out_pension_contribution", "out_bonus_allocation", "out_paid_leave_cost",
  "out_training_cost", "out_recruitment_allocation", "out_equipment_it_cost",
  "out_workspace_facility_cost", "out_other_benefits",
  "out_fully_loaded_annual_cost", "out_monthly_cost",
  "out_productive_hours_per_year", "out_productive_hourly_cost",
  "out_base_to_loaded_multiplier", "out_primary_cost_driver",
  "out_final_decision_state",
];
const actualKeys = Object.keys(OA);
for (const key of expectedKeys) {
  assert(actualKeys.includes(key), `output key present: ${key}`);
}
assert(actualKeys.length === expectedKeys.length, "no extra outputs");

// ── L. MULTIPLIER CONSISTENCY ───────────────────────────────────
console.log("\nL. MULTIPLIER CONSISTENCY");
const calcMultiplier = OA.out_fully_loaded_annual_cost / OA.out_base_salary;
assert(Math.abs(calcMultiplier - OA.out_base_to_loaded_multiplier) <= 0.01, "multiplier matches total/base");

// ── M. PRIMARY COST DRIVER ──────────────────────────────────────
console.log("\nM. PRIMARY COST DRIVER");
assert(OA.out_primary_cost_driver >= 0, "valid driver index");
assert(OA.out_primary_cost_driver <= 10, "driver index in range");

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
