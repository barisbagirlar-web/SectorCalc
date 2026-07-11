// SectorCalc PRO V2 — OEE Loss Monetization & Improvement Business Case Edge Tests
// Tests validation, decision logic, numeric stability, and component reconciliation.

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";

function assert(condition: boolean, label: string) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    process.exit(1);
  }
  console.log(`  PASS: ${label}`);
}

function buildInputs(overrides: Record<string, number> = {}): Record<string, number> {
  return {
    n_planned_production_time_seconds: 28800,
    n_operating_time_seconds: 25200,
    n_net_operating_time_seconds: 23000,
    n_ideal_cycle_time_per_part: 30,
    n_total_parts_produced: 900,
    n_good_parts: 855,
    n_hourly_contribution: 100,
    n_improvement_investment: 50000,
    n_operating_hours_per_year: 2000,
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

console.log("\n=== OEE LOSS MONETIZATION — EDGE TESTS ===\n");

// ── A. Standard OEE calculation (GOOD state — strong ROI) ────────────
console.log("A. STANDARD OEE (GOOD state — strong ROI)");
const good = run().outputs;
assert(good.out_oee_pct > 0, "OEE positive");
assert(good.out_final_decision_state === 0, "state = GOOD (0)");
assert(good.out_improvement_roi > 2, "improvement ROI > 200%");
assert(good.out_availability_pct > 0, "availability % > 0");
assert(good.out_performance_pct > 0, "performance % > 0");
assert(good.out_quality_pct > 0, "quality % > 0");
allFinite("A");

// ── B. Moderate ROI (REVIEW state) ───────────────────────────────────
console.log("\nB. MODERATE ROI (REVIEW state)");
const review = run({
  n_planned_production_time_seconds: 28800,
  n_operating_time_seconds: 25200,
  n_net_operating_time_seconds: 23000,
  n_ideal_cycle_time_per_part: 30,
  n_total_parts_produced: 900,
  n_good_parts: 855,
  n_hourly_contribution: 100,
  n_improvement_investment: 150000,
  n_operating_hours_per_year: 2000,
}).outputs;
assert(review.out_improvement_roi > 0.5, "improvement ROI > 50%");
assert(review.out_improvement_roi <= 2, "improvement ROI <= 200%");
assert(review.out_final_decision_state === 1, "state = REVIEW (1)");
allFinite("B", review);

// ── C. Weak/Negative ROI (BLOCKED state) ─────────────────────────────
console.log("\nC. WEAK ROI (BLOCKED state)");
const blocked = run({
  n_planned_production_time_seconds: 28800,
  n_operating_time_seconds: 27000,
  n_net_operating_time_seconds: 26500,
  n_ideal_cycle_time_per_part: 28,
  n_total_parts_produced: 950,
  n_good_parts: 940,
  n_hourly_contribution: 10,
  n_improvement_investment: 500000,
  n_operating_hours_per_year: 500,
}).outputs;
assert(blocked.out_improvement_roi <= 0.5, "improvement ROI <= 50%");
assert(blocked.out_final_decision_state === 2, "state = BLOCKED (2)");
allFinite("C", blocked);

// ── D. Zero inputs boundary ─────────────────────────────────────────
console.log("\nD. ZERO INPUTS");
const zero = run({
  n_planned_production_time_seconds: 0,
  n_operating_time_seconds: 0,
  n_net_operating_time_seconds: 0,
  n_ideal_cycle_time_per_part: 0,
  n_total_parts_produced: 0,
  n_good_parts: 0,
  n_hourly_contribution: 0,
  n_improvement_investment: 0,
  n_operating_hours_per_year: 0,
}).outputs;
assert(zero.out_oee_pct === 0, "zero inputs → OEE = 0%");
assert(Number.isFinite(zero.out_oee_pct), "zero inputs → OEE finite");
allFinite("D", {
  n_planned_production_time_seconds: 0,
  n_operating_time_seconds: 0,
  n_net_operating_time_seconds: 0,
  n_ideal_cycle_time_per_part: 0,
  n_total_parts_produced: 0,
  n_good_parts: 0,
  n_hourly_contribution: 0,
  n_improvement_investment: 0,
  n_operating_hours_per_year: 0,
});

// ── E. Negative inputs boundary ──────────────────────────────────────
console.log("\nE. NEGATIVE INPUTS");
const neg = run({
  n_planned_production_time_seconds: -100,
  n_operating_time_seconds: -50,
  n_total_parts_produced: -10,
}).outputs;
assert(neg.out_availability_pct === 0, "negative planned time → avail = 0");
assert(neg.out_oee_pct === 0, "negative inputs → OEE = 0");
allFinite("E", { n_planned_production_time_seconds: -100, n_operating_time_seconds: -50, n_total_parts_produced: -10 });

// ── F. Extreme / high values ─────────────────────────────────────────
console.log("\nF. EXTREME VALUES");
const extreme = run({
  n_planned_production_time_seconds: 86400,
  n_operating_time_seconds: 80000,
  n_net_operating_time_seconds: 75000,
  n_ideal_cycle_time_per_part: 1,
  n_total_parts_produced: 75000,
  n_good_parts: 70000,
  n_hourly_contribution: 1000,
  n_improvement_investment: 10000000,
  n_operating_hours_per_year: 8760,
}).outputs;
assert(extreme.out_total_annual_opportunity > 0, "extreme total opportunity positive");
assert(Number.isFinite(extreme.out_total_annual_opportunity), "extreme total opportunity finite");
allFinite("F", extreme);

// ── G. OEE pillar reconciliation ─────────────────────────────────────
console.log("\nG. OEE PILLAR RECONCILIATION");
const recon = run().outputs;
const oeeFromPillars = (recon.out_availability_pct / 100) * (recon.out_performance_pct / 100) * (recon.out_quality_pct / 100) * 100;
assert(Math.abs(oeeFromPillars - recon.out_oee_pct) <= 0.1, "OEE = A × P × Q");

// Loss hours should be non-negative
assert(recon.out_availability_loss_hours >= 0, "availability loss hours >= 0");
assert(recon.out_performance_loss_hours >= 0, "performance loss hours >= 0");
assert(recon.out_quality_loss_hours >= 0, "quality loss hours >= 0");

// ── H. Largest OEE loss driver logic ─────────────────────────────────
console.log("\nH. LARGEST OEE LOSS DRIVER LOGIC");
// Availability-driven: large downtime
const availDriven = run({ n_operating_time_seconds: 5000, n_total_parts_produced: 900, n_good_parts: 855 }).outputs;
assert(availDriven.out_largest_oee_loss_driver === 0, "high avail loss → driver 0");

// Quality-driven: low quality
const qualDriven = run({ n_operating_time_seconds: 25000, n_net_operating_time_seconds: 24000, n_total_parts_produced: 1000, n_good_parts: 100 }).outputs;
assert(qualDriven.out_largest_oee_loss_driver === 2, "high quality loss → driver 2");

// ── I. Perfect OEE scenario ──────────────────────────────────────────
console.log("\nI. PERFECT OEE");
const perfect = run({
  n_planned_production_time_seconds: 28800,
  n_operating_time_seconds: 28800,
  n_net_operating_time_seconds: 28800,
  n_ideal_cycle_time_per_part: 30,
  n_total_parts_produced: 960,
  n_good_parts: 960,
}).outputs;
assert(perfect.out_availability_pct === 100, "perfect → availability 100%");
assert(perfect.out_performance_pct === 100, "perfect → performance 100%");
assert(perfect.out_quality_pct === 100, "perfect → quality 100%");
assert(perfect.out_oee_pct === 100, "perfect → OEE 100%");
assert(perfect.out_lost_productive_hours === 0, "perfect → zero loss hours");

// ── J. All outputs present ───────────────────────────────────────────
console.log("\nJ. ALL EXPECTED OUTPUTS PRESENT");
const expectedKeys = [
  "out_availability_pct", "out_performance_pct", "out_quality_pct",
  "out_oee_pct", "out_availability_loss_hours", "out_performance_loss_hours",
  "out_quality_loss_hours", "out_lost_productive_hours", "out_lost_good_units",
  "out_availability_loss_amount", "out_performance_loss_amount",
  "out_quality_loss_amount", "out_total_annual_opportunity",
  "out_largest_oee_loss_driver", "out_improvement_roi", "out_final_decision_state",
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
  n_planned_production_time_seconds: 1e9,
  n_operating_time_seconds: 9e8,
  n_net_operating_time_seconds: 8e8,
  n_ideal_cycle_time_per_part: 1e-6,
  n_total_parts_produced: 1e9,
  n_good_parts: 9e8,
  n_hourly_contribution: 1e6,
  n_improvement_investment: 1e9,
  n_operating_hours_per_year: 1e5,
});

console.log(`\n=== EDGE TEST RESULTS ===`);
console.log(`All assertions passed.`);
process.exit(0);
