// SectorCalc PRO V2 — Downtime & Scrap Loss Statement Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_downtime_hours: 4,
    n_hourly_contribution_rate: 200,
    n_scrap_quantity: 150,
    n_material_cost_per_unit: 25,
    n_rework_hours: 8,
    n_rework_labor_rate: 55,
    n_disposal_inspection_cost: 500,
    n_annual_event_frequency: 12,
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

console.log("\n=== DOWNTIME & SCRAP LOSS STATEMENT — EDGE TESTS ===\n");

// ── A. Standard event (REVIEW state — annualized $10K–$100K) ────────
console.log("A. STANDARD EVENT (REVIEW state)");
const good = run().outputs;
assert(good.out_total_event_loss > 0, "total event loss positive");
assert(good.out_annualized_loss > 0, "annualized loss positive");
assert(good.out_annualized_loss >= 10000, "annualized loss >= $10K");
assert(good.out_annualized_loss < 100000, "annualized loss < $100K");
assert(good.out_final_decision_state === 1, "state = REVIEW (1)");
assert(good.out_recovery_priority >= 1, "recovery priority medium or high");
allFinite("A");

// ── B. Moderate annual loss (REVIEW state) ───────────────────────────
console.log("\nB. MODERATE ANNUAL LOSS (REVIEW state)");
const review = run({
  n_downtime_hours: 8,
  n_hourly_contribution_rate: 200,
  n_scrap_quantity: 200,
  n_material_cost_per_unit: 20,
  n_rework_hours: 10,
  n_rework_labor_rate: 50,
  n_disposal_inspection_cost: 500,
  n_annual_event_frequency: 6,
}).outputs;
assert(review.out_annualized_loss >= 10000, "annualized loss >= $10K");
assert(review.out_annualized_loss < 100000, "annualized loss < $100K");
assert(review.out_final_decision_state === 1, "state = REVIEW (1)");
allFinite("B", review);

// ── C. Critical annual loss (BLOCKED state) ──────────────────────────
console.log("\nC. CRITICAL LOSS (BLOCKED state)");
const blocked = run({
  n_downtime_hours: 80,
  n_hourly_contribution_rate: 1000,
  n_scrap_quantity: 5000,
  n_material_cost_per_unit: 100,
  n_rework_hours: 200,
  n_rework_labor_rate: 85,
  n_disposal_inspection_cost: 15000,
  n_annual_event_frequency: 12,
}).outputs;
assert(blocked.out_annualized_loss >= 100000, "annualized loss >= $100K");
assert(blocked.out_final_decision_state === 2, "state = BLOCKED (2)");
allFinite("C", blocked);

// ── D. Zero inputs boundary ─────────────────────────────────────────
console.log("\nD. ZERO INPUTS");
const zero = run({
  n_downtime_hours: 0,
  n_hourly_contribution_rate: 0,
  n_scrap_quantity: 0,
  n_material_cost_per_unit: 0,
  n_rework_hours: 0,
  n_rework_labor_rate: 0,
  n_disposal_inspection_cost: 0,
  n_annual_event_frequency: 0,
}).outputs;
assert(zero.out_total_event_loss === 0, "zero inputs → total loss = 0");
assert(zero.out_annualized_loss === 0, "zero inputs → annualized loss = 0");
assert(zero.out_final_decision_state === 0, "zero inputs → GOOD");
allFinite("D", {
  n_downtime_hours: 0,
  n_hourly_contribution_rate: 0,
  n_scrap_quantity: 0,
  n_material_cost_per_unit: 0,
  n_rework_hours: 0,
  n_rework_labor_rate: 0,
  n_disposal_inspection_cost: 0,
  n_annual_event_frequency: 0,
});

// ── E. Negative inputs boundary ──────────────────────────────────────
console.log("\nE. NEGATIVE INPUTS");
const neg = run({
  n_downtime_hours: -4,
  n_hourly_contribution_rate: -200,
  n_scrap_quantity: -150,
  n_material_cost_per_unit: -25,
  n_rework_hours: -8,
  n_rework_labor_rate: -55,
  n_disposal_inspection_cost: -500,
  n_annual_event_frequency: -12,
}).outputs;
assert(neg.out_downtime_hours === 0, "negative downtime clamped to 0");
assert(neg.out_lost_contribution === 0, "negative contribution clamped to 0");
assert(neg.out_final_decision_state >= 0, "negative inputs → valid state");
allFinite("E", { n_downtime_hours: -4, n_hourly_contribution_rate: -200, n_scrap_quantity: -150, n_material_cost_per_unit: -25, n_rework_hours: -8, n_rework_labor_rate: -55, n_disposal_inspection_cost: -500, n_annual_event_frequency: -12 });

