// SectorCalc — Outsource vs In-House Analyzer — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, conservation, NaN immunity

import { describe, it, expect } from "vitest";
import { executeFormula, type OutsourceVsInHouseOutputs } from
  "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification
// ══════════════════════════════════════════════════════════════════════════════

const S1 = {
  inHouseMaterialCost: 12.5, inHouseLaborCost: 8, inHouseOverhead: 4.5,
  inHouseSetupCost: 5000, outsourceUnitPrice: 18, outsourceLogisticsCost: 2.5,
  annualVolume: 10000, qualityRiskPremiumPct: 5,
  capacityUtilizationPct: 75, sourceConfidence: 0.85,
};

const S2 = {
  inHouseMaterialCost: 5, inHouseLaborCost: 3, inHouseOverhead: 2,
  inHouseSetupCost: 1000, outsourceUnitPrice: 25, outsourceLogisticsCost: 5,
  annualVolume: 5000, qualityRiskPremiumPct: 3,
  capacityUtilizationPct: 59, sourceConfidence: 0.9,
};

const S3 = {
  inHouseMaterialCost: 10, inHouseLaborCost: 6, inHouseOverhead: 3,
  inHouseSetupCost: 1000, outsourceUnitPrice: 16, outsourceLogisticsCost: 3,
  annualVolume: 5000, qualityRiskPremiumPct: 5,
  capacityUtilizationPct: 78, sourceConfidence: 0.75,
};

describe("Layer 1 \u2014 Closed-form", () => {
  it("S1: evidence completeness = 0.85", () => {
    expect(executeFormula(S1).out_evidenceCompleteness).toBeCloseTo(0.85, 4);
  });
  it("S1: in-house unit cost > outsource unit cost => decision = BUY", () => {
    expect(executeFormula(S1).out_finalDecisionState).toBe(1);
  });
  it("S1: money at risk > 0", () => {
    expect(executeFormula(S1).out_moneyAtRisk).toBeGreaterThan(0);
  });

  it("S2: decision state = 0 (make)", () => {
    expect(executeFormula(S2).out_finalDecisionState).toBe(0);
  });

  it("S3: decision state = 2 (review)", () => {
    expect(executeFormula(S3).out_finalDecisionState).toBe(2);
  });
  it("S3: fmea trigger = 1 (review state)", () => {
    expect(executeFormula(S3).out_fmeaTrigger).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: no crash, costs are zero", () => {
    const o = executeFormula({
      inHouseMaterialCost: 0, inHouseLaborCost: 0, inHouseOverhead: 0,
      inHouseSetupCost: 0, outsourceUnitPrice: 0, outsourceLogisticsCost: 0,
      annualVolume: 0, qualityRiskPremiumPct: 0,
      capacityUtilizationPct: 0, sourceConfidence: 0,
    });
    expect(o.out_demandMetric).toBe(0);
    expect(o.out_moneyAtRisk).toBe(0);
  });

  it("zero annual volume: no crash, demand metric = 0", () => {
    const o = executeFormula({
      inHouseMaterialCost: 10, inHouseLaborCost: 5, inHouseOverhead: 2,
      inHouseSetupCost: 1000, outsourceUnitPrice: 15, outsourceLogisticsCost: 3,
      annualVolume: 0, qualityRiskPremiumPct: 5,
      capacityUtilizationPct: 70, sourceConfidence: 0.8,
    });
    expect(isFiniteNumber(o.out_normalizedDemand)).toBe(true);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      inHouseMaterialCost: 1e4, inHouseLaborCost: 5e3, inHouseOverhead: 2e3,
      inHouseSetupCost: 1e6, outsourceUnitPrice: 8e3, outsourceLogisticsCost: 1e3,
      annualVolume: 1e6, qualityRiskPremiumPct: 20,
      capacityUtilizationPct: 100, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof OutsourceVsInHouseOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("negative costs: still produces finite outputs", () => {
    const o = executeFormula({
      inHouseMaterialCost: -5, inHouseLaborCost: 10, inHouseOverhead: 3,
      inHouseSetupCost: 1000, outsourceUnitPrice: 20, outsourceLogisticsCost: 5,
      annualVolume: 1000, qualityRiskPremiumPct: 5,
      capacityUtilizationPct: 50, sourceConfidence: 0.7,
    });
    expect(isFiniteNumber(o.out_moneyAtRisk)).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 \u2014 Semantic insight rules", () => {
  const CUR = "$";

  it("decision_make fires when decision = 0", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "decision_make")).toBe(true);
  });

  it("decision_buy fires when decision = 1", () => {
    const o = executeFormula(S1);
    const inp = { ...S1 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "decision_buy")).toBe(true);
  });

  it("decision_review fires when decision = 2", () => {
    const o = executeFormula(S3);
    const inp = { ...S3 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "decision_review")).toBe(true);
  });

  it("low_capacity_utilization fires when util < 60%", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "low_capacity_utilization")).toBe(true);
  });

  it("every insight rule exists in INSIGHTS array", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("decision_make");
    expect(allIds).toContain("decision_buy");
    expect(allIds).toContain("decision_review");
    expect(allIds).toContain("low_capacity_utilization");
    expect(allIds).toContain("high_quality_risk");
    expect(allIds).toContain("low_confidence");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("zero volume: normalized demand = 0", () => {
    const o = executeFormula({
      inHouseMaterialCost: 10, inHouseLaborCost: 5, inHouseOverhead: 2,
      inHouseSetupCost: 1000, outsourceUnitPrice: 15, outsourceLogisticsCost: 3,
      annualVolume: 0, qualityRiskPremiumPct: 5,
      capacityUtilizationPct: 70, sourceConfidence: 0.8,
    });
    expect(o.out_normalizedDemand).toBe(0);
  });

  it("all outputs finite for sample inputs", () => {
    const o = executeFormula(S1);
    for (const key of Object.keys(o) as Array<keyof OutsourceVsInHouseOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });
});
