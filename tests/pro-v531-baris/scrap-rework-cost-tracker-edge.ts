// SectorCalc PRO V2 — Scrap & Rework Cost Tracker Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_total_produced: 10000,
    n_scrap_quantity: 150,
    n_rework_quantity: 80,
    n_unit_material_cost: 25,
    n_unit_labor_cost: 15,
    n_rework_labor_rate: 45,
    n_rework_time_per_unit: 0.5,
    n_defect_rate_target_pct: 2.0,
    n_monthly_volume: 10000,
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

console.log("\n=== SCRAP & REWORK COST TRACKER — EDGE TESTS ===\n");

// ── A. Standard production run (GOOD state — within target) ──────────
console.log("A. STANDARD PRODUCTION (GOOD state)");
const good = run().outputs;
assert(good.out_scrap_rate_pct === 1.5, "scrap rate = 1.5% (within 2% target)");
assert(good.out_final_decision_state === 0, "state = GOOD (0)");
assert(good.out_total_loss > 0, "total loss positive");
allFinite("A");

// ── B. Above target defect rate (REVIEW state) ───────────────────────
console.log("\nB. ABOVE TARGET (REVIEW state)");
const review = run({
  n_total_produced: 10000,
  n_scrap_quantity: 300,
  n_rework_quantity: 100,
  n_defect_rate_target_pct: 2.0,
}).outputs;
assert(review.out_scrap_rate_pct === 3.0, "scrap rate = 3.0%");
assert(review.out_scrap_rate_pct > 2.0, "scrap rate above target");
assert(review.out_scrap_rate_pct <= 4.0, "scrap rate within 2x target");
assert(review.out_final_decision_state === 1, "state = REVIEW (1)");
allFinite("B", review);

// ── C. Critical scrap rate (BLOCKED state) ───────────────────────────
console.log("\nC. CRITICAL SCRAP RATE (BLOCKED state)");
const blocked = run({
  n_total_produced: 5000,
  n_scrap_quantity: 2500,
  n_rework_quantity: 500,
  n_defect_rate_target_pct: 2.0,
}).outputs;
assert(blocked.out_scrap_rate_pct === 50, "scrap rate = 50%");
assert(blocked.out_scrap_rate_pct > 4.0, "scrap rate far above 2x target");
assert(blocked.out_final_decision_state === 2, "state = BLOCKED (2)");
allFinite("C", blocked);

// ── D. Zero inputs boundary ─────────────────────────────────────────
console.log("\nD. ZERO INPUTS");
const zero = run({
  n_total_produced: 0,
  n_scrap_quantity: 0,
  n_rework_quantity: 0,
  n_unit_material_cost: 0,
  n_unit_labor_cost: 0,
  n_rework_labor_rate: 0,
  n_rework_time_per_unit: 0,
  n_defect_rate_target_pct: 0,
  n_monthly_volume: 0,
}).outputs;
assert(zero.out_scrap_rate_pct === 0, "zero inputs → scrap rate = 0%");
assert(zero.out_total_loss === 0, "zero inputs → total loss = 0");
assert(zero.out_final_decision_state === 0, "zero inputs → GOOD (0 = within 0% target)");
allFinite("D", {
  n_total_produced: 0,
  n_scrap_quantity: 0,
  n_rework_quantity: 0,
  n_unit_material_cost: 0,
  n_unit_labor_cost: 0,
  n_rework_labor_rate: 0,
  n_rework_time_per_unit: 0,
  n_defect_rate_target_pct: 0,
  n_monthly_volume: 0,
});

// ── E. Negative inputs boundary ──────────────────────────────────────
console.log("\nE. NEGATIVE INPUTS");
const neg = run({
  n_total_produced: -100,
  n_scrap_quantity: -50,
  n_rework_quantity: 0,
  n_unit_material_cost: -25,
}).outputs;
assert(neg.out_scrap_rate_pct === 0, "negative → scrap rate = 0%");
assert(neg.out_material_loss === 0, "negative → material loss = 0");
assert(neg.out_labor_loss === 0, "negative → labor loss = 0");
allFinite("E", { n_total_produced: -100, n_scrap_quantity: -50, n_unit_material_cost: -25 });

