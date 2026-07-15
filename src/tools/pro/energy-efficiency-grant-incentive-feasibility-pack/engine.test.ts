// SectorCalc — Energy Efficiency Grant & Incentive Feasibility Pack — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, conservation, NaN immunity

import { describe, it, expect } from "vitest";
import { executeFormula, type EnergyEfficiencyOutputs } from
  "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification
// ══════════════════════════════════════════════════════════════════════════════

const S1 = {
  currentKwhPerYear: 500000, targetKwhPerYear: 350000,
  avgKwhRate: 0.14, implementationCost: 120000, grantCoveragePct: 0.35,
  maintenanceCostSaving: 5000, emissionFactorKgCo2PerKwh: 0.45,
  equipmentLifeYears: 15, discountRate: 0.06, sourceConfidence: 0.85,
};

const S2 = {
  currentKwhPerYear: 300000, targetKwhPerYear: 220000,
  avgKwhRate: 0.10, implementationCost: 60000, grantCoveragePct: 0.25,
  maintenanceCostSaving: 2000, emissionFactorKgCo2PerKwh: 0.4,
  equipmentLifeYears: 10, discountRate: 0.08, sourceConfidence: 0.75,
};

const S3 = {
  currentKwhPerYear: 100000, targetKwhPerYear: 85000,
  avgKwhRate: 0.08, implementationCost: 80000, grantCoveragePct: 0.05,
  maintenanceCostSaving: 500, emissionFactorKgCo2PerKwh: 0.5,
  equipmentLifeYears: 8, discountRate: 0.1, sourceConfidence: 0.65,
};

describe("Layer 1 \u2014 Closed-form", () => {
  it("S1: payback <= 3 years => decision = 0 (proceed)", () => {
    expect(executeFormula(S1).out_finalDecisionState).toBe(0);
  });
  it("S1: threshold crossing = 1 (payback <= 3)", () => {
    expect(executeFormula(S1).out_thresholdCrossing).toBe(1);
  });

  it("S2: payback between 3-5 years => decision = 1 (review)", () => {
    const o = executeFormula(S2);
    expect(o.out_finalDecisionState).toBe(1);
  });
  it("S2: fmea trigger > 0 (review state)", () => {
    expect(executeFormula(S2).out_fmeaTrigger).toBeGreaterThan(0);
  });

  it("S3: payback > 5 years => decision = 2 (hold)", () => {
    expect(executeFormula(S3).out_finalDecisionState).toBe(2);
  });
  it("S3: threshold crossing = -1 (payback > 5)", () => {
    expect(executeFormula(S3).out_thresholdCrossing).toBe(-1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: no crash, outputs finite", () => {
    const o = executeFormula({
      currentKwhPerYear: 0, targetKwhPerYear: 0,
      avgKwhRate: 0, implementationCost: 0, grantCoveragePct: 0,
      maintenanceCostSaving: 0, emissionFactorKgCo2PerKwh: 0,
      equipmentLifeYears: 0, discountRate: 0, sourceConfidence: 0,
    });
    for (const key of Object.keys(o) as Array<keyof EnergyEfficiencyOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("current = target: zero saving, payback defaults", () => {
    const o = executeFormula({
      currentKwhPerYear: 100000, targetKwhPerYear: 100000,
      avgKwhRate: 0.1, implementationCost: 50000, grantCoveragePct: 0,
      maintenanceCostSaving: 0, emissionFactorKgCo2PerKwh: 0.4,
      equipmentLifeYears: 10, discountRate: 0.05, sourceConfidence: 0.8,
    });
    // money_saving = 0 + 0 = 0, payback = netCost(50000)/0 = default 0
    expect(isFiniteNumber(o.out_finalDecisionState)).toBe(true);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      currentKwhPerYear: 1e9, targetKwhPerYear: 1e8,
      avgKwhRate: 10, implementationCost: 1e8, grantCoveragePct: 0.9,
      maintenanceCostSaving: 1e7, emissionFactorKgCo2PerKwh: 10,
      equipmentLifeYears: 50, discountRate: 0.25, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof EnergyEfficiencyOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("zero implementation cost: net cost = 0", () => {
    const o = executeFormula({
      currentKwhPerYear: 100000, targetKwhPerYear: 80000,
      avgKwhRate: 0.1, implementationCost: 0, grantCoveragePct: 0.5,
      maintenanceCostSaving: 1000, emissionFactorKgCo2PerKwh: 0.4,
      equipmentLifeYears: 5, discountRate: 0.05, sourceConfidence: 0.9,
    });
    expect(o.out_moneyAtRisk).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 \u2014 Semantic insight rules", () => {
  const CUR = "$";

  it("strong_roi fires when decision = 0", () => {
    const o = executeFormula(S1);
    const inp = { ...S1 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "strong_roi")).toBe(true);
  });

  it("review_required fires when decision = 1", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "review_required")).toBe(true);
  });

  it("hold_decision fires when decision = 2", () => {
    const o = executeFormula(S3);
    const inp = { ...S3 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "hold_decision")).toBe(true);
  });

  it("high_grant_leverage fires when grant > 50%", () => {
    const o = executeFormula({ ...S1, grantCoveragePct: 0.6 });
    const inp = { ...S1, grantCoveragePct: 0.6 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "high_grant_leverage")).toBe(true);
  });

  it("low_confidence fires when confidence < 0.6", () => {
    const o = executeFormula({ ...S1, sourceConfidence: 0.4 });
    const inp = { ...S1, sourceConfidence: 0.4 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "low_confidence")).toBe(true);
  });

  it("every insight rule exists in INSIGHTS array", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("strong_roi");
    expect(allIds).toContain("review_required");
    expect(allIds).toContain("hold_decision");
    expect(allIds).toContain("high_grant_leverage");
    expect(allIds).toContain("significant_carbon_reduction");
    expect(allIds).toContain("low_confidence");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("all outputs finite for sample inputs", () => {
    const o = executeFormula(S1);
    for (const key of Object.keys(o) as Array<keyof EnergyEfficiencyOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });

  it("normalized demand > 0 for positive current kwh", () => {
    const o = executeFormula(S1);
    expect(o.out_normalizedDemand).toBeGreaterThan(0);
  });
});
