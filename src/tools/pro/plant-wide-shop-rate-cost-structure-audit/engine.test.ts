// SectorCalc — Plant-Wide Shop Rate Cost Structure Audit — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, conservation, NaN immunity

import { describe, it, expect } from "vitest";
import { executeFormula, type PlantWideShopRateOutputs } from
  "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification
// ══════════════════════════════════════════════════════════════════════════════

const S1 = {
  totalAnnualCost: 1200000, totalProductiveHours: 32000,
  machineGroupCost: 450000, machineGroupHours: 12000,
  overheadPool: 380000, overheadAllocationBase: 32000,
  currentShopRate: 65, targetMarginPct: 15, utilizationPct: 78,
  sourceConfidence: 0.85,
};

const S2 = {
  totalAnnualCost: 2000000, totalProductiveHours: 25000,
  machineGroupCost: 800000, machineGroupHours: 10000,
  overheadPool: 500000, overheadAllocationBase: 25000,
  currentShopRate: 55, targetMarginPct: 20, utilizationPct: 70,
  sourceConfidence: 0.8,
};

const S3 = {
  totalAnnualCost: 1000000, totalProductiveHours: 20000,
  machineGroupCost: 400000, machineGroupHours: 8000,
  overheadPool: 250000, overheadAllocationBase: 20000,
  currentShopRate: 0, targetMarginPct: 10, utilizationPct: 75,
  sourceConfidence: 0.7,
};

describe("Layer 1 \u2014 Closed-form", () => {
  it("S1: plant-wide rate = 37.5", () => {
    expect(executeFormula(S1).out_demandMetric).toBeCloseTo(37.5, 4);
  });
  it("S1: decision state = 0 (OK - rate above floor)", () => {
    expect(executeFormula(S1).out_finalDecisionState).toBe(0);
  });

  it("S2: decision state = 1 (reprice)", () => {
    expect(executeFormula(S2).out_finalDecisionState).toBe(1);
  });

  it("S3: decision state = 2 (review)", () => {
    expect(executeFormula(S3).out_finalDecisionState).toBe(2);
  });
  it("S3: fmea trigger = 1", () => {
    expect(executeFormula(S3).out_fmeaTrigger).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: no crash, rates are zero", () => {
    const o = executeFormula({
      totalAnnualCost: 0, totalProductiveHours: 0,
      machineGroupCost: 0, machineGroupHours: 0,
      overheadPool: 0, overheadAllocationBase: 0,
      currentShopRate: 0, targetMarginPct: 0, utilizationPct: 0,
      sourceConfidence: 0,
    });
    expect(o.out_demandMetric).toBe(0);
    expect(o.out_capacityMetric).toBe(0);
    expect(o.out_moneyAtRisk).toBe(0);
  });

  it("zero productive hours: guarded with fallback", () => {
    const o = executeFormula({
      totalAnnualCost: 100000, totalProductiveHours: 0,
      machineGroupCost: 50000, machineGroupHours: 5000,
      overheadPool: 30000, overheadAllocationBase: 10000,
      currentShopRate: 50, targetMarginPct: 10, utilizationPct: 80,
      sourceConfidence: 0.8,
    });
    expect(isFiniteNumber(o.out_demandMetric)).toBe(true);
    expect(isFiniteNumber(o.out_capacityMetric)).toBe(true);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      totalAnnualCost: 1e9, totalProductiveHours: 1e6,
      machineGroupCost: 5e8, machineGroupHours: 5e5,
      overheadPool: 3e8, overheadAllocationBase: 1e6,
      currentShopRate: 5000, targetMarginPct: 50, utilizationPct: 100,
      sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof PlantWideShopRateOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 \u2014 Semantic insight rules", () => {
  const CUR = "$";

  it("rate_above_pricing_floor fires when decision = 0", () => {
    const o = executeFormula(S1);
    const inp = { ...S1 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "rate_above_pricing_floor")).toBe(true);
  });

  it("rate_below_pricing_floor fires when decision != 0", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "rate_below_pricing_floor")).toBe(true);
  });

  it("high_under_recovery fires when moneyAtRisk > 50000", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "high_under_recovery")).toBe(true);
  });

  it("every insight rule exists in INSIGHTS array", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("rate_below_pricing_floor");
    expect(allIds).toContain("rate_above_pricing_floor");
    expect(allIds).toContain("high_under_recovery");
    expect(allIds).toContain("low_utilization");
    expect(allIds).toContain("overhead_absorption_gap");
    expect(allIds).toContain("low_confidence");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("plantWideRate = totalAnnualCost / totalProductiveHours", () => {
    const o = executeFormula(S1);
    expect(o.out_demandMetric).toBeCloseTo(1200000 / 32000, 4);
  });

  it("money at risk is non-negative", () => {
    const o = executeFormula({
      totalAnnualCost: 100000, totalProductiveHours: 5000,
      machineGroupCost: 40000, machineGroupHours: 2000,
      overheadPool: 25000, overheadAllocationBase: 5000,
      currentShopRate: 30, targetMarginPct: 10, utilizationPct: 50,
      sourceConfidence: 0.8,
    });
    expect(o.out_moneyAtRisk).toBeGreaterThanOrEqual(0);
  });

  it("all outputs finite for sample inputs", () => {
    const o = executeFormula(S1);
    for (const key of Object.keys(o) as Array<keyof PlantWideShopRateOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });
});
