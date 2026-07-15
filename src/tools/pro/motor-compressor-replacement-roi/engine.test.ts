// SectorCalc — Motor Compressor Replacement ROI — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, conservation, NaN immunity

import { describe, it, expect } from "vitest";
import { executeFormula, type MotorCompressorOutputs } from
  "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification
// ══════════════════════════════════════════════════════════════════════════════

// S1: Normal replacement scenario
// motorPower=150, hours=8000, currEff=88%, newEff=95%, rate=0.12
// replacement=45000, install=8500, maint_saving=3000, life=10, dr=0.08, conf=0.9
const S1 = {
  motorPowerKw: 150, annualOperatingHours: 8000,
  currentEfficiencyPct: 88, newEfficiencyPct: 95,
  avgKwhRate: 0.12, replacementCost: 45000, installationCost: 8500,
  maintenanceSavingPerYear: 3000, equipmentLifeYears: 10,
  discountRate: 0.08, sourceConfidence: 0.9,
};

const S2 = {
  motorPowerKw: 50, annualOperatingHours: 6000,
  currentEfficiencyPct: 80, newEfficiencyPct: 97,
  avgKwhRate: 0.25, replacementCost: 12000, installationCost: 3000,
  maintenanceSavingPerYear: 5000, equipmentLifeYears: 5,
  discountRate: 0.1, sourceConfidence: 0.95,
};

const S3 = {
  motorPowerKw: 200, annualOperatingHours: 2000,
  currentEfficiencyPct: 92, newEfficiencyPct: 94,
  avgKwhRate: 0.08, replacementCost: 80000, installationCost: 15000,
  maintenanceSavingPerYear: 500, equipmentLifeYears: 15,
  discountRate: 0.12, sourceConfidence: 0.7,
};

