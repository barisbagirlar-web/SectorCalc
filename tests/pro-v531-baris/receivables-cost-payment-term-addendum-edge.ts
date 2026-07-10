// SectorCalc PRO V2 — Receivables Cost Payment Term Addendum Edge Case Tests
// Tests validation, decision logic, and numeric stability.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_invoice_value: 100000,
    n_payment_days: 30,
    n_early_payment_discount_pct: 2,
    n_early_payment_days: 10,
    n_cost_of_capital_pct: 6,
    n_admin_collection_cost: 500,
    n_default_risk_allowance: 200,
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

console.log("\n=== RECEIVABLES COST PAYMENT TERM ADDENDUM EDGE TESTS ===\n");

// ── A. GOOD case — Low term cost (< 2%) ──────────────────────────
console.log("\nA. GOOD CASE (Low Term Cost < 2%)");
const goodResult = run();
const good = goodResult.outputs;
assert(good.out_final_decision_state === 0, "state = GOOD (0)");
check("financingCost", "out_financing_cost", 493.15, 0.01);
check("effectiveTermCost", "out_effective_term_cost", 1193.15, 0.01);
check("effectiveTermCostPct", "out_effective_term_cost_pct", 1.19, 0.01);
check("requiredAddendumPct", "out_required_addendum_pct", 1.19, 0.01);
check("breakevenTerm", "out_breakeven_payment_term_days", 122, 1);
allFinite("A");

// ── B. REVIEW case — Moderate term cost (2–5%) ───────────────────
console.log("\nB. REVIEW CASE (Moderate Term Cost 2-5%)");
const reviewInputs = {
  n_invoice_value: 50000,
  n_payment_days: 60,
  n_early_payment_discount_pct: 1.5,
  n_early_payment_days: 15,
  n_cost_of_capital_pct: 8,
  n_admin_collection_cost: 1000,
  n_default_risk_allowance: 500,
};
const reviewResult = run(reviewInputs);
const review = reviewResult.outputs;
assert(review.out_final_decision_state === 1, "state = REVIEW (1)");
assert(review.out_effective_term_cost_pct > 2, "term cost pct > 2%");
assert(review.out_effective_term_cost_pct <= 5, "term cost pct <= 5%");
allFinite("B", reviewInputs);

// ── C. BLOCKED case — High term cost (> 5%) ──────────────────────
console.log("\nC. BLOCKED CASE (High Term Cost > 5%)");
const blockedInputs = {
  n_invoice_value: 25000,
  n_payment_days: 90,
  n_early_payment_discount_pct: 1,
  n_early_payment_days: 20,
  n_cost_of_capital_pct: 12,
  n_admin_collection_cost: 1500,
  n_default_risk_allowance: 800,
};
const blockedResult = run(blockedInputs);
const blocked = blockedResult.outputs;
assert(blocked.out_final_decision_state === 2, "state = BLOCKED (2)");
assert(blocked.out_effective_term_cost_pct > 5, "term cost pct > 5%");
allFinite("C", blockedInputs);

// ── D. ZERO INVOICE VALUE ─────────────────────────────────────────
console.log("\nD. ZERO INVOICE VALUE");
assert(run({ n_invoice_value: 0 }).outputs.out_final_decision_state === 2, "invoice=0 → BLOCKED");
allFinite("D invoice=0", { n_invoice_value: 0 });

// ── E. ZERO PAYMENT DAYS ──────────────────────────────────────────
console.log("\nE. ZERO PAYMENT DAYS");
assert(run({ n_payment_days: 0 }).outputs.out_final_decision_state === 2, "payment_days=0 → BLOCKED");
allFinite("E payment_days=0", { n_payment_days: 0 });

// ── F. ZERO COST OF CAPITAL ───────────────────────────────────────
console.log("\nF. ZERO COST OF CAPITAL");
const zeroCoc = run({ n_cost_of_capital_pct: 0, n_admin_collection_cost: 0, n_default_risk_allowance: 0 });
assert(zeroCoc.outputs.out_financing_cost === 0, "financing cost = 0");
assert(zeroCoc.outputs.out_breakeven_payment_term_days === 0, "breakeven = 0 (no division by zero)");
allFinite("F", { n_cost_of_capital_pct: 0, n_admin_collection_cost: 0, n_default_risk_allowance: 0 });