// ── F. Extreme / high values ─────────────────────────────────────────
console.log("\nF. EXTREME VALUES");
const extreme = run({
  n_total_produced: 1000000,
  n_scrap_quantity: 200000,
  n_rework_quantity: 100000,
  n_unit_material_cost: 5000,
  n_unit_labor_cost: 2000,
  n_rework_labor_rate: 150,
  n_rework_time_per_unit: 2,
  n_defect_rate_target_pct: 1.0,
  n_monthly_volume: 1000000,
}).outputs;
assert(extreme.out_total_loss > 0, "extreme total loss positive");
assert(Number.isFinite(extreme.out_total_loss), "extreme total loss finite");
assert(extreme.out_final_decision_state === 2, "extreme → BLOCKED");
allFinite("F", extreme);

// ── G. Component reconciliation ──────────────────────────────────────
console.log("\nG. COMPONENT RECONCILIATION");
const recon = run().outputs;
// Total loss = material + machine + labor + rework + inspection + disposal + replacement
const sumComponents = recon.out_material_loss + recon.out_machine_loss +
  recon.out_labor_loss + recon.out_rework_cost + recon.out_inspection_cost +
  recon.out_disposal_cost + recon.out_replacement_production_cost;
assert(Math.abs(sumComponents - recon.out_total_loss) <= 0.05, "component sum = total loss");

// Cost per rejected unit = total_loss / (scrap + rework)
const totalDefectUnits = recon.out_scrap_quantity + 80; // rework_quantity = 80
const expectedCostPerUnit = recon.out_total_loss / totalDefectUnits;
assert(Math.abs(expectedCostPerUnit - recon.out_cost_per_rejected_unit) <= 0.05, "cost per rejected unit correct");

// ── H. Primary defect cost driver logic ──────────────────────────────
console.log("\nH. PRIMARY DEFECT COST DRIVER LOGIC");
// Material-driven: high material cost
const materialDriven = run({ n_unit_material_cost: 1000, n_unit_labor_cost: 1, n_rework_quantity: 0 }).outputs;
assert(materialDriven.out_primary_defect_cost_driver === 0, "high material cost → driver 0");

// Machine-driven: high machine loss (labor cost * 0.5) with labor loss zeroed
// Note: labor_loss is always 2x machine_loss, so machine can never dominate
// unless labor is absent. Test that rework can dominate.
const reworkOnlyDriven = run({ n_scrap_quantity: 0, n_rework_quantity: 100, n_rework_time_per_unit: 10, n_rework_labor_rate: 200 }).outputs;
assert(reworkOnlyDriven.out_primary_defect_cost_driver === 3, "high rework cost → driver 3");

// Rework-driven: high rework cost
const reworkDriven = run({ n_rework_quantity: 1000, n_rework_time_per_unit: 10, n_rework_labor_rate: 200, n_scrap_quantity: 1 }).outputs;
assert(reworkDriven.out_primary_defect_cost_driver === 3, "high rework cost → driver 3");

// ── I. Scrap rate calculation ────────────────────────────────────────
console.log("\nI. SCRAP RATE CALCULATION");
const pctCheck = run({ n_total_produced: 1000, n_scrap_quantity: 50 }).outputs;
assert(pctCheck.out_scrap_rate_pct === 5, "50/1000 = 5% scrap rate");

// ── J. All outputs present ───────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_scrap_quantity", "out_scrap_rate_pct",
  "out_material_loss", "out_machine_loss", "out_labor_loss",
  "out_rework_cost", "out_inspection_cost", "out_disposal_cost",
  "out_replacement_production_cost",
  "out_total_loss", "out_annualized_loss", "out_cost_per_rejected_unit",
  "out_primary_defect_cost_driver", "out_final_decision_state",
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
  n_total_produced: 1e9,
  n_scrap_quantity: 5e8,
  n_rework_quantity: 2e8,
  n_unit_material_cost: 1e6,
  n_unit_labor_cost: 5e5,
  n_rework_labor_rate: 1e4,
  n_rework_time_per_unit: 100,
  n_defect_rate_target_pct: 0.01,
  n_monthly_volume: 1e9,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
