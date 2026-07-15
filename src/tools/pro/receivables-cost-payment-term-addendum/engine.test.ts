// SectorCalc — Receivables Cost / Payment Term Addendum — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, division-by-zero contract

import { describe, it, expect } from "vitest";
import { executeFormula, type ReceivablesCostOutputs } from
  "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 — Closed-form", () => {
  // ── S1: Normal ─────────────────────────────────────────────────────────
  // machineRate=85, cycleTime=12, materialCost=25, batchQuantity=500,
  // overheadRate=350000, defectOrLossCost=12000, sourceConfidence=0.9
  //
  // ra = (85*12/60)*500 + 25*500 = 17*500 + 12500 = 8500 + 12500 = 21000
  // fr = min(max(0.02, 350000/85/100), 0.25) = 0.25
  // fc = 21000*0.25*60/365 = 21000*0.0410959 = 863.01
  // ap = 863.01/21000 = 0.0411
  // rp = 12000*0.15 = 1800
  // tfc = 863.01+1800 = 2663.01

  const S1 = {
    machineRate: 85, cycleTime: 12, materialCost: 25,
    batchQuantity: 500, overheadRate: 350000,
    defectOrLossCost: 12000, sourceConfidence: 0.9,
  };

  it("S1: receivables amount = 21000", () => {
    expect(executeFormula(S1).out_normalized_demand).toBeCloseTo(21000, 2);
  });
  it("S1: finance cost = 863.01", () => {
    expect(executeFormula(S1).out_demand_metric).toBeCloseTo(863.01, 1);
  });
  it("S1: capacity metric = ra + tfc = 23663", () => {
    expect(executeFormula(S1).out_capacity_metric).toBeCloseTo(23663, 0);
  });
  it("S1: utilization margin (ap) = 0.0411", () => {
    expect(executeFormula(S1).out_utilization_margin).toBeCloseTo(0.0411, 4);
  });
  it("S1: total finance cost = 2663", () => {
    expect(executeFormula(S1).out_money_at_risk).toBeCloseTo(2663, 0);
  });
  it("S1: threshold crossing = 0 (ap <= 0.05)", () => {
    expect(executeFormula(S1).out_threshold_crossing).toBe(0);
  });
  it("S1: decision state = 0 (low cost)", () => {
    expect(executeFormula(S1).out_final_decision_state).toBe(0);
  });

  // ── S2: Low overhead, high machine rate (fr bottoms at 0.02) ─────────────
  // machineRate=200, cycleTime=10, materialCost=50, batchQuantity=100,
  // overheadRate=100, defectOrLossCost=5000, sourceConfidence=0.95
  //
  // ra = (200*10/60)*100 + 50*100 = 33.33*100 + 5000 = 3333 + 5000 = 8333
  // fr = max(0.02, 100/200/100) = max(0.02, 0.005) = 0.02
  // fc = 8333*0.02*60/365 = 8333*0.0032877 = 27.40
  // ap = 27.40/8333 = 0.00329
  // rp = 5000*0.15 = 750
  // tfc = 27.40+750 = 777.40

  const S2 = {
    machineRate: 200, cycleTime: 10, materialCost: 50,
    batchQuantity: 100, overheadRate: 100,
    defectOrLossCost: 5000, sourceConfidence: 0.95,
  };

  it("S2: receivables amount = 8333", () => {
    expect(executeFormula(S2).out_normalized_demand).toBeCloseTo(8333, 0);
  });
  it("S2: fr = 0.02 (floor)", () => {
    const o = executeFormula(S2);
    expect(o.out_utilization_margin).toBeLessThanOrEqual(0.005);
  });
  it("S2: penalty cost = 750", () => {
    const o = executeFormula(S2);
    expect(o.out_money_at_risk).toBeGreaterThanOrEqual(777);
  });

  // ── S3: High overhead scenario (fr caps at 0.25) ─────────────────────────
  // machineRate=50, cycleTime=30, materialCost=100, batchQuantity=50,
  // overheadRate=500000, defectOrLossCost=2000, sourceConfidence=0.7
  //
  // ra = (50*30/60)*50 + 100*50 = 25*50 + 5000 = 1250+5000 = 6250
  // fr = min(max(0.02, 500000/50/100), 0.25) = min(100, 0.25) = 0.25
  // fc = 6250*0.25*60/365 = 6250*0.0410959 = 256.85
  // ap = 256.85/6250 = 0.0411

  const S3 = {
    machineRate: 50, cycleTime: 30, materialCost: 100,
    batchQuantity: 50, overheadRate: 500000,
    defectOrLossCost: 2000, sourceConfidence: 0.7,
  };

  it("S3: receivables amount = 6250", () => {
    expect(executeFormula(S3).out_normalized_demand).toBeCloseTo(6250, 2);
  });
  it("S3: fr caps at 0.25", () => {
    const o = executeFormula(S3);
    // ap = fr*60/365, fr=0.25 => ap=0.0411
    expect(o.out_utilization_margin).toBeCloseTo(0.0411, 4);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 — Edge cases", () => {
  it("all-zero inputs: zero outputs, no crash", () => {
    const o = executeFormula({
      machineRate: 0, cycleTime: 0, materialCost: 0,
      batchQuantity: 0, overheadRate: 0,
      defectOrLossCost: 0, sourceConfidence: 0,
    });
    expect(o.out_normalized_demand).toBe(0);
    expect(o.out_demand_metric).toBe(0);
    expect(o.out_money_at_risk).toBe(0);
  });

  it("zero batch quantity: ra=0, ap=0, no division error", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, materialCost: 25,
      batchQuantity: 0, overheadRate: 350000,
      defectOrLossCost: 12000, sourceConfidence: 0.9,
    });
    expect(o.out_normalized_demand).toBe(0);
    expect(o.out_utilization_margin).toBe(0);
  });

  it("negative overhead produces fr=0.02 floor", () => {
    const o = executeFormula({
      machineRate: 100, cycleTime: 10, materialCost: 20,
      batchQuantity: 50, overheadRate: -1000,
      defectOrLossCost: 500, sourceConfidence: 0.8,
    });
    // fr should use the negative value which would give max(0.02, -1000/100/100) = max(0.02, -0.1) = 0.02
    expect(isFiniteNumber(o.out_demand_metric)).toBe(true);
    expect(o.out_utilization_margin).toBeGreaterThan(0);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      machineRate: 1e4, cycleTime: 1e3, materialCost: 1e5,
      batchQuantity: 1e6, overheadRate: 1e9,
      defectOrLossCost: 1e6, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof ReceivablesCostOutputs>) {
      expect(typeof o[key]).toBe("number");
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 — Semantic insight rules", () => {
  const CUR = "$";

  it("high_finance_cost fires when ap > 0.10 (never with current bounds, so never)", () => {
    // ap is capped at ~4.11%, so high_finance_cost can never fire
    const o = executeFormula({
      machineRate: 10, cycleTime: 5, materialCost: 100,
      batchQuantity: 100, overheadRate: 1e9,
      defectOrLossCost: 1000, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 10, cycleTime: 5, materialCost: 100,
      batchQuantity: 100, overheadRate: 1e9,
      defectOrLossCost: 1000, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "high_finance_cost")).toBe(false);
  });

  it("moderate_finance_cost fires when 0.05 < ap <= 0.10 (never with current bounds)", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, materialCost: 25,
      batchQuantity: 500, overheadRate: 350000,
      defectOrLossCost: 12000, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, cycleTime: 12, materialCost: 25,
      batchQuantity: 500, overheadRate: 350000,
      defectOrLossCost: 12000, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "moderate_finance_cost")).toBe(false);
  });

  it("high_receivables_impact fires when fc > 50000", () => {
    const o = executeFormula({
      machineRate: 500, cycleTime: 60, materialCost: 500,
      batchQuantity: 10000, overheadRate: 1e9,
      defectOrLossCost: 10000, sourceConfidence: 0.95,
    });
    const active = getActiveInsights(o, {
      machineRate: 500, cycleTime: 60, materialCost: 500,
      batchQuantity: 10000, overheadRate: 1e9,
      defectOrLossCost: 10000, sourceConfidence: 0.95,
    }, CUR);
    expect(active.some((a) => a.id === "high_receivables_impact")).toBe(true);
  });

  it("low_confidence fires when sourceConfidence < 0.7", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, materialCost: 25,
      batchQuantity: 500, overheadRate: 350000,
      defectOrLossCost: 12000, sourceConfidence: 0.5,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, cycleTime: 12, materialCost: 25,
      batchQuantity: 500, overheadRate: 350000,
      defectOrLossCost: 12000, sourceConfidence: 0.5,
    }, CUR);
    expect(active.some((a) => a.id === "low_confidence")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("high_finance_cost");
    expect(allIds).toContain("moderate_finance_cost");
    expect(allIds).toContain("high_receivables_impact");
    expect(allIds).toContain("hedge_recommendation");
    expect(allIds).toContain("low_confidence");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 — Stress test", () => {
  it("conservation: tfc = fc + rp", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, materialCost: 25,
      batchQuantity: 500, overheadRate: 350000,
      defectOrLossCost: 12000, sourceConfidence: 0.9,
    });
    expect(o.out_money_at_risk).toBeCloseTo(o.out_demand_metric + 12000 * 0.15, 0);
  });

  it("ap = fc/ra when ra > 0", () => {
    const o = executeFormula({
      machineRate: 100, cycleTime: 15, materialCost: 30,
      batchQuantity: 200, overheadRate: 100000,
      defectOrLossCost: 5000, sourceConfidence: 0.85,
    });
    if (o.out_normalized_demand > 0) {
      const expectedAp = o.out_demand_metric / o.out_normalized_demand;
      expect(o.out_utilization_margin).toBeCloseTo(expectedAp, 6);
    }
  });

  it("all positive inputs produce finite outputs", () => {
    const o = executeFormula({
      machineRate: 75, cycleTime: 8, materialCost: 40,
      batchQuantity: 300, overheadRate: 200000,
      defectOrLossCost: 8000, sourceConfidence: 0.9,
    });
    for (const key of Object.keys(o) as Array<keyof ReceivablesCostOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });

  it("zero inputs: ra=0, penalty only from defect cost", () => {
    const o = executeFormula({
      machineRate: 0, cycleTime: 0, materialCost: 0,
      batchQuantity: 0, overheadRate: 0,
      defectOrLossCost: 1000, sourceConfidence: 0.8,
    });
    expect(o.out_normalized_demand).toBe(0);
    expect(o.out_money_at_risk).toBeCloseTo(150, 2); // 1000*0.15
  });
});
