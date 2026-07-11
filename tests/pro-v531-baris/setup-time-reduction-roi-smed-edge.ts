// SectorCalc PRO V2 — Setup Time Reduction ROI (SMED) Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_current_setup_time_minutes: 30,
    n_future_setup_time_minutes: 10,
    n_setups_per_year: 500,
    n_machine_hourly_rate: 85,
    n_labor_rate_per_hour: 45,
    n_implementation_cost: 35000,
    n_operator_count: 2,
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

console.log("\n=== SETUP TIME REDUCTION ROI (SMED) — EDGE TESTS ===\n");

// ── A. Standard SMED case (REVIEW state — payback 12-24 months) ──────
console.log("A. STANDARD SMED (REVIEW state)");
const good = run().outputs;
assert(good.out_current_setup_time === 30, "current setup = 30 min");
assert(good.out_future_setup_time === 10, "future setup = 10 min");
assert(good.out_time_saved_per_setup === 20, "time saved = 20 min");
assert(good.out_annual_hours_recovered > 0, "annual hours recovered > 0");
assert(good.out_annual_financial_benefit > 0, "annual benefit > 0");
assert(good.out_payback_months >= 12, "payback >= 12 months");
assert(good.out_payback_months <= 24, "payback <= 24 months");
assert(good.out_final_decision_state === 1, "state = REVIEW (1)");
allFinite("A");

// ── B. Moderate payback (REVIEW state — 12-24 months) ────────────────
console.log("\nB. MODERATE PAYBACK (REVIEW state)");
const review = buildInputs({
  n_current_setup_time_minutes: 45,
  n_future_setup_time_minutes: 25,
  n_setups_per_year: 200,
  n_machine_hourly_rate: 200,
  n_labor_rate_per_hour: 65,
  n_implementation_cost: 40000,
  n_operator_count: 3,
});
const reviewResult = calculate(review);
const revOut = reviewResult.outputs;
assert(revOut.out_payback_months >= 12, "payback >= 12 months");
assert(revOut.out_payback_months <= 24, "payback <= 24 months");
assert(revOut.out_final_decision_state === 1, "state = REVIEW (1)");
allFinite("B", review);

// ── C. Extended payback (BLOCKED state — > 24 months) ────────────────
console.log("\nC. EXTENDED PAYBACK (BLOCKED state)");
const blocked = run({
  n_current_setup_time_minutes: 15,
  n_future_setup_time_minutes: 12,
  n_setups_per_year: 50,
  n_machine_hourly_rate: 50,
  n_labor_rate_per_hour: 30,
  n_implementation_cost: 100000,
  n_operator_count: 1,
}).outputs;
assert(blocked.out_payback_months > 24, "payback > 24 months");
assert(blocked.out_final_decision_state === 2, "state = BLOCKED (2)");
allFinite("C", blocked);

// ── D. Zero inputs boundary ─────────────────────────────────────────
console.log("\nD. ZERO INPUTS");
const zero = run({
  n_current_setup_time_minutes: 0,
  n_future_setup_time_minutes: 0,
  n_setups_per_year: 0,
  n_machine_hourly_rate: 0,
  n_labor_rate_per_hour: 0,
  n_implementation_cost: 0,
  n_operator_count: 0,
}).outputs;
assert(zero.out_time_saved_per_setup === 0, "zero inputs → time saved = 0");
assert(zero.out_annual_financial_benefit === 0, "zero inputs → benefit = 0");
assert(zero.out_payback_months === 999, "zero inputs → payback = 999 (fallback)");
assert(zero.out_final_decision_state === 2, "zero inputs → BLOCKED (payback > 24)");
allFinite("D", {
  n_current_setup_time_minutes: 0,
  n_future_setup_time_minutes: 0,
  n_setups_per_year: 0,
  n_machine_hourly_rate: 0,
  n_labor_rate_per_hour: 0,
  n_implementation_cost: 0,
  n_operator_count: 0,
});

// ── E. Negative inputs boundary ──────────────────────────────────────
console.log("\nE. NEGATIVE INPUTS");
const neg = run({
  n_current_setup_time_minutes: -30,
  n_future_setup_time_minutes: -10,
  n_setups_per_year: -100,
}).outputs;
assert(neg.out_current_setup_time === 0, "negative setup clamped to 0");
assert(neg.out_time_saved_per_setup === 0, "negative → time saved = 0");
assert(neg.out_final_decision_state === 2, "negative → BLOCKED");
allFinite("E", { n_current_setup_time_minutes: -30, n_future_setup_time_minutes: -10, n_setups_per_year: -100 });

// ── F. Extreme / high values ─────────────────────────────────────────
console.log("\nF. EXTREME VALUES");
const extreme = run({
  n_current_setup_time_minutes: 500,
  n_future_setup_time_minutes: 1,
  n_setups_per_year: 10000,
  n_machine_hourly_rate: 5000,
  n_labor_rate_per_hour: 500,
  n_implementation_cost: 1000000,
  n_operator_count: 10,
}).outputs;
assert(extreme.out_annual_hours_recovered > 0, "extreme hours recovered positive");
assert(Number.isFinite(extreme.out_annual_hours_recovered), "extreme hours recovered finite");
assert(extreme.out_final_decision_state === 0, "extreme → GOOD (rapid payback)");
allFinite("F", extreme);

// ── G. Component reconciliation ──────────────────────────────────────
console.log("\nG. COMPONENT RECONCILIATION");
const recon = run().outputs;
// annual financial benefit = labor saving + machine capacity value
assert(Math.abs((recon.out_labor_saving + recon.out_machine_capacity_value) - recon.out_annual_financial_benefit) <= 0.05, "labor + machine = total benefit");

// time_saved = current - future
assert(Math.abs(recon.out_time_saved_per_setup - (recon.out_current_setup_time - recon.out_future_setup_time)) <= 0.05, "time saved = current - future");

// ── H. Payback calculation ───────────────────────────────────────────
console.log("\nH. PAYBACK CALCULATION");
const payback = run({ n_implementation_cost: 12000 }).outputs;
const expectedPayback = (12000 / payback.out_annual_financial_benefit) * 12;
assert(Math.abs(payback.out_payback_months - expectedPayback) <= 0.05, "payback formula correct");

// ── I. ROI calculation ───────────────────────────────────────────────
console.log("\nI. ROI CALCULATION");
const roiCheck = run({ n_implementation_cost: 50000 }).outputs;
const expectedRoi = (roiCheck.out_annual_financial_benefit / 50000) * 100;
assert(Math.abs(roiCheck.out_roi_percent - expectedRoi) <= 0.05, "ROI formula correct");

// ── J. All outputs present ───────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_current_setup_time", "out_future_setup_time", "out_time_saved_per_setup",
  "out_annual_setups", "out_annual_hours_recovered", "out_labor_saving",
  "out_machine_capacity_value", "out_annual_financial_benefit",
  "out_implementation_cost", "out_payback_months", "out_roi_percent",
  "out_final_decision_state",
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
  n_current_setup_time_minutes: 1e6,
  n_future_setup_time_minutes: 1,
  n_setups_per_year: 1e6,
  n_machine_hourly_rate: 1e6,
  n_labor_rate_per_hour: 1e6,
  n_implementation_cost: 1e9,
  n_operator_count: 100,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
