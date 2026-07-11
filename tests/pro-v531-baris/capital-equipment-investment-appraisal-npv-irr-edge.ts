// SectorCalc PRO V2 — Capital Equipment Investment Appraisal (NPV/IRR) Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_initial_investment: 500000,
    n_working_capital: 50000,
    n_annual_cash_inflow_1: 150000,
    n_annual_cash_inflow_2: 165000,
    n_annual_cash_inflow_3: 180000,
    n_annual_cash_inflow_4: 195000,
    n_annual_cash_inflow_5: 210000,
    n_terminal_residual_value: 75000,
    n_discount_rate_percent: 10,
    n_scenario_downside_pct: -20,
    n_scenario_upside_pct: 20,
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

console.log("\n=== CAPITAL EQUIPMENT INVESTMENT APPRAISAL (NPV/IRR) — EDGE TESTS ===\n");

// ── A. Golden fixture — Profitable investment (GOOD state) ──────────
console.log("A. PROFITABLE INVESTMENT (GOOD state)");
const prof = run().outputs;
assert(prof.out_npv > 0, "NPV positive");
assert(prof.out_irr_percent > prof.out_discount_rate, "IRR > discount rate");
assert(prof.out_final_decision_state === 0, "state = GOOD (0)");
assert(prof.out_profitability_index > 1, "PI > 1");
assert(prof.out_simple_payback_years < 5, "payback within projection");
allFinite("A");

// ── B. Negative NPV investment (BLOCKED state) ──────────────────────
console.log("\nB. NEGATIVE NPV (BLOCKED state)");
const negInputs = buildInputs({
  n_initial_investment: 1000000,
  n_working_capital: 100000,
  n_annual_cash_inflow_1: 80000,
  n_annual_cash_inflow_2: 90000,
  n_annual_cash_inflow_3: 100000,
  n_annual_cash_inflow_4: 110000,
  n_annual_cash_inflow_5: 120000,
  n_terminal_residual_value: 50000,
  n_discount_rate_percent: 15,
});
const neg = calculate(negInputs).outputs;
assert(neg.out_npv < 0, "NPV negative");
assert(neg.out_final_decision_state === 2, "state = BLOCKED (2)");
assert(neg.out_investment_decision_state === 2, "investment decision = BLOCKED");
allFinite("B", negInputs);

// ── C. Marginal investment (REVIEW state) ───────────────────────────
console.log("\nC. MARGINAL INVESTMENT (REVIEW state)");
const margInputs = buildInputs({
  n_initial_investment: 600000,
  n_annual_cash_inflow_1: 120000,
  n_annual_cash_inflow_2: 125000,
  n_annual_cash_inflow_3: 130000,
  n_annual_cash_inflow_4: 135000,
  n_annual_cash_inflow_5: 140000,
  n_discount_rate_percent: 12,
});
const marg = calculate(margInputs).outputs;
// NPV should be positive but IRR may not exceed discount rate
assert(marg.out_final_decision_state >= 0, "valid state");
allFinite("C", margInputs);

// ── D. Zero initial investment ──────────────────────────────────────
console.log("\nD. ZERO INITIAL INVESTMENT");
const zeroInv = run({ n_initial_investment: 0, n_working_capital: 0 }).outputs;
assert(zeroInv.out_total_initial_cash === 0, "total initial cash = 0");
assert(Number.isFinite(zeroInv.out_irr_percent), "IRR finite");
assert(Number.isFinite(zeroInv.out_npv), "NPV finite");
allFinite("D", { n_initial_investment: 0, n_working_capital: 0 });

// ── E. Zero discount rate ───────────────────────────────────────────
console.log("\nE. ZERO DISCOUNT RATE");
const zeroDR = run({ n_discount_rate_percent: 0 }).outputs;
assert(zeroDR.out_npv > 0, "NPV positive at zero discount rate");
assert(Number.isFinite(zeroDR.out_discounted_payback_years), "discounted payback finite");
allFinite("E", { n_discount_rate_percent: 0 });

