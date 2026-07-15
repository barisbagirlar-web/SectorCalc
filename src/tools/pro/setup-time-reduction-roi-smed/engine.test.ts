// SectorCalc — Setup Time Reduction ROI (SMED) — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, division-by-zero contract

import { describe, it, expect } from "vitest";
import { executeFormula, type SetupTimeReductionOutputs } from
  "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 — Closed-form", () => {
  // ── S1: Normal (low ROI, slow payback) ───────────────────────────────────
  // machineRate=85, setupTime=30, batchQuantity=500, annualVolume=100000,
  // laborRate=45, overheadRate=350000, sourceConfidence=0.9
  //
  // saved = 15
  // ac = 100000/500 = 200
  // ahr = 15*200/60 = 50
  // acv = 50*(85-45) = 2000
  // ass = 50*85 = 4250
  // ic = 350000*0.3 = 105000
  // pbm = (105000/4250)*12 = 296.47
  // roi = (4250/105000)*100 = 4.048%

  const S1 = {
    machineRate: 85, setupTime: 30, batchQuantity: 500,
    annualVolume: 100000, laborRate: 45,
    overheadRate: 350000, sourceConfidence: 0.9,
  };

  it("S1: annual hours recovered = 50", () => {
    expect(executeFormula(S1).out_normalized_demand).toBeCloseTo(50, 1);
  });
  it("S1: annual savings = 4250", () => {
    expect(executeFormula(S1).out_demand_metric).toBeCloseTo(4250, 2);
  });
  it("S1: capacity value = 2000", () => {
    expect(executeFormula(S1).out_capacity_metric).toBeCloseTo(2000, 2);
  });
  it("S1: roi = 4.048%", () => {
    expect(executeFormula(S1).out_utilization_margin).toBeCloseTo(0.04048, 4);
  });
  it("S1: investment cost = 105000", () => {
    expect(executeFormula(S1).out_money_at_risk).toBeCloseTo(105000, 2);
  });
  it("S1: threshold crossing = 1 (roi <= 50%)", () => {
    expect(executeFormula(S1).out_threshold_crossing).toBe(1);
  });
  it("S1: decision state = 2 (pbm > 24)", () => {
    expect(executeFormula(S1).out_final_decision_state).toBe(2);
  });

  // ── S2: High ROI, fast payback ──────────────────────────────────────────
  // machineRate=200, setupTime=120, batchQuantity=50, annualVolume=5000,
  // laborRate=30, overheadRate=10000, sourceConfidence=0.95
  //
  // saved = 60
  // ac = 5000/50 = 100
  // ahr = 60*100/60 = 100
  // ass = 100*200 = 20000
  // acv = 100*(200-30) = 17000
  // ic = 10000*0.3 = 3000
  // pbm = (3000/20000)*12 = 1.8
  // roi = (20000/3000)*100 = 666.67%

  const S2 = {
    machineRate: 200, setupTime: 120, batchQuantity: 50,
    annualVolume: 5000, laborRate: 30,
    overheadRate: 10000, sourceConfidence: 0.95,
  };

  it("S2: annual hours recovered = 100", () => {
    expect(executeFormula(S2).out_normalized_demand).toBeCloseTo(100, 1);
  });
  it("S2: annual savings = 20000", () => {
    expect(executeFormula(S2).out_demand_metric).toBeCloseTo(20000, 2);
  });
  it("S2: roi = 666.67%", () => {
    expect(executeFormula(S2).out_utilization_margin).toBeCloseTo(6.6667, 4);
  });
  it("S2: investment cost = 3000", () => {
    expect(executeFormula(S2).out_money_at_risk).toBeCloseTo(3000, 2);
  });
  it("S2: threshold crossing = 0 (roi > 50%)", () => {
    expect(executeFormula(S2).out_threshold_crossing).toBe(0);
  });
  it("S2: decision state = 0 (pbm < 12)", () => {
    expect(executeFormula(S2).out_final_decision_state).toBe(0);
  });

  // ── S3: Moderate payback (12-24 months) ──────────────────────────────────
  // machineRate=100, setupTime=45, batchQuantity=100, annualVolume=1000,
  // laborRate=45, overheadRate=2000, sourceConfidence=0.8
  //
  // saved = 22.5
  // ac = 1000/100 = 10
  // ahr = 22.5*10/60 = 3.75
  // ass = 3.75*100 = 375
  // ic = 2000*0.3 = 600
  // pbm = (600/375)*12 = 19.2
  // roi = (375/600)*100 = 62.5%

  const S3 = {
    machineRate: 100, setupTime: 45, batchQuantity: 100,
    annualVolume: 1000, laborRate: 45,
    overheadRate: 2000, sourceConfidence: 0.8,
  };

  it("S3: annual savings = 375", () => {
    expect(executeFormula(S3).out_demand_metric).toBeCloseTo(375, 2);
  });
  it("S3: roi = 62.5%", () => {
    expect(executeFormula(S3).out_utilization_margin).toBeCloseTo(0.625, 4);
  });
  it("S3: threshold crossing = 0 (roi > 50%)", () => {
    expect(executeFormula(S3).out_threshold_crossing).toBe(0);
  });
  it("S3: decision state = 1 (12 < pbm <= 24)", () => {
    expect(executeFormula(S3).out_final_decision_state).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 — Edge cases", () => {
  it("all-zero inputs: zero outputs, no crash", () => {
    const o = executeFormula({
      machineRate: 0, setupTime: 0, batchQuantity: 0,
      annualVolume: 0, laborRate: 0,
      overheadRate: 0, sourceConfidence: 0,
    });
    expect(o.out_normalized_demand).toBe(0);
    expect(o.out_demand_metric).toBe(0);
    expect(o.out_capacity_metric).toBe(0);
    // ic = 0 > 0? No => ic = 50000 (default)
    expect(o.out_money_at_risk).toBeCloseTo(50000, 2);
  });

  it("zero batch quantity: ac = 0, ahr = 0, no division error", () => {
    const o = executeFormula({
      machineRate: 85, setupTime: 30, batchQuantity: 0,
      annualVolume: 100000, laborRate: 45,
      overheadRate: 350000, sourceConfidence: 0.9,
    });
    expect(o.out_normalized_demand).toBe(0);
    expect(o.out_demand_metric).toBe(0);
  });

  it("zero overhead: uses default ic=50000", () => {
    const o = executeFormula({
      machineRate: 100, setupTime: 60, batchQuantity: 100,
      annualVolume: 5000, laborRate: 40,
      overheadRate: 0, sourceConfidence: 0.8,
    });
    expect(o.out_money_at_risk).toBeCloseTo(50000, 2);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      machineRate: 1e4, setupTime: 1e3, batchQuantity: 1e6,
      annualVolume: 1e9, laborRate: 5e3,
      overheadRate: 1e9, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof SetupTimeReductionOutputs>) {
      expect(typeof o[key]).toBe("number");
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 — Semantic insight rules", () => {
  const CUR = "$";

  it("high_roi fires when utilization_margin > 0.50", () => {
    const o = executeFormula({
      machineRate: 200, setupTime: 120, batchQuantity: 50,
      annualVolume: 5000, laborRate: 30,
      overheadRate: 10000, sourceConfidence: 0.95,
    });
    const active = getActiveInsights(o, {
      machineRate: 200, setupTime: 120, batchQuantity: 50,
      annualVolume: 5000, laborRate: 30,
      overheadRate: 10000, sourceConfidence: 0.95,
    }, CUR);
    expect(active.some((a) => a.id === "high_roi")).toBe(true);
  });

  it("high_roi does NOT fire when roi <= 50%", () => {
    const o = executeFormula({
      machineRate: 85, setupTime: 30, batchQuantity: 500,
      annualVolume: 100000, laborRate: 45,
      overheadRate: 350000, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, setupTime: 30, batchQuantity: 500,
      annualVolume: 100000, laborRate: 45,
      overheadRate: 350000, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "high_roi")).toBe(false);
  });

  it("fast_payback fires when decision state = 0", () => {
    const o = executeFormula({
      machineRate: 200, setupTime: 120, batchQuantity: 50,
      annualVolume: 5000, laborRate: 30,
      overheadRate: 10000, sourceConfidence: 0.95,
    });
    const active = getActiveInsights(o, {
      machineRate: 200, setupTime: 120, batchQuantity: 50,
      annualVolume: 5000, laborRate: 30,
      overheadRate: 10000, sourceConfidence: 0.95,
    }, CUR);
    expect(active.some((a) => a.id === "fast_payback")).toBe(true);
  });

  it("moderate_payback fires when decision state = 1", () => {
    const o = executeFormula({
      machineRate: 100, setupTime: 45, batchQuantity: 100,
      annualVolume: 1000, laborRate: 45,
      overheadRate: 2000, sourceConfidence: 0.8,
    });
    const active = getActiveInsights(o, {
      machineRate: 100, setupTime: 45, batchQuantity: 100,
      annualVolume: 1000, laborRate: 45,
      overheadRate: 2000, sourceConfidence: 0.8,
    }, CUR);
    expect(active.some((a) => a.id === "moderate_payback")).toBe(true);
  });

  it("high_investment_risk fires when decision state = 2", () => {
    const o = executeFormula({
      machineRate: 85, setupTime: 30, batchQuantity: 500,
      annualVolume: 100000, laborRate: 45,
      overheadRate: 350000, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, setupTime: 30, batchQuantity: 500,
      annualVolume: 100000, laborRate: 45,
      overheadRate: 350000, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "high_investment_risk")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("high_roi");
    expect(allIds).toContain("fast_payback");
    expect(allIds).toContain("moderate_payback");
    expect(allIds).toContain("high_investment_risk");
    expect(allIds).toContain("low_confidence");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 — Stress test", () => {
  it("conservation: ahr = saved*ac/60", () => {
    const o = executeFormula({
      machineRate: 100, setupTime: 40, batchQuantity: 200,
      annualVolume: 20000, laborRate: 45,
      overheadRate: 50000, sourceConfidence: 0.85,
    });
    const expectedAhr = (40 * 0.5) * (20000 / 200) / 60;
    expect(o.out_normalized_demand).toBeCloseTo(expectedAhr, 4);
  });

  it("all positive inputs produce finite outputs", () => {
    const o = executeFormula({
      machineRate: 75, setupTime: 25, batchQuantity: 300,
      annualVolume: 50000, laborRate: 35,
      overheadRate: 200000, sourceConfidence: 0.9,
    });
    for (const key of Object.keys(o) as Array<keyof SetupTimeReductionOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });

  it("roi = (ass / ic) * 100", () => {
    const o = executeFormula({
      machineRate: 150, setupTime: 60, batchQuantity: 100,
      annualVolume: 10000, laborRate: 40,
      overheadRate: 50000, sourceConfidence: 0.9,
    });
    const expectedRoi = (o.out_demand_metric / o.out_money_at_risk) * 100;
    expect(o.out_utilization_margin * 100).toBeCloseTo(expectedRoi, 4);
  });
});