// ── F. Extreme / high values ─────────────────────────────────────────
console.log("\nF. EXTREME VALUES");
const extreme = run({
  n_downtime_hours: 1000,
  n_hourly_contribution_rate: 10000,
  n_scrap_quantity: 100000,
  n_material_cost_per_unit: 5000,
  n_rework_hours: 500,
  n_rework_labor_rate: 200,
  n_disposal_inspection_cost: 100000,
  n_annual_event_frequency: 52,
}).outputs;
assert(extreme.out_total_event_loss > 0, "extreme total loss positive");
assert(Number.isFinite(extreme.out_total_event_loss), "extreme total loss finite");
assert(extreme.out_final_decision_state === 2, "extreme → BLOCKED");
allFinite("F", extreme);

// ── G. Component reconciliation ──────────────────────────────────────
console.log("\nG. COMPONENT RECONCILIATION");
const recon = run().outputs;
const sumComponents = recon.out_lost_contribution + recon.out_labor_idle_cost +
  recon.out_scrap_material_cost + recon.out_rework_cost + recon.out_disposal_inspection_cost;
assert(Math.abs(sumComponents - recon.out_total_event_loss) <= 0.05, "component sum = total event loss");
assert(Math.abs(recon.out_total_event_loss * 12 - recon.out_annualized_loss) <= 0.05, "total * freq = annualized loss");

// ── H. Primary loss driver logic ─────────────────────────────────────
console.log("\nH. PRIMARY LOSS DRIVER LOGIC");
// Contribution-driven: high contribution rate
const contribDriven = run({ n_hourly_contribution_rate: 5000, n_scrap_quantity: 10, n_rework_hours: 1 }).outputs;
assert(contribDriven.out_primary_loss_driver === 0, "high contribution → driver 0");

// Scrap-driven: high material cost
const scrapDriven = run({ n_hourly_contribution_rate: 10, n_scrap_quantity: 1000, n_material_cost_per_unit: 1000, n_rework_hours: 1 }).outputs;
assert(scrapDriven.out_primary_loss_driver === 1, "high scrap cost → driver 1");

// Rework-driven: high rework hours
const reworkDriven = run({ n_hourly_contribution_rate: 10, n_scrap_quantity: 1, n_rework_hours: 100, n_rework_labor_rate: 200 }).outputs;
assert(reworkDriven.out_primary_loss_driver === 2, "high rework cost → driver 2");

// ── I. Recovery priority thresholds ──────────────────────────────────
console.log("\nI. RECOVERY PRIORITY THRESHOLDS");
const lowPriority = run({ n_downtime_hours: 0, n_hourly_contribution_rate: 0, n_scrap_quantity: 0, n_rework_hours: 0, n_disposal_inspection_cost: 100 }).outputs;
assert(lowPriority.out_recovery_priority === 0, "loss < $1K → LOW priority");

const medPriority = run({ n_downtime_hours: 4, n_hourly_contribution_rate: 200, n_scrap_quantity: 10, n_material_cost_per_unit: 10, n_rework_hours: 0, n_disposal_inspection_cost: 0 }).outputs;
assert(medPriority.out_recovery_priority === 1, "loss $1K-$10K → MEDIUM priority");

const highPriority = run({ n_downtime_hours: 40, n_hourly_contribution_rate: 1000, n_scrap_quantity: 100, n_material_cost_per_unit: 100, n_rework_hours: 40, n_rework_labor_rate: 100, n_disposal_inspection_cost: 5000 }).outputs;
assert(highPriority.out_recovery_priority === 2, "loss >= $10K → HIGH priority");

// ── J. All outputs present ───────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_downtime_hours", "out_lost_productive_hours", "out_lost_units",
  "out_lost_contribution", "out_labor_idle_cost", "out_scrap_material_cost",
  "out_rework_cost", "out_disposal_inspection_cost", "out_total_event_loss",
  "out_annualized_loss", "out_primary_loss_driver", "out_recovery_priority",
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
  n_downtime_hours: 1e6,
  n_hourly_contribution_rate: 1e6,
  n_scrap_quantity: 1e6,
  n_material_cost_per_unit: 1e6,
  n_rework_hours: 1e6,
  n_rework_labor_rate: 1e6,
  n_disposal_inspection_cost: 1e6,
  n_annual_event_frequency: 1e6,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
