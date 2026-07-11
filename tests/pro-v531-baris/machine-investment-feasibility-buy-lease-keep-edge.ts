// SectorCalc PRO V2 — Machine Investment Feasibility (Buy/Lease/Keep) Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_machine_purchase_price: 500000,
    n_down_payment_pct: 20,
    n_lease_annual_payment: 85000,
    n_lease_term_years: 5,
    n_loan_interest_rate_pct: 8,
    n_loan_term_years: 5,
    n_annual_maintenance_cost: 15000,
    n_annual_downtime_cost: 8000,
    n_residual_value: 120000,
    n_operating_savings_per_year: 180000,
    n_discount_rate: 10,
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

console.log("\n=== MACHINE INVESTMENT FEASIBILITY (BUY/LEASE/KEEP) — EDGE TESTS ===\n");

// ── A. Golden fixture — Lease is best (GOOD state) ──────────────────
console.log("A. LEASE BEST (GOOD state)");
const prof = run().outputs;
assert(prof.out_selected_alternative === 1, "selected = lease (1)");
assert(prof.out_lease_npv > prof.out_buy_npv, "lease NPV > buy NPV");
assert(prof.out_lease_npv > prof.out_keep_npv, "lease NPV > keep NPV");
assert(prof.out_final_decision_state === 0, "state = GOOD (0)");
assert(prof.out_decision_gap > 0, "decision gap positive");
allFinite("A");

// ── B. Buy is best (low purchase price, high savings) ───────────────
console.log("\nB. BUY BEST");
const buyInputs = buildInputs({
  n_machine_purchase_price: 100000,
  n_down_payment_pct: 10,
  n_lease_annual_payment: 35000,
  n_loan_interest_rate_pct: 5,
  n_operating_savings_per_year: 60000,
});
const buy = calculate(buyInputs).outputs;
assert(buy.out_selected_alternative === 0, "selected = buy (0)");
assert(buy.out_buy_npv >= buy.out_lease_npv, "buy NPV >= lease NPV");
allFinite("B", buyInputs);

// ── C. All negative (BLOCKED state) ─────────────────────────────────
console.log("\nC. ALL NEGATIVE (BLOCKED state)");
const allNegInputs = buildInputs({
  n_machine_purchase_price: 2000000,
  n_lease_annual_payment: 500000,
  n_operating_savings_per_year: 0,
  n_residual_value: 1000,
  n_annual_maintenance_cost: 50000,
  n_annual_downtime_cost: 30000,
});
const allNeg = calculate(allNegInputs).outputs;
assert(allNeg.out_buy_npv < 0, "buy NPV negative");
assert(allNeg.out_lease_npv < 0, "lease NPV negative");
assert(allNeg.out_keep_npv < 0, "keep NPV negative");
assert(allNeg.out_final_decision_state >= 2, "state = BLOCKED or all negative");
allFinite("C", allNegInputs);

// ── D. Zero purchase price ──────────────────────────────────────────
console.log("\nD. ZERO PURCHASE PRICE");
const zeroPP = run({ n_machine_purchase_price: 0, n_down_payment_pct: 0 }).outputs;
assert(zeroPP.out_buy_initial_cash === 0, "buy initial cash = 0");
assert(Number.isFinite(zeroPP.out_buy_npv), "buy NPV finite");
allFinite("D", { n_machine_purchase_price: 0, n_down_payment_pct: 0, n_lease_annual_payment: 0 });

// ── E. Zero discount rate ───────────────────────────────────────────
console.log("\nE. ZERO DISCOUNT RATE");
const zeroDR = run({ n_discount_rate: 0 }).outputs;
assert(zeroDR.out_buy_npv > 0, "buy NPV positive @ zero discount");
assert(zeroDR.out_lease_npv > 0, "lease NPV positive @ zero discount");
allFinite("E", { n_discount_rate: 0 });

// ── F. Very high down payment (100%) ────────────────────────────────
console.log("\nF. 100% DOWN PAYMENT");
const highDP = run({ n_down_payment_pct: 100 }).outputs;
assert(highDP.out_buy_initial_cash === 500000, "buy initial = purchase price at 100% DP");
allFinite("F", { n_down_payment_pct: 100 });

// ── G. Negative inputs ──────────────────────────────────────────────
console.log("\nG. NEGATIVE INPUTS");
allFinite("G neg purchase", { n_machine_purchase_price: -100 });
allFinite("G neg savings", { n_operating_savings_per_year: -100 });
const negSavings = run({ n_operating_savings_per_year: -100 }).outputs;
// Savings clamped to 0
assert(Number.isFinite(negSavings.out_buy_npv), "negative savings still finite");

// ── H. Very large values ────────────────────────────────────────────
console.log("\nH. VERY LARGE VALUES");
const big = run({
  n_machine_purchase_price: 50000000,
  n_operating_savings_per_year: 20000000,
  n_residual_value: 10000000,
});
allFinite("H", {
  n_machine_purchase_price: 50000000,
  n_operating_savings_per_year: 20000000,
  n_residual_value: 10000000,
});

// ── I. Component reconciliation ──────────────────────────────────────
console.log("\nI. COMPONENT RECONCILIATION");
// buy_total_lifecycle = initial + 5*(annual_payments + maintenance + downtime) - residual
const buyLifecycle = 100000 + 5 * (100182.58 + 15000 + 8000) - 120000;
assert(Math.abs(prof.out_buy_total_lifecycle - buyLifecycle) <= 0.1, "buy lifecycle reconciled");

// ── J. All outputs present ──────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_buy_initial_cash", "out_buy_annual_payments",
  "out_buy_maintenance", "out_buy_downtime",
  "out_buy_total_lifecycle", "out_buy_npv",
  "out_lease_initial_cash", "out_lease_annual_payments",
  "out_lease_total_lifecycle", "out_lease_npv",
  "out_keep_total_lifecycle", "out_keep_npv",
  "out_selected_alternative", "out_decision_gap",
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
  n_machine_purchase_price: 1e8,
  n_operating_savings_per_year: 5e7,
  n_residual_value: 2e7,
});
allFinite("K near zero", {
  n_machine_purchase_price: 0.01,
  n_operating_savings_per_year: 0.01,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
