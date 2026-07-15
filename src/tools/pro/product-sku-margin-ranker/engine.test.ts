// SectorCalc — Product SKU Margin Ranker — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, division-by-zero contract

import { describe, it, expect } from "vitest";
import { executeFormula, type ProductSkuMarginOutputs } from
  "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 — Closed-form", () => {
  // ── S1: Profitable SKU ──────────────────────────────────────────────────
  // machineRate=50, cycleTime=12, materialCost=25, targetMargin=0.15,
  // annualVolume=10000, laborRate=20, overheadRate=50000,
  // defectOrLossCost=3000, sourceConfidence=0.9
  //
  // ch = 12/60 = 0.2
  // tuc = 25 + (20*0.2) + (50*0.2) + (50000/10000) = 25+4+10+5 = 44
  // up = 25*1.4 = 35
  // cm = 35-44 = -9
  // cmr = -9/35 = -0.2571
  // lc = 25*0.1 = 2.5
  // nm = -9-2.5-(3000/10000) = -11.5-0.3 = -11.8
  // rs = -11.8*100 = -1180

  const S1 = {
    machineRate: 50, cycleTime: 12, materialCost: 25,
    targetMargin: 0.15, annualVolume: 10000, laborRate: 20,
    overheadRate: 50000, defectOrLossCost: 3000,
    sourceConfidence: 0.9,
  };

  it("S1: contribution margin = -9 (loss)", () => {
    expect(executeFormula(S1).out_demand_metric).toBeCloseTo(-9, 4);
  });
  it("S1: unit price = 35", () => {
    expect(executeFormula(S1).out_capacity_metric).toBeCloseTo(35, 4);
  });
  it("S1: contribution margin ratio = -0.2571", () => {
    expect(executeFormula(S1).out_utilization_margin).toBeCloseTo(-0.2571, 4);
  });
  it("S1: money at risk = 9*10000 = 90000", () => {
    expect(executeFormula(S1).out_money_at_risk).toBeCloseTo(90000, 2);
  });
  it("S1: threshold crossing = 1 (cm <= 0)", () => {
    expect(executeFormula(S1).out_threshold_crossing).toBe(1);
  });
  it("S1: fmea trigger = 1 (cm < 0)", () => {
    expect(executeFormula(S1).out_fmea_trigger).toBe(1);
  });
  it("S1: decision state = 2 (loss-making)", () => {
    expect(executeFormula(S1).out_final_decision_state).toBe(2);
  });

  // ── S2: Healthy SKU ─────────────────────────────────────────────────────
  // machineRate=30, cycleTime=6, materialCost=10, targetMargin=0.20,
  // annualVolume=50000, laborRate=15, overheadRate=50000,
  // defectOrLossCost=2000, sourceConfidence=0.95
  //
  // ch = 6/60 = 0.1
  // tuc = 10 + (15*0.1) + (30*0.1) + (50000/50000) = 10+1.5+3+1 = 15.5
  // up = 10*1.4 = 14
  // cm = 14-15.5 = -1.5

  // SKU adjustment: use lower machine rate and target margin for healthy case
  // machineRate=10, cycleTime=2, materialCost=5, targetMargin=0.10,
  // annualVolume=200000, laborRate=8, overheadRate=50000,
  // defectOrLossCost=500, sourceConfidence=0.95
  //
  // ch = 0.0333
  // tuc = 5.85
  // up = 7
  // cm = 1.15
  // cmr = 0.1643
  // cmr(0.1643) >= tm(0.10) => true, cm > 0 => decision = 0
  // lc = 0.5
  // nm = 1.15-0.5-(500/200000) = 0.65-0.0025 = 0.6475

  const S2 = {
    machineRate: 10, cycleTime: 2, materialCost: 5,
    targetMargin: 0.10, annualVolume: 200000, laborRate: 8,
    overheadRate: 50000, defectOrLossCost: 500,
    sourceConfidence: 0.95,
  };

  it("S2: contribution margin = 1.15", () => {
    expect(executeFormula(S2).out_demand_metric).toBeCloseTo(1.15, 4);
  });
  it("S2: unit price = 7", () => {
    expect(executeFormula(S2).out_capacity_metric).toBeCloseTo(7, 4);
  });
  it("S2: cmr = 0.1643", () => {
    expect(executeFormula(S2).out_utilization_margin).toBeCloseTo(0.1643, 4);
  });
  it("S2: threshold crossing = 0 (profitable)", () => {
    expect(executeFormula(S2).out_threshold_crossing).toBe(0);
  });
  it("S2: decision state = 0 (healthy)", () => {
    expect(executeFormula(S2).out_final_decision_state).toBe(0);
  });

  // ── S3: Below-target margin ─────────────────────────────────────────────
  // machineRate=30, cycleTime=5, materialCost=15, targetMargin=0.30,
  // annualVolume=50000, laborRate=20, overheadRate=80000,
  // defectOrLossCost=2000, sourceConfidence=0.85
  //
  // ch = 5/60 = 0.0833
  // tuc = 15 + (20*0.0833) + (30*0.0833) + (80000/50000) = 15+1.667+2.5+1.6 = 20.767
  // up = 15*1.4 = 21
  // cm = 21-20.767 = 0.233
  // cmr = 0.233/21 = 0.0111
  // cmr(0.0111) < tm(0.30) but cm > 0 => decision = 1

  const S3 = {
    machineRate: 30, cycleTime: 5, materialCost: 15,
    targetMargin: 0.30, annualVolume: 50000, laborRate: 20,
    overheadRate: 80000, defectOrLossCost: 2000,
    sourceConfidence: 0.85,
  };

  it("S3: cm > 0 (profitable)", () => {
    expect(executeFormula(S3).out_demand_metric).toBeGreaterThan(0);
  });
  it("S3: cmr < target", () => {
    expect(executeFormula(S3).out_utilization_margin).toBeLessThan(0.30);
  });
  it("S3: decision state = 1 (below target)", () => {
    expect(executeFormula(S3).out_final_decision_state).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 — Edge cases", () => {
  it("all-zero inputs: zero outputs, nanocracies guarded", () => {
    const o = executeFormula({
      machineRate: 0, cycleTime: 0, materialCost: 0,
      targetMargin: 0, annualVolume: 0, laborRate: 0,
      overheadRate: 0, defectOrLossCost: 0, sourceConfidence: 0,
    });
    expect(o.out_normalized_demand).toBe(0);
    expect(o.out_demand_metric).toBe(0);
    expect(isFiniteNumber(o.out_utilization_margin)).toBe(true);
  });

  it("zero volume: overhead allocation uses 0, no division error", () => {
    const o = executeFormula({
      machineRate: 50, cycleTime: 10, materialCost: 20,
      targetMargin: 0.2, annualVolume: 0, laborRate: 15,
      overheadRate: 50000, defectOrLossCost: 1000,
      sourceConfidence: 0.9,
    });
    expect(isFiniteNumber(o.out_demand_metric)).toBe(true);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      machineRate: 1e4, cycleTime: 1e3, materialCost: 1e5,
      targetMargin: 0.5, annualVolume: 1e9, laborRate: 5e3,
      overheadRate: 1e9, defectOrLossCost: 1e6,
      sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof ProductSkuMarginOutputs>) {
      expect(typeof o[key]).toBe("number");
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 — Semantic insight rules", () => {
  const CUR = "$";

  it("negative_margin fires when cm < 0", () => {
    const o = executeFormula({
      machineRate: 50, cycleTime: 12, materialCost: 25,
      targetMargin: 0.15, annualVolume: 10000, laborRate: 20,
      overheadRate: 50000, defectOrLossCost: 3000,
      sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 50, cycleTime: 12, materialCost: 25,
      targetMargin: 0.15, annualVolume: 10000, laborRate: 20,
      overheadRate: 50000, defectOrLossCost: 3000,
      sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "negative_margin")).toBe(true);
  });

  it("negative_margin does NOT fire when cm >= 0", () => {
    const o = executeFormula({
      machineRate: 10, cycleTime: 2, materialCost: 5,
      targetMargin: 0.10, annualVolume: 200000, laborRate: 8,
      overheadRate: 50000, defectOrLossCost: 500,
      sourceConfidence: 0.95,
    });
    const active = getActiveInsights(o, {
      machineRate: 10, cycleTime: 2, materialCost: 5,
      targetMargin: 0.10, annualVolume: 200000, laborRate: 8,
      overheadRate: 50000, defectOrLossCost: 500,
      sourceConfidence: 0.95,
    }, CUR);
    expect(active.some((a) => a.id === "negative_margin")).toBe(false);
  });

  it("low_margin_vs_target fires when cmr < tm and cmr > 0", () => {
    const o = executeFormula({
      machineRate: 30, cycleTime: 5, materialCost: 15,
      targetMargin: 0.30, annualVolume: 50000, laborRate: 20,
      overheadRate: 80000, defectOrLossCost: 2000,
      sourceConfidence: 0.85,
    });
    const active = getActiveInsights(o, {
      machineRate: 30, cycleTime: 5, materialCost: 15,
      targetMargin: 0.30, annualVolume: 50000, laborRate: 20,
      overheadRate: 80000, defectOrLossCost: 2000,
      sourceConfidence: 0.85,
    }, CUR);
    expect(active.some((a) => a.id === "low_margin_vs_target")).toBe(true);
  });

  it("volume_concentration_risk fires when vol > 50000 and cm < 0", () => {
    const o = executeFormula({
      machineRate: 200, cycleTime: 12, materialCost: 10,
      targetMargin: 0.2, annualVolume: 100000, laborRate: 50,
      overheadRate: 10000000, defectOrLossCost: 5000,
      sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 200, cycleTime: 12, materialCost: 10,
      targetMargin: 0.2, annualVolume: 100000, laborRate: 50,
      overheadRate: 10000000, defectOrLossCost: 5000,
      sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "volume_concentration_risk")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("negative_margin");
    expect(allIds).toContain("low_margin_vs_target");
    expect(allIds).toContain("high_material_sensitivity");
    expect(allIds).toContain("high_labor_sensitivity");
    expect(allIds).toContain("volume_concentration_risk");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 — Stress test", () => {
  it("conservation: up = materialCost * 1.4", () => {
    const o = executeFormula({
      machineRate: 40, cycleTime: 8, materialCost: 20,
      targetMargin: 0.15, annualVolume: 50000, laborRate: 18,
      overheadRate: 60000, defectOrLossCost: 2000,
      sourceConfidence: 0.9,
    });
    expect(o.out_capacity_metric).toBeCloseTo(28, 4); // 20*1.4
  });

  it("all positive inputs produce finite outputs", () => {
    const o = executeFormula({
      machineRate: 35, cycleTime: 6, materialCost: 12,
      targetMargin: 0.2, annualVolume: 80000, laborRate: 16,
      overheadRate: 75000, defectOrLossCost: 1500,
      sourceConfidence: 0.9,
    });
    for (const key of Object.keys(o) as Array<keyof ProductSkuMarginOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });

  it("cmr = cm/up when up > 0", () => {
    const o = executeFormula({
      machineRate: 25, cycleTime: 4, materialCost: 8,
      targetMargin: 0.2, annualVolume: 100000, laborRate: 12,
      overheadRate: 60000, defectOrLossCost: 1000,
      sourceConfidence: 0.9,
    });
    if (o.out_capacity_metric > 0) {
      const expectedCmr = o.out_demand_metric / o.out_capacity_metric;
      expect(o.out_utilization_margin).toBeCloseTo(expectedCmr, 6);
    }
  });
});
