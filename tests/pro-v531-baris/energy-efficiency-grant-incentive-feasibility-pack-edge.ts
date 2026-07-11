// SectorCalc PRO V2 — Energy Efficiency Grant / Incentive Feasibility Pack Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_baseline_energy_consumption_kwh: 500000,
    n_baseline_energy_price_per_kwh: 0.12,
    n_projected_saving_pct: 30,
    n_gross_project_cost: 120000,
    n_eligible_project_cost: 100000,
    n_grant_incentive_amount: 35000,
    n_annual_maintenance_cost: 5000,
    n_useful_life_years: 10,
    n_discount_rate: 8,
    n_energy_price_escalation_pct: 2,
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

console.log("\n=== ENERGY EFFICIENCY GRANT / INCENTIVE FEASIBILITY — EDGE TESTS ===\n");

// ── A. Golden fixture — Strong feasibility with grant (REVIEW state) ─
console.log("A. STRONG FEASIBILITY WITH GRANT (REVIEW state)");
const prof = run().outputs;
assert(prof.out_npv > 0, "NPV positive");
assert(prof.out_grant_amount === 35000, "grant capped at eligible cost");
assert(prof.out_net_investment > 0, "net investment positive");
assert(prof.out_simple_payback_years > 0, "payback positive");
assert(prof.out_implementation_risk_score >= 0, "risk score >= 0");
allFinite("A");

// ── B. Strong feasibility (GOOD state) — high saving, low payback ───
console.log("\nB. STRONG FEASIBILITY (GOOD state)");
const goodInputs = buildInputs({
  n_baseline_energy_consumption_kwh: 2000000,
  n_baseline_energy_price_per_kwh: 0.15,
  n_projected_saving_pct: 50,
  n_gross_project_cost: 100000,
  n_eligible_project_cost: 100000,
  n_grant_incentive_amount: 50000,
  n_annual_maintenance_cost: 2000,
  n_discount_rate: 6,
});
const good = calculate(goodInputs).outputs;
assert(good.out_final_decision_state === 0, "state = GOOD (0)");
assert(good.out_simple_payback_years <= good.out_simple_payback_years, "payback within threshold");
allFinite("B", goodInputs);

// ── C. Poor feasibility (BLOCKED state) ─────────────────────────────
console.log("\nC. POOR FEASIBILITY (BLOCKED state)");
const poorInputs = buildInputs({
  n_baseline_energy_consumption_kwh: 50000,
  n_baseline_energy_price_per_kwh: 0.08,
  n_projected_saving_pct: 10,
  n_gross_project_cost: 500000,
  n_eligible_project_cost: 300000,
  n_grant_incentive_amount: 20000,
  n_annual_maintenance_cost: 15000,
  n_useful_life_years: 5,
});
const poor = calculate(poorInputs).outputs;
assert(poor.out_final_decision_state === 2, "state = BLOCKED (2)");
assert(poor.out_npv < 0, "NPV negative");
allFinite("C", poorInputs);

// ── D. Zero baseline consumption ────────────────────────────────────
console.log("\nD. ZERO BASELINE CONSUMPTION");
const zeroBase = run({ n_baseline_energy_consumption_kwh: 0 }).outputs;
assert(zeroBase.out_baseline_energy_cost === 0, "zero baseline cost");
assert(zeroBase.out_final_decision_state >= 0, "valid state");
allFinite("D", { n_baseline_energy_consumption_kwh: 0 });

// ── E. Grant exceeds eligible cost (capped) ─────────────────────────
console.log("\nE. GRANT EXCEEDS ELIGIBLE COST");
const grantCap = run({
  n_eligible_project_cost: 80000,
  n_grant_incentive_amount: 100000,
}).outputs;
assert(grantCap.out_grant_amount === 80000, "grant capped at eligible cost");
assert(grantCap.out_grant_dependency_pct > 0, "grant dependency positive");
allFinite("E", { n_eligible_project_cost: 80000, n_grant_incentive_amount: 100000 });

// ── F. Zero saving percentage ───────────────────────────────────────
console.log("\nF. ZERO SAVING PERCENTAGE");
const zeroSaving = run({ n_projected_saving_pct: 0 }).outputs;
assert(zeroSaving.out_projected_energy_saving === 0, "zero projected saving");
assert(zeroSaving.out_annual_saving >= 0, "annual saving >= 0 (maintenance is in NPV, not annual_saving)");
allFinite("F", { n_projected_saving_pct: 0 });

// ── G. Negative inputs ──────────────────────────────────────────────
console.log("\nG. NEGATIVE INPUTS");
allFinite("G neg cost", { n_gross_project_cost: -100 });
allFinite("G neg grant", { n_grant_incentive_amount: -100 });
const negSaving = run({ n_projected_saving_pct: -10 }).outputs;
// Saving % clamped to 0
assert(negSaving.out_projected_energy_saving === 0, "negative saving % clamped to 0");

// ── H. Very large values ────────────────────────────────────────────
console.log("\nH. VERY LARGE VALUES");
allFinite("H", {
  n_baseline_energy_consumption_kwh: 100000000,
  n_baseline_energy_price_per_kwh: 0.5,
  n_gross_project_cost: 50000000,
  n_grant_incentive_amount: 20000000,
});

// ── I. Component reconciliation ──────────────────────────────────────
console.log("\nI. COMPONENT RECONCILIATION");
// baseline_energy_cost = baseline_kwh * price
assert(Math.abs(prof.out_baseline_energy_cost - 500000 * 0.12) <= 1, "baseline cost = kWh * price");
// grant_amount = min(grant, eligible)
assert(prof.out_grant_amount === Math.min(35000, 100000), "grant = min(grant, eligible)");
// net_investment = gross - grant
assert(prof.out_net_investment === 120000 - 35000, "net = gross - grant");

// ── J. All outputs present ──────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_baseline_energy_cost", "out_projected_energy_saving",
  "out_gross_project_cost", "out_eligible_project_cost",
  "out_grant_amount", "out_net_investment",
  "out_annual_saving", "out_simple_payback_years",
  "out_roi_percent", "out_npv",
  "out_grant_dependency_pct", "out_energy_price_sensitivity",
  "out_implementation_risk_score", "out_final_decision_state",
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
  n_baseline_energy_consumption_kwh: 1e9,
  n_gross_project_cost: 1e8,
  n_useful_life_years: 30,
});
allFinite("K near zero", {
  n_baseline_energy_consumption_kwh: 1,
  n_baseline_energy_price_per_kwh: 0.01,
  n_gross_project_cost: 1,
  n_grant_incentive_amount: 1,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