describe("Layer 1 \u2014 Closed-form", () => {
  it("S1: evidence completeness = 0.9", () => {
    expect(executeFormula(S1).out_evidenceCompleteness).toBeCloseTo(0.9, 4);
  });
  it("S1: normalized demand = 8000 hours", () => {
    expect(executeFormula(S1).out_normalizedDemand).toBe(8000);
  });
  it("S1: reference deviation = 0.07 (0.88-0.95)", () => {
    expect(executeFormula(S1).out_referenceDeviation).toBeCloseTo(-0.07, 4);
  });
  it("S1: demand metric (current energy cost) > 0", () => {
    expect(executeFormula(S1).out_demandMetric).toBeGreaterThan(0);
  });
  it("S1: capacity metric (new energy cost) > 0", () => {
    expect(executeFormula(S1).out_capacityMetric).toBeGreaterThan(0);
  });
  it("S1: all outputs finite", () => {
    const o = executeFormula(S1);
    for (const key of Object.keys(o) as Array<keyof MotorCompressorOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });

  it("S2: payback < 18 months (fast)", () => {
    const o = executeFormula(S2);
    expect(o.out_scenarioDelta).toBeLessThan(18);
  });
  it("S2: decision state = 0 (proceed)", () => {
    expect(executeFormula(S2).out_finalDecisionState).toBe(0);
  });

  it("S3: payback > 48 months (slow)", () => {
    const o = executeFormula(S3);
    expect(o.out_scenarioDelta).toBeGreaterThan(48);
  });
  it("S3: threshold crossing = 0 (exceeds threshold)", () => {
    expect(executeFormula(S3).out_thresholdCrossing).toBe(0);
  });
  it("S3: fmea trigger = 1 (payback > 24)", () => {
    expect(executeFormula(S3).out_fmeaTrigger).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: no crash, costs are zero", () => {
    const o = executeFormula({
      motorPowerKw: 0, annualOperatingHours: 0,
      currentEfficiencyPct: 0, newEfficiencyPct: 0,
      avgKwhRate: 0, replacementCost: 0, installationCost: 0,
      maintenanceSavingPerYear: 0, equipmentLifeYears: 0,
      discountRate: 0, sourceConfidence: 0,
    });
    expect(o.out_moneyAtRisk).toBe(0);
    expect(o.out_demandMetric).toBe(0);
    expect(o.out_capacityMetric).toBe(0);
  });

  it("zero efficiency: guards against division by zero", () => {
    const o = executeFormula({
      motorPowerKw: 100, annualOperatingHours: 4000,
      currentEfficiencyPct: 0, newEfficiencyPct: 0,
      avgKwhRate: 0.1, replacementCost: 20000, installationCost: 5000,
      maintenanceSavingPerYear: 0, equipmentLifeYears: 5,
      discountRate: 0.08, sourceConfidence: 0.8,
    });
    // 0 efficiency => kwh = 0 (guarded)
    expect(o.out_demandMetric).toBe(0);
    expect(o.out_capacityMetric).toBe(0);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      motorPowerKw: 1e4, annualOperatingHours: 8760,
      currentEfficiencyPct: 99, newEfficiencyPct: 99.5,
      avgKwhRate: 0.5, replacementCost: 1e6, installationCost: 2e5,
      maintenanceSavingPerYear: 1e5, equipmentLifeYears: 20,
      discountRate: 0.15, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof MotorCompressorOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("negative replacement cost still produces finite outputs", () => {
    const o = executeFormula({
      motorPowerKw: 100, annualOperatingHours: 4000,
      currentEfficiencyPct: 88, newEfficiencyPct: 95,
      avgKwhRate: 0.1, replacementCost: -5000, installationCost: 1000,
      maintenanceSavingPerYear: 0, equipmentLifeYears: 5,
      discountRate: 0.08, sourceConfidence: 0.8,
    });
    expect(isFiniteNumber(o.out_moneyAtRisk)).toBe(true);
    expect(isFiniteNumber(o.out_scenarioDelta)).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 \u2014 Semantic insight rules", () => {
  const CUR = "$";

  it("fast_payback fires when payback <= 18 months", () => {
    const o = executeFormula({
      motorPowerKw: 50, annualOperatingHours: 6000,
      currentEfficiencyPct: 80, newEfficiencyPct: 97,
      avgKwhRate: 0.25, replacementCost: 12000, installationCost: 3000,
      maintenanceSavingPerYear: 5000, equipmentLifeYears: 5,
      discountRate: 0.1, sourceConfidence: 0.95,
    });
    const inp = {
      motorPowerKw: 50, annualOperatingHours: 6000,
      currentEfficiencyPct: 80, newEfficiencyPct: 97,
      avgKwhRate: 0.25, replacementCost: 12000, installationCost: 3000,
      maintenanceSavingPerYear: 5000, equipmentLifeYears: 5,
      discountRate: 0.1, sourceConfidence: 0.95,
    };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "fast_payback")).toBe(true);
  });

  it("long_payback fires when payback > 48 months", () => {
    const o = executeFormula(S3);
    const inp = { ...S3 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "long_payback")).toBe(true);
  });

  it("fast_payback does NOT fire for long payback", () => {
    const o = executeFormula(S3);
    const inp = { ...S3 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "fast_payback")).toBe(false);
  });

  it("high_efficiency_gap fires when gap > 8%", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "high_efficiency_gap")).toBe(true);
  });

  it("low_confidence fires when confidence < 0.6", () => {
    const o = executeFormula({ ...S1, sourceConfidence: 0.4 });
    const inp = { ...S1, sourceConfidence: 0.4 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "low_confidence")).toBe(true);
  });

  it("every insight rule exists in INSIGHTS array", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("fast_payback");
    expect(allIds).toContain("moderate_payback");
    expect(allIds).toContain("long_payback");
    expect(allIds).toContain("high_efficiency_gap");
    expect(allIds).toContain("maintenance_upside");
    expect(allIds).toContain("low_confidence");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("conservation: moneyAtRisk = replacementCost + installationCost", () => {
    const o = executeFormula(S1);
    expect(o.out_moneyAtRisk).toBeCloseTo(45000 + 8500, 2);
  });

  it("total investment split matches money at risk", () => {
    const o = executeFormula({
      motorPowerKw: 75, annualOperatingHours: 5000,
      currentEfficiencyPct: 90, newEfficiencyPct: 96,
      avgKwhRate: 0.15, replacementCost: 30000, installationCost: 7000,
      maintenanceSavingPerYear: 2000, equipmentLifeYears: 8,
      discountRate: 0.09, sourceConfidence: 0.85,
    });
    expect(o.out_moneyAtRisk).toBeCloseTo(37000, 2);
  });

  it("zero motor power: all cost metrics are zero", () => {
    const o = executeFormula({
      motorPowerKw: 0, annualOperatingHours: 8000,
      currentEfficiencyPct: 88, newEfficiencyPct: 95,
      avgKwhRate: 0.12, replacementCost: 45000, installationCost: 8500,
      maintenanceSavingPerYear: 0, equipmentLifeYears: 10,
      discountRate: 0.08, sourceConfidence: 0.9,
    });
    expect(o.out_demandMetric).toBe(0);
    expect(o.out_capacityMetric).toBe(0);
  });

  it("all finite for sample inputs", () => {
    const o = executeFormula(S1);
    for (const key of Object.keys(o) as Array<keyof MotorCompressorOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });
});
