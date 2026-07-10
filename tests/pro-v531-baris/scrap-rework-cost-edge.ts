// SectorCalc — Scrap Rework Cost Tracker Formula Edge Case Tests
// Run: npx tsx tests/pro-v531-baris/scrap-rework-cost-edge.ts

import { calculate } from "../../src/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";

const CORE_INPUTS: Record<string, number> = {
  n_total_produced: 10000,
  n_scrap_quantity: 150,
  n_rework_quantity: 80,
  n_unit_material_cost: 25,
  n_unit_labor_cost: 15,
  n_rework_labor_rate: 45,
  n_rework_time_per_unit: 0.5,
  n_defect_rate_target_pct: 2.0,
  n_monthly_volume: 10000,
};

function allFinite(obj: Record<string, number>): boolean {
  return Object.values(obj).every(v => typeof v === "number" && Number.isFinite(v));
}

let totalTests = 0;
let passedTests = 0;

function test(label: string, fn: () => boolean) {
  totalTests++;
  const result = fn();
  if (result) {
    passedTests++;
    console.log(`  PASS: ${label}`);
  } else {
    console.log(`  FAIL: ${label}`);
    process.exitCode = 1;
  }
}

// ── A. ZERO PRODUCTION ─────────────────────────────────────────────
console.log("A. ZERO PRODUCTION");
test("outputs all finite with zero production", () => {
  const r = calculate({ ...CORE_INPUTS, n_total_produced: 0 });
  return allFinite(r.outputs);
});
test("reference_deviation (scrap rate) = 0 when total produced = 0", () => {
  const r = calculate({ ...CORE_INPUTS, n_total_produced: 0 });
  return r.outputs.out_reference_deviation === 0;
});

// ── B. ZERO SCRAP ──────────────────────────────────────────────────
console.log("B. ZERO SCRAP");
test("demand_metric (scrap cost) = 0 with zero scrap", () => {
  const r = calculate({ ...CORE_INPUTS, n_scrap_quantity: 0 });
  return r.outputs.out_demand_metric === 0;
});
test("money at risk = rework cost only with zero scrap", () => {
  const r = calculate({ ...CORE_INPUTS, n_scrap_quantity: 0 });
  // scrap_cost=0, rework_cost=80*45*0.5=1800, money_at_risk=0+1800=1800
  return r.outputs.out_money_at_risk === 1800;
});

// ── C. ZERO REWORK ─────────────────────────────────────────────────
console.log("C. ZERO REWORK");
test("capacity_metric (rework cost) = 0 with zero rework", () => {
  const r = calculate({ ...CORE_INPUTS, n_rework_quantity: 0 });
  return r.outputs.out_capacity_metric === 0;
});

// ── D. SCRAP RATE ABOVE TARGET ─────────────────────────────────────
console.log("D. SCRAP RATE ABOVE TARGET");
test("decision = BLOCKED (2) when scrap rate above target and cost > 50% material", () => {
  // scrap=500: defect_rate=0.058 > 0.02, cost_per_unit=37.59 > 12.5 → BLOCKED
  const r = calculate({ ...CORE_INPUTS, n_scrap_quantity: 500, n_defect_rate_target_pct: 2.0 });
  return r.outputs.out_final_decision_state === 2;
});
test("threshold_crossing = 1 when defect rate above target", () => {
  const r = calculate({ ...CORE_INPUTS, n_scrap_quantity: 500, n_defect_rate_target_pct: 2.0 });
  return r.outputs.out_threshold_crossing === 1;
});

// ── E. VERY HIGH SCRAP RATE ────────────────────────────────────────
console.log("E. VERY HIGH SCRAP RATE");
test("decision = BLOCKED (2) when scrap rate very high", () => {
  const r = calculate({ ...CORE_INPUTS, n_scrap_quantity: 5000, n_total_produced: 10000, n_defect_rate_target_pct: 2.0 });
  return r.outputs.out_final_decision_state === 2;
});

// ── F. HIGH REWORK DOMINATES ───────────────────────────────────────
console.log("F. HIGH REWORK DOMINATES");
test("primary driver = rework (1) when rework cost dominates", () => {
  // rework_cost = 1000*200*5 = 1000000, scrap_cost = 6000 → rework dominates
  const r = calculate({ ...CORE_INPUTS, n_rework_quantity: 1000, n_rework_time_per_unit: 5, n_rework_labor_rate: 200 });
  return r.outputs.out_sensitivity_driver === 1;
});

// ── G. MONTHLY QUALITY LOSS SCALES ─────────────────────────────────
console.log("G. MONTHLY QUALITY LOSS");
test("expanded_uncertainty (monthly quality loss) > 0 with positive volume ratio", () => {
  // monthly_quality_loss = (6000+1800) * (5000/10000) = 7800*0.5 = 3900
  const r = calculate({ ...CORE_INPUTS, n_monthly_volume: 5000 });
  return r.outputs.out_expanded_uncertainty === 3900 && allFinite(r.outputs);
});

// ── H. MISSING REQUIRED INPUTS ─────────────────────────────────────
console.log("H. MISSING REQUIRED INPUTS");
test("provides warnings for missing inputs", () => {
  const r = calculate({});
  return r.warnings.length > 0;
});

// ── SUMMARY ─────────────────────────────────────────────────────────
console.log("");
console.log(`Tests: ${totalTests}, Passed: ${passedTests}, Failed: ${totalTests - passedTests}`);
if (passedTests === totalTests) {
  console.log("ALL EDGE TESTS PASS");
} else {
  console.log("SOME EDGE TESTS FAILED");
  process.exit(1);
}
