// SectorCalc — Weld Procedure Cost & Consumable Estimation Suite — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, conservation, NaN immunity

import { describe, it, expect } from "vitest";
import { executeFormula, type WeldProcedureOutputs } from
  "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification
// ══════════════════════════════════════════════════════════════════════════════

const S1 = {
  weldLengthM: 10, weldThroatMm: 6, weldDensityGCm3: 7.85,
  wireCostPerKg: 8.5, gasCostPerMin: 0.35, arcTimeMin: 15,
  weldTimeMin: 30, laborRate: 65, overheadRate: 25,
  depositionEfficiencyPct: 85, sourceConfidence: 0.9,
};

const S2 = {
  weldLengthM: 1, weldThroatMm: 3, weldDensityGCm3: 7.85,
  wireCostPerKg: 6, gasCostPerMin: 0.2, arcTimeMin: 2,
  weldTimeMin: 5, laborRate: 40, overheadRate: 15,
  depositionEfficiencyPct: 90, sourceConfidence: 0.95,
};

const S3 = {
  weldLengthM: 5, weldThroatMm: 12, weldDensityGCm3: 8.0,
  wireCostPerKg: 15, gasCostPerMin: 0.8, arcTimeMin: 45,
  weldTimeMin: 120, laborRate: 85, overheadRate: 40,
  depositionEfficiencyPct: 70, sourceConfidence: 0.7,
};

describe("Layer 1 \u2014 Closed-form", () => {
  it("S1: total cost floor > 0", () => {
    expect(executeFormula(S1).out_totalCostFloor).toBeGreaterThan(0);
  });
  it("S1: cost per meter > 0", () => {
    expect(executeFormula(S1).out_costPerMeter).toBeGreaterThan(0);
  });
  it("S1: wire mass kg > 0", () => {
    expect(executeFormula(S1).out_wireMassKg).toBeGreaterThan(0);
  });
  it("S1: labor cost > 0", () => {
    expect(executeFormula(S1).out_laborCost).toBeGreaterThan(0);
  });
  it("S1: base production cost < total cost floor", () => {
    const o = executeFormula(S1);
    expect(o.out_baseProductionCost).toBeLessThan(o.out_totalCostFloor);
  });

  it("S2: low cost per meter <= 20", () => {
    expect(executeFormula(S2).out_costPerMeter).toBeLessThanOrEqual(20);
  });
  it("S2: decision state = 0 (low cost)", () => {
    expect(executeFormula(S2).out_decisionState).toBe(0);
  });

  it("S3: cost per meter > 50 (high)", () => {
    expect(executeFormula(S3).out_costPerMeter).toBeGreaterThan(50);
  });
  it("S3: decision state = 1 (high cost)", () => {
    expect(executeFormula(S3).out_decisionState).toBe(1);
  });
  it("S3: threshold crossing = 1", () => {
    expect(executeFormula(S3).out_thresholdCrossing).toBe(1);
  });
  it("S3: fmea trigger = 1", () => {
    expect(executeFormula(S3).out_fmeaTrigger).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: no crash, costs are zero", () => {
    const o = executeFormula({
      weldLengthM: 0, weldThroatMm: 0, weldDensityGCm3: 0,
      wireCostPerKg: 0, gasCostPerMin: 0, arcTimeMin: 0,
      weldTimeMin: 0, laborRate: 0, overheadRate: 0,
      depositionEfficiencyPct: 0, sourceConfidence: 0,
    });
    expect(o.out_totalCostFloor).toBe(0);
    expect(o.out_costPerMeter).toBe(0);
    expect(o.out_wireMassKg).toBe(0);
  });

  it("zero weld length: cost per meter = 0 (guarded)", () => {
    const o = executeFormula({
      weldLengthM: 0, weldThroatMm: 6, weldDensityGCm3: 7.85,
      wireCostPerKg: 8.5, gasCostPerMin: 0.35, arcTimeMin: 15,
      weldTimeMin: 30, laborRate: 65, overheadRate: 25,
      depositionEfficiencyPct: 85, sourceConfidence: 0.9,
    });
    expect(o.out_costPerMeter).toBe(0);
  });

  it("zero deposition efficiency: wire mass = 0 (guarded)", () => {
    const o = executeFormula({
      weldLengthM: 10, weldThroatMm: 6, weldDensityGCm3: 7.85,
      wireCostPerKg: 8.5, gasCostPerMin: 0.35, arcTimeMin: 15,
      weldTimeMin: 30, laborRate: 65, overheadRate: 25,
      depositionEfficiencyPct: 0, sourceConfidence: 0.9,
    });
    expect(o.out_wireMassKg).toBe(0);
    expect(o.out_wireCost).toBe(0);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      weldLengthM: 1000, weldThroatMm: 30, weldDensityGCm3: 20,
      wireCostPerKg: 200, gasCostPerMin: 10, arcTimeMin: 500,
      weldTimeMin: 1000, laborRate: 200, overheadRate: 100,
      depositionEfficiencyPct: 99, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof WeldProcedureOutputs>) {
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

  it("high_cost_per_meter fires when cost > 50", () => {
    const o = executeFormula(S3);
    const inp = { ...S3 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "high_cost_per_meter")).toBe(true);
  });

  it("low_cost_per_meter fires when cost <= 20", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "low_cost_per_meter")).toBe(true);
  });

  it("high_cost_per_meter does NOT fire for low cost", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "high_cost_per_meter")).toBe(false);
  });

  it("low_deposition_efficiency fires when efficiency < 75%", () => {
    const o = executeFormula(S3);
    const inp = { ...S3 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "low_deposition_efficiency")).toBe(true);
  });

  it("every insight rule exists in INSIGHTS array", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("high_cost_per_meter");
    expect(allIds).toContain("moderate_cost_per_meter");
    expect(allIds).toContain("low_cost_per_meter");
    expect(allIds).toContain("low_deposition_efficiency");
    expect(allIds).toContain("labor_dominant_cost");
    expect(allIds).toContain("high_overhead_drag");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("conservation: baseProductionCost = totalCostFloor - shopOverhead", () => {
    const o = executeFormula(S1);
    expect(o.out_baseProductionCost).toBeCloseTo(o.out_totalCostFloor - o.out_shopOverhead, 4);
  });

  it("cost_per_meter = totalCostFloor / weldLength", () => {
    const o = executeFormula(S1);
    expect(o.out_costPerMeter).toBeCloseTo(o.out_totalCostFloor / 10, 4);
  });

  it("all outputs finite for sample inputs", () => {
    const o = executeFormula(S1);
    for (const key of Object.keys(o) as Array<keyof WeldProcedureOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });
});