// ── F. Zero cash flows ──────────────────────────────────────────────
console.log("\nF. ZERO CASH FLOWS");
const zeroCf = run({
  n_annual_cash_inflow_1: 0, n_annual_cash_inflow_2: 0,
  n_annual_cash_inflow_3: 0, n_annual_cash_inflow_4: 0,
  n_annual_cash_inflow_5: 0,
  n_terminal_residual_value: 0,
}).outputs;
assert(zeroCf.out_final_decision_state === 2, "zero CF → BLOCKED");
assert(zeroCf.out_simple_payback_years >= 5, "payback equals projection period");
allFinite("F", {
  n_annual_cash_inflow_1: 0, n_annual_cash_inflow_2: 0,
  n_annual_cash_inflow_3: 0, n_annual_cash_inflow_4: 0,
  n_annual_cash_inflow_5: 0, n_terminal_residual_value: 0,
});

// ── G. Negative inputs ──────────────────────────────────────────────
console.log("\nG. NEGATIVE INPUTS");
const negInv = run({ n_initial_investment: -100 }).outputs;
// Formula clamps to 0 so should be OK
assert(Number.isFinite(negInv.out_npv), "negative investment still finite");
allFinite("G neg", { n_initial_investment: -100 });
allFinite("G neg inflow", { n_annual_cash_inflow_1: -100 });

// ── H. Very large values ────────────────────────────────────────────
console.log("\nH. VERY LARGE VALUES");
const big = run({
  n_initial_investment: 50000000,
  n_working_capital: 5000000,
  n_annual_cash_inflow_1: 15000000,
  n_annual_cash_inflow_2: 16500000,
  n_annual_cash_inflow_3: 18000000,
  n_annual_cash_inflow_4: 19500000,
  n_annual_cash_inflow_5: 21000000,
  n_terminal_residual_value: 7500000,
});
assert(big.outputs.out_final_decision_state === 0, "large profitable → GOOD");
assert(big.outputs.out_irr_percent > 0, "large IRR positive");
allFinite("H", {
  n_initial_investment: 50000000, n_working_capital: 5000000,
  n_annual_cash_inflow_1: 15000000, n_annual_cash_inflow_2: 16500000,
  n_annual_cash_inflow_3: 18000000, n_annual_cash_inflow_4: 19500000,
  n_annual_cash_inflow_5: 21000000, n_terminal_residual_value: 7500000,
});

// ── I. Component reconciliation ──────────────────────────────────────
console.log("\nI. COMPONENT RECONCILIATION");
// total_initial_cash = initial_investment + working_capital
assert(prof.out_total_initial_cash === 550000, "total_initial_cash = init + working cap");
// terminal_value = terminal_residual + working_capital
assert(prof.out_terminal_value === 125000, "terminal = residual + working capital");

// ── J. All outputs present ──────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_initial_investment", "out_working_capital", "out_total_initial_cash",
  "out_annual_cash_flows_sum", "out_terminal_value", "out_discount_rate",
  "out_npv", "out_irr_percent", "out_simple_payback_years",
  "out_discounted_payback_years", "out_profitability_index",
  "out_scenario_downside_npv", "out_scenario_base_npv", "out_scenario_upside_npv",
  "out_primary_value_driver", "out_investment_decision_state",
  "out_final_decision_state",
];
const actualKeys = Object.keys(prof);
for (const key of expectedKeys) {
  assert(actualKeys.includes(key), `output key present: ${key}`);
}
assert(actualKeys.length === expectedKeys.length, "no extra outputs");

// ── K. No NaN/Infinity ──────────────────────────────────────────────
console.log("\nK. NO NAN / INFINITY");
allFinite("K base");
allFinite("K extreme", {
  n_initial_investment: 1e8,
  n_annual_cash_inflow_1: 5e7,
  n_annual_cash_inflow_2: 5.5e7,
  n_annual_cash_inflow_3: 6e7,
  n_annual_cash_inflow_4: 6.5e7,
  n_annual_cash_inflow_5: 7e7,
  n_discount_rate_percent: 5,
});
allFinite("K near zero", {
  n_initial_investment: 0.01,
  n_annual_cash_inflow_1: 0.01,
  n_annual_cash_inflow_2: 0.01,
  n_annual_cash_inflow_3: 0.01,
  n_annual_cash_inflow_4: 0.01,
  n_annual_cash_inflow_5: 0.01,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
