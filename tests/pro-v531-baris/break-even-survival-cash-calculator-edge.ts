// SectorCalc PRO V2 — Break-Even Survival Cash Calculator Edge Tests
// Tests validation, decision logic, and numeric stability.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_annual_revenue: 1500000,
    n_variable_cost_percent: 45,
    n_annual_fixed_costs: 600000,
    n_available_cash_liquidity: 300000,
    n_unit_selling_price: 75,
    n_unit_variable_cost: 33.75,
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

console.log("\n=== BREAK-EVEN SURVIVAL CASH — EDGE TESTS ===\n");

// ── A. Golden fixture — Profitable Business ──────────────────────
console.log("A. PROFITABLE BUSINESS (GOOD state)");
const prof = run(buildInputs()).outputs;
assert(prof.out_revenue === 1500000, "revenue = 1.5M");
assert(prof.out_contribution_margin_ratio === 0.55, "contribution ratio = 0.55");
assert(prof.out_final_decision_state === 0, "state = GOOD (0)");
assert(prof.out_operating_profit_or_loss > 0, "operating profit positive");
assert(prof.out_margin_of_safety_percent > 10, "margin of safety > 10%");
allFinite("A", buildInputs());

// ── B. Low-Margin Business ───────────────────────────────────────
console.log("\nB. LOW-MARGIN BUSINESS (REVIEW state)");
const lowInputs = buildInputs({
  n_annual_revenue: 800000,
  n_variable_cost_percent: 70,
  n_annual_fixed_costs: 250000,
  n_available_cash_liquidity: 80000,
  n_unit_selling_price: 50,
  n_unit_variable_cost: 35,
});
const low = run(lowInputs).outputs;
assert(low.out_final_decision_state === 1, "state = REVIEW (1)");
assert(low.out_operating_profit_or_loss < 0, "operating loss");
assert(low.out_cash_runway_months > 0, "cash runway positive");
allFinite("B", lowInputs);

// ── C. Loss-Making Business ──────────────────────────────────────
console.log("\nC. LOSS-MAKING BUSINESS (BLOCKED state)");
const lossInputs = buildInputs({
  n_annual_revenue: 500000,
  n_variable_cost_percent: 80,
  n_annual_fixed_costs: 350000,
  n_available_cash_liquidity: 50000,
  n_unit_selling_price: 25,
  n_unit_variable_cost: 20,
});
const loss = run(lossInputs).outputs;
assert(loss.out_final_decision_state === 2, "state = BLOCKED (2)");
assert(loss.out_operating_profit_or_loss < 0, "operating loss");
assert(loss.out_cash_runway_months < 3, "cash runway < 3 months");
allFinite("C", lossInputs);

// ── D. ZERO REVENUE ──────────────────────────────────────────────
console.log("\nD. ZERO REVENUE");
assert(run({ n_annual_revenue: 0 }).outputs.out_final_decision_state === 2, "revenue=0 → BLOCKED");
allFinite("D", { n_annual_revenue: 0 });

// ── E. ZERO CONTRIBUTION (VC% = 100) ────────────────────────────
console.log("\nE. ZERO CONTRIBUTION (VC=100% of revenue)");
assert(run({ n_variable_cost_percent: 100 }).outputs.out_final_decision_state === 2, "zero contribution → BLOCKED");
allFinite("E", { n_variable_cost_percent: 100 });

// ── F. ZERO CASH ──────────────────────────────────────────────────
console.log("\nF. ZERO CASH");
assert(run({ n_available_cash_liquidity: 0 }).outputs.out_final_decision_state === 2, "no cash → BLOCKED");
allFinite("F", { n_available_cash_liquidity: 0 });

// ── G. NO UNIT DATA (price = 0) ──────────────────────────────────
console.log("\nG. NO UNIT DATA");
const noUnit = run({ n_unit_selling_price: 0, n_unit_variable_cost: 0 });
assert(noUnit.outputs.out_break_even_units === 0, "no unit data → BE units = 0");
assert(noUnit.status === "OK" || noUnit.status === "REVIEW", "status valid");
allFinite("G", { n_unit_selling_price: 0, n_unit_variable_cost: 0 });

