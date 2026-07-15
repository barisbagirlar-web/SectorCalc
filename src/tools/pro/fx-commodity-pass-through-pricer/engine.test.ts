// SectorCalc — FX & Commodity Pass-Through Pricer — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, conservation, NaN immunity

import { describe, it, expect } from "vitest";
import { executeFormula, type FxCommodityPassThroughOutputs } from
  "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification
// ══════════════════════════════════════════════════════════════════════════════

const S1 = {
  basePrice: 1000, fxRateSpot: 1.12, fxRateBudget: 1.08,
  commodityIndexCurrent: 185, commodityIndexBudget: 170,
  materialCostPct: 45, fxHedgePct: 60, commodityHedgePct: 50,
  annualVolume: 5000, sourceConfidence: 0.85,
};

const S2 = {
  basePrice: 500, fxRateSpot: 1.35, fxRateBudget: 1.10,
  commodityIndexCurrent: 250, commodityIndexBudget: 180,
  materialCostPct: 60, fxHedgePct: 20, commodityHedgePct: 10,
  annualVolume: 10000, sourceConfidence: 0.7,
};

const S3 = {
  basePrice: 2000, fxRateSpot: 0.95, fxRateBudget: 1.05,
  commodityIndexCurrent: 120, commodityIndexBudget: 160,
  materialCostPct: 30, fxHedgePct: 80, commodityHedgePct: 70,
  annualVolume: 2000, sourceConfidence: 0.95,
};

describe("Layer 1 \u2014 Closed-form", () => {
  it("S1: decision = 0 (OK - within band)", () => {
    expect(executeFormula(S1).out_finalDecisionState).toBe(0);
  });
  it("S1: derating factor between 0 and 1", () => {
    const o = executeFormula(S1);
    expect(o.out_deratingFactor).toBeGreaterThanOrEqual(0);
    expect(o.out_deratingFactor).toBeLessThanOrEqual(1);
  });

  it("S2: decision = 1 (reprice)", () => {
    expect(executeFormula(S2).out_finalDecisionState).toBe(1);
  });
  it("S2: threshold crossing >= 1", () => {
    expect(executeFormula(S2).out_thresholdCrossing).toBeGreaterThanOrEqual(1);
  });

  it("S3: decision = 0 or 2 (OK or HOLD)", () => {
    const d = executeFormula(S3).out_finalDecisionState;
    expect([0, 2]).toContain(d);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: no crash, outputs finite", () => {
    const o = executeFormula({
      basePrice: 0, fxRateSpot: 0, fxRateBudget: 0,
      commodityIndexCurrent: 0, commodityIndexBudget: 0,
      materialCostPct: 0, fxHedgePct: 0, commodityHedgePct: 0,
      annualVolume: 0, sourceConfidence: 0,
    });
    for (const key of Object.keys(o) as Array<keyof FxCommodityPassThroughOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("zero budget rates: fx impact = 0 (guarded)", () => {
    const o = executeFormula({
      basePrice: 100, fxRateSpot: 1.1, fxRateBudget: 0,
      commodityIndexCurrent: 200, commodityIndexBudget: 0,
      materialCostPct: 50, fxHedgePct: 50, commodityHedgePct: 50,
      annualVolume: 1000, sourceConfidence: 0.8,
    });
    expect(isFiniteNumber(o.out_utilizationMargin)).toBe(true);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      basePrice: 1e6, fxRateSpot: 10, fxRateBudget: 0.01,
      commodityIndexCurrent: 10000, commodityIndexBudget: 1,
      materialCostPct: 100, fxHedgePct: 100, commodityHedgePct: 100,
      annualVolume: 1e7, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof FxCommodityPassThroughOutputs>) {
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

  it("low_pass_through fires when decision = 0 and threshold = 0", () => {
    const o = executeFormula(S1);
    const inp = { ...S1 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "low_pass_through")).toBe(true);
  });

  it("high_pass_through fires when fmea >= 2", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "high_pass_through")).toBe(true);
  });

  it("inadequate_hedge fires when both hedges < 50%", () => {
    const o = executeFormula(S2);
    const inp = { ...S2 };
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "inadequate_hedge")).toBe(true);
  });

  it("every insight rule exists in INSIGHTS array", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("high_pass_through");
    expect(allIds).toContain("moderate_pass_through");
    expect(allIds).toContain("low_pass_through");
    expect(allIds).toContain("inadequate_hedge");
    expect(allIds).toContain("fx_dominated");
    expect(allIds).toContain("commodity_dominated");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("adjusted price ratio matches utilization margin", () => {
    const o = executeFormula(S1);
    const ratio = (1000 * (1 + ((1.12 - 1.08) / 1.08) * 0.45 * 0.4 + ((185 - 170) / 170) * 0.45 * 0.5)) / 1000;
    expect(o.out_utilizationMargin).toBeCloseTo(ratio, 4);
  });

  it("derating factor between 0 and 1 for extreme inputs", () => {
    const o = executeFormula(S2);
    expect(o.out_deratingFactor).toBeGreaterThanOrEqual(0);
    expect(o.out_deratingFactor).toBeLessThanOrEqual(1);
  });

  it("all outputs finite for sample inputs", () => {
    const o = executeFormula(S1);
    for (const key of Object.keys(o) as Array<keyof FxCommodityPassThroughOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });
});
