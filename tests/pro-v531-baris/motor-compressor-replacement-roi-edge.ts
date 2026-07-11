// SectorCalc PRO V2 — Motor/Compressor Replacement ROI Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_current_power_kw: 75,
    n_proposed_power_kw: 60,
    n_annual_operating_hours: 6000,
    n_energy_price_per_kwh: 0.12,
    n_current_maintenance_cost: 5000,
    n_proposed_maintenance_cost: 3000,
    n_replacement_cost: 16000,
    n_useful_life_years: 10,
    n_discount_rate: 8,
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

console.log("\n=== MOTOR/COMPRESSOR REPLACEMENT ROI — EDGE TESTS ===\n");

// ── A. Golden fixture — Strong replacement case (GOOD state) ────────
console.log("A. STRONG REPLACEMENT CASE (GOOD state)");
const prof = run().outputs;
assert(prof.out_annual_energy_saving > 0, "energy saving positive");
assert(prof.out_simple_payback_years < 3, "payback < 3 years");
assert(prof.out_npv > 0, "NPV positive");
assert(prof.out_final_decision_state === 0, "state = GOOD (0)");
assert(prof.out_primary_saving_driver === 0, "driver = energy (0)");
allFinite("A");

// ── B. Marginal replacement (REVIEW state) ──────────────────────────
console.log("\nB. MARGINAL REPLACEMENT (REVIEW state)");
const margInputs = buildInputs({
  n_current_power_kw: 100,
  n_proposed_power_kw: 95,
  n_annual_operating_hours: 2000,
  n_energy_price_per_kwh: 0.08,
  n_replacement_cost: 50000,
});
const marg = calculate(margInputs).outputs;
assert(marg.out_simple_payback_years > 3, "payback > 3 years (marginal)");
assert(marg.out_final_decision_state <= 2, "state is valid");
allFinite("B", margInputs);

// ── C. Never pays back (BLOCKED state) ──────────────────────────────
console.log("\nC. NO PAYBACK (BLOCKED state)");
const blockedInputs = buildInputs({
  n_current_power_kw: 100,
  n_proposed_power_kw: 99,
  n_annual_operating_hours: 1000,
  n_energy_price_per_kwh: 0.05,
  n_replacement_cost: 100000,
  n_current_maintenance_cost: 2000,
  n_proposed_maintenance_cost: 1800,
});
const blocked = calculate(blockedInputs).outputs;
assert(blocked.out_annual_financial_saving < blocked.out_replacement_cost / blocked.out_simple_payback_years || blocked.out_npv <= 0, "poor economics");
assert(blocked.out_final_decision_state === 2, "state = BLOCKED (2)");
allFinite("C", blockedInputs);

// ── D. Zero power difference ────────────────────────────────────────
console.log("\nD. ZERO POWER DIFFERENCE");
const zeroDiff = run({ n_current_power_kw: 75, n_proposed_power_kw: 75, n_current_maintenance_cost: 5000, n_proposed_maintenance_cost: 5000 }).outputs;
assert(zeroDiff.out_annual_energy_saving === 0, "zero energy saving");
assert(zeroDiff.out_simple_payback_years === 10, "payback = useful life (10 years)");
allFinite("D", { n_current_power_kw: 75, n_proposed_power_kw: 75 });

// ── E. Zero operating hours + zero maint difference ─────────────────────
console.log("\nE. ZERO SAVINGS (payback = useful life)");
const zeroH = run({
  n_annual_operating_hours: 0,
  n_current_maintenance_cost: 5000,
  n_proposed_maintenance_cost: 5000,
}).outputs;
assert(zeroH.out_baseline_energy_kwh === 0, "zero baseline kWh");
assert(zeroH.out_annual_financial_saving === 0, "zero annual saving");
assert(zeroH.out_simple_payback_years === 10, "payback = useful life (10 years)");
allFinite("E", { n_annual_operating_hours: 0, n_current_maintenance_cost: 5000, n_proposed_maintenance_cost: 5000 });

// ── F. Maintenance saving is primary driver ─────────────────────────
console.log("\nF. MAINTENANCE SAVING DRIVER");
const maintDriver = run({
  n_current_power_kw: 75, n_proposed_power_kw: 74,
  n_annual_operating_hours: 1000,
  n_energy_price_per_kwh: 0.05,
  n_current_maintenance_cost: 20000,
  n_proposed_maintenance_cost: 5000,
}).outputs;
assert(maintDriver.out_primary_saving_driver === 1, "driver = maintenance (1)");
assert(maintDriver.out_maintenance_saving > maintDriver.out_annual_energy_saving, "maintenance saving > energy saving");
allFinite("F", {
  n_current_power_kw: 75, n_proposed_power_kw: 74,
  n_annual_operating_hours: 1000, n_energy_price_per_kwh: 0.05,
  n_current_maintenance_cost: 20000, n_proposed_maintenance_cost: 5000,
});

// ── G. Negative inputs ──────────────────────────────────────────────
console.log("\nG. NEGATIVE INPUTS");
allFinite("G neg power", { n_current_power_kw: -100 });
allFinite("G neg replacement", { n_replacement_cost: -100 });

// ── H. Very large values ────────────────────────────────────────────
console.log("\nH. VERY LARGE VALUES");
allFinite("H", {
  n_current_power_kw: 5000,
  n_proposed_power_kw: 4000,
  n_annual_operating_hours: 8760,
  n_energy_price_per_kwh: 0.5,
  n_replacement_cost: 10000000,
});

// ── I. Component reconciliation ──────────────────────────────────────
console.log("\nI. COMPONENT RECONCILIATION");
// baseline_energy_cost = baseline_energy_kwh * energy_price
assert(Math.abs(prof.out_baseline_energy_cost - prof.out_baseline_energy_kwh * 0.12) <= 1, "baseline cost = kWh * price");
// annual_financial_saving = energy_saving + maintenance_saving
const calcAnnualSaving = prof.out_annual_energy_saving + prof.out_maintenance_saving;
assert(Math.abs(prof.out_annual_financial_saving - calcAnnualSaving) <= 0.01, "annual saving = energy + maintenance");

// ── J. All outputs present ──────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_baseline_energy_kwh", "out_baseline_energy_cost",
  "out_proposed_energy_kwh", "out_proposed_energy_cost",
  "out_annual_energy_saving", "out_maintenance_saving",
  "out_annual_financial_saving", "out_replacement_cost",
  "out_simple_payback_years", "out_roi_percent",
  "out_npv", "out_energy_price_sensitivity",
  "out_primary_saving_driver", "out_final_decision_state",
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
  n_current_power_kw: 10000,
  n_annual_operating_hours: 8760,
  n_energy_price_per_kwh: 1,
  n_replacement_cost: 1e8,
});
allFinite("K near zero", {
  n_current_power_kw: 0.1,
  n_annual_operating_hours: 1,
  n_energy_price_per_kwh: 0.01,
  n_replacement_cost: 0.01,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