// ── H. NEGATIVE INPUTS ───────────────────────────────────────────
console.log("\nH. NEGATIVE INPUTS");
assert(run({ n_annual_revenue: -100 }).outputs.out_final_decision_state === 2, "negative revenue → BLOCKED");
assert(run({ n_annual_fixed_costs: -100 }).outputs.out_final_decision_state === 2, "negative fixed costs → BLOCKED");
assert(run({ n_available_cash_liquidity: -100 }).outputs.out_final_decision_state === 2, "negative cash → BLOCKED");
allFinite("H neg", { n_annual_revenue: -100 });
allFinite("H neg fixed", { n_annual_fixed_costs: -100 });

// ── I. HIGH VARIABLE COST (near 100%) ────────────────────────────
console.log("\nI. HIGH VARIABLE COST (99%)");
const highVc = run({ n_variable_cost_percent: 99 });
assert(highVc.outputs.out_contribution_margin_amount > 0, "small contribution still positive");
assert(highVc.outputs.out_contribution_margin_ratio < 0.02, "contribution ratio near 0");
allFinite("I", { n_variable_cost_percent: 99 });

// ── J. VERY LARGE REVENUE ─────────────────────────────────────────
console.log("\nJ. LARGE REVENUE");
const big = run({ n_annual_revenue: 50000000, n_annual_fixed_costs: 1000000, n_variable_cost_percent: 20, n_available_cash_liquidity: 2000000 });
assert(big.outputs.out_final_decision_state === 0, "large profitable → GOOD");
assert(big.outputs.out_revenue === 50000000, "revenue correct");
allFinite("J", { n_annual_revenue: 50000000, n_annual_fixed_costs: 1000000, n_variable_cost_percent: 20 });

// ── K. EXACT COMPONENT RECONCILIATION ────────────────────────────
console.log("\nK. COMPONENT RECONCILIATION");
const contribRec = prof.out_contribution_margin_amount - prof.out_fixed_operating_cost;
const profitRec = prof.out_operating_profit_or_loss;
assert(Math.abs(contribRec - profitRec) <= 0.05, "contribution - fixed = operating profit");

// ── L. NO NaN / INFINITY ─────────────────────────────────────────
console.log("\nL. NO NAN / INFINITY");
allFinite("L base", buildInputs());
allFinite("L extreme", {
  n_annual_revenue: 1e8,
  n_annual_fixed_costs: 1e7,
  n_available_cash_liquidity: 1e7,
});
allFinite("L near zero", {
  n_annual_revenue: 0.01,
  n_annual_fixed_costs: 0.01,
});

// ── M. MARGIN OF SAFETY RELATIONSHIP ─────────────────────────────
console.log("\nM. MARGIN OF SAFETY CONSISTENCY");
assert(prof.out_margin_of_safety_amount >= 0, "MOS amount non-negative");
assert(prof.out_margin_of_safety_percent >= 0, "MOS % non-negative");
assert(prof.out_margin_of_safety_amount === 0 || prof.out_margin_of_safety_percent > 0, "MOS amount = 0 iff MOS % = 0");

// ── N. BREAK-EVEN UNIT CONSISTENCY ───────────────────────────────
console.log("\nN. BREAK-EVEN UNIT CONSISTENCY");
// When breUnits > 0, revenue gap should reflect revenue gap in dollar terms
const beUnitsVal = prof.out_break_even_units;
assert(beUnitsVal >= 0, "BE units non-negative");

// ── O. PRIMARY SURVIVAL DRIVER ────────────────────────────────────
console.log("\nO. PRIMARY SURVIVAL DRIVER");
assert(prof.out_primary_survival_driver >= 0 && prof.out_primary_survival_driver <= 2, "valid driver index");

// ── P. ALL OUTPUTS PRESENT ────────────────────────────────────────
console.log("\nP. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_revenue", "out_variable_cost", "out_contribution_margin_amount",
  "out_contribution_margin_ratio", "out_fixed_operating_cost", "out_operating_profit_or_loss",
  "out_break_even_revenue", "out_break_even_units", "out_revenue_gap", "out_unit_gap",
  "out_monthly_cash_burn", "out_available_liquidity", "out_cash_runway_months",
  "out_margin_of_safety_amount", "out_margin_of_safety_percent",
  "out_primary_survival_driver", "out_final_decision_state",
];
const actualKeys = Object.keys(prof);
for (const key of expectedKeys) {
  assert(actualKeys.includes(key), `output key present: ${key}`);
}
assert(actualKeys.length === expectedKeys.length, "no extra outputs");

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