// ── G. EFFECTIVE COST AT 2% BOUNDARY ───────────────────────────────
console.log("\nG. EFFECTIVE COST AT 2% BOUNDARY (should still be GOOD)");
// Target: effectiveTermCostPct ≈ 2% (just below boundary)
// financingCost => invoice * cost_of_capital% * days/365
// We want (financing + admin + default) / invoice * 100 ≈ 2%
// With admin=0, default=0: cost_of_capital% * days/365 ≈ 2%
// cost=7.3, days=100: 7.3 * 100/365 = 2.0%
const boundaryInputs = { n_invoice_value: 100000, n_payment_days: 100, n_early_payment_discount_pct: 2, n_early_payment_days: 10, n_cost_of_capital_pct: 7.3, n_admin_collection_cost: 0, n_default_risk_allowance: 0 };
assert(run(boundaryInputs).outputs.out_final_decision_state === 0, "~2% boundary → GOOD (0)");
allFinite("G", boundaryInputs);

// ── H. EFFECTIVE COST JUST ABOVE 5% ────────────────────────────────
console.log("\nH. EFFECTIVE COST JUST ABOVE 5%");
// Need financing/admin/default to push effectiveTermCostPct > 5%
const highInputs = { n_invoice_value: 50000, n_payment_days: 120, n_cost_of_capital_pct: 15, n_admin_collection_cost: 500, n_default_risk_allowance: 200 };
const highResult = run(highInputs);
// financingCost = 50000 * 0.15 * 120/365 = 50000 * 0.15 * 0.3288 = 2465.75
// effectiveTermCost = 2465.75 + 500 + 200 = 3165.75
// effectiveTermCostPct = 3165.75/50000*100 = 6.33
assert(highResult.outputs.out_effective_term_cost_pct > 5, "term cost > 5%");
assert(highResult.outputs.out_final_decision_state === 2, ">5% → BLOCKED (2)");
allFinite("H", highInputs);

// ── I. NO NAN / INFINITY ──────────────────────────────────────────
console.log("\nI. NO NAN / INFINITY");
allFinite("I base");
allFinite("I extreme high", {
  n_invoice_value: 999999999,
  n_payment_days: 365,
  n_cost_of_capital_pct: 100,
  n_admin_collection_cost: 999999,
  n_default_risk_allowance: 999999,
});
allFinite("I extreme low", {
  n_invoice_value: 0.01,
  n_payment_days: 1,
  n_cost_of_capital_pct: 0.01,
  n_admin_collection_cost: 0,
  n_default_risk_allowance: 0,
});

// ── J. COMPONENT RECONCILIATION ─────────────────────────────────────
console.log("\nJ. COMPONENT RECONCILIATION");
const compSum = good.out_financing_cost + good.out_admin_collection_cost + good.out_default_risk_allowance;
const diff = Math.abs(compSum - good.out_effective_term_cost);
assert(diff <= 0.05, `component sum matches effective term cost (diff=${diff.toFixed(4)})`);

// ── K. REVISED INVOICE RECONCILIATION ──────────────────────────────
console.log("\nK. REVISED INVOICE RECONCILIATION");
const expectedRevised = good.out_invoice_value + good.out_required_addendum_amount;
const revDiff = Math.abs(expectedRevised - good.out_revised_invoice_amount);
assert(revDiff <= 0.05, `revised invoice = invoice + addendum (diff=${revDiff.toFixed(4)})`);

// ── L. NEGATIVE INPUTS → BLOCKED ───────────────────────────────────
console.log("\nL. NEGATIVE INPUTS");
assert(run({ n_invoice_value: -100 }).outputs.out_final_decision_state === 2, "neg invoice → BLOCKED");
assert(run({ n_payment_days: -10 }).outputs.out_final_decision_state === 2, "neg payment_days → BLOCKED");
assert(run({ n_cost_of_capital_pct: -5 }).outputs.out_final_decision_state >= 0, "neg cost_of_capital produces valid state");
allFinite("L neg inputs", { n_invoice_value: -100, n_payment_days: -10 });

// ── M. BREAKEVEN VS ACTUAL TERM ────────────────────────────────────
console.log("\nM. BREAKEVEN VS ACTUAL TERM");
// With discount=2%, cost_of_capital=6%: breakeven = (2/6)*365 = 122 days
// When payment_days > breakeven, the early discount becomes more attractive
const beCheck = run({ n_early_payment_discount_pct: 2, n_cost_of_capital_pct: 6, n_payment_days: 30 });
assert(beCheck.outputs.out_breakeven_payment_term_days >= 120, "breakeven >= 120 days");
assert(beCheck.outputs.out_breakeven_payment_term_days <= 125, "breakeven <= 125 days");
allFinite("M", {});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
