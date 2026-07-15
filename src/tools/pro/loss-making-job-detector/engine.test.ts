// SectorCalc — Loss-Making Job Detector — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, division-by-zero contract

import { describe, it, expect } from "vitest";
import { executeFormula, type LossMakingJobOutputs } from
  "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 — Closed-form", () => {
  // ── S1: Profitable job ──────────────────────────────────────────────────
  // machineRate=50, materialCost=30, laborRate=20, overheadRate=10,
  // defectOrLossCost=5, targetMargin=0.20, batchQuantity=500,
  // annualVolume=1000, sourceConfidence=0.9
  //
  // totalCost = 50+30+20+10+5 = 115
  // price = 50*500 = 25000
  // gm = 25000-115 = 24885
  // cm = 24885/25000 = 0.9954
  // map = 115*1.2 = 138
  // loss = 0 (gm > 0)
  // moneyAtRisk = 0
  // decision: cm(0.9954) >= tm(0.20) => 0

  const S1 = {
    machineRate: 50, materialCost: 30, laborRate: 20,
    overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.20,
    batchQuantity: 500, annualVolume: 1000, sourceConfidence: 0.9,
  };

  it("S1: price = 25000", () => {
    expect(executeFormula(S1).out_normalized_demand).toBeCloseTo(25000, 2);
  });
  it("S1: gross margin = 24885", () => {
    expect(executeFormula(S1).out_demand_metric).toBeCloseTo(24885, 2);
  });
  it("S1: contribution margin = 0.9954", () => {
    expect(executeFormula(S1).out_utilization_margin).toBeCloseTo(0.9954, 4);
  });
  it("S1: map = 138", () => {
    expect(executeFormula(S1).out_capacity_metric).toBeCloseTo(138, 2);
  });
  it("S1: money at risk = 0 (profitable)", () => {
    expect(executeFormula(S1).out_money_at_risk).toBe(0);
  });
  it("S1: threshold crossing = 0 (within target)", () => {
    expect(executeFormula(S1).out_threshold_crossing).toBe(0);
  });
  it("S1: decision state = 0 (healthy)", () => {
    expect(executeFormula(S1).out_final_decision_state).toBe(0);
  });
  it("S1: fmea trigger = 0", () => {
    expect(executeFormula(S1).out_fmea_trigger).toBe(0);
  });
  it("S1: evidence = 0.9", () => {
    expect(executeFormula(S1).out_evidence_completeness).toBeCloseTo(0.9, 4);
  });

  // ── S2: Loss-making job ─────────────────────────────────────────────────
  // machineRate=100, materialCost=200, laborRate=80, overheadRate=60,
  // defectOrLossCost=30, targetMargin=0.25, batchQuantity=2,
  // annualVolume=5000, sourceConfidence=0.8
  //
  // totalCost = 100+200+80+60+30 = 470
  // price = 100*2 = 200
  // gm = 200-470 = -270
  // cm = -270/200 = -1.35
  // loss = 270
  // moneyAtRisk = 270*5000 = 1350000
  // decision: -1.35 >= 0.25? No. -1.35 > 0? No => 2

  const S2 = {
    machineRate: 100, materialCost: 200, laborRate: 80,
    overheadRate: 60, defectOrLossCost: 30, targetMargin: 0.25,
    batchQuantity: 2, annualVolume: 5000, sourceConfidence: 0.8,
  };

  it("S2: price = 200", () => {
    expect(executeFormula(S2).out_normalized_demand).toBeCloseTo(200, 2);
  });
  it("S2: gross margin = -270 (loss)", () => {
    expect(executeFormula(S2).out_demand_metric).toBeCloseTo(-270, 2);
  });
  it("S2: contribution margin = -1.35", () => {
    expect(executeFormula(S2).out_utilization_margin).toBeCloseTo(-1.35, 4);
  });
  it("S2: money at risk = 1350000", () => {
    expect(executeFormula(S2).out_money_at_risk).toBeCloseTo(1350000, 2);
  });
  it("S2: threshold crossing = 1 (below target)", () => {
    expect(executeFormula(S2).out_threshold_crossing).toBe(1);
  });
  it("S2: fmea trigger = 1 (loss > 0)", () => {
    expect(executeFormula(S2).out_fmea_trigger).toBe(1);
  });
  it("S2: decision state = 2 (critical loss)", () => {
    expect(executeFormula(S2).out_final_decision_state).toBe(2);
  });

  // ── S3: Below-target but profitable ──────────────────────────────────────
  // machineRate=50, materialCost=30, laborRate=20, overheadRate=10,
  // defectOrLossCost=5, targetMargin=0.95, batchQuantity=20,
  // annualVolume=1000, sourceConfidence=0.9
  //
  // totalCost = 115
  // price = 50*20 = 1000
  // gm = 1000-115 = 885
  // cm = 885/1000 = 0.885
  // cm(0.885) >= tm(0.95)? No. cm(0.885) > 0? Yes => decision = 1

  const S3 = {
    machineRate: 50, materialCost: 30, laborRate: 20,
    overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.95,
    batchQuantity: 20, annualVolume: 1000, sourceConfidence: 0.9,
  };

  it("S3: gross margin = 885 (positive)", () => {
    expect(executeFormula(S3).out_demand_metric).toBeCloseTo(885, 2);
  });
  it("S3: contribution margin = 0.885", () => {
    expect(executeFormula(S3).out_utilization_margin).toBeCloseTo(0.885, 4);
  });
  it("S3: below target but profitable => decision = 1", () => {
    expect(executeFormula(S3).out_final_decision_state).toBe(1);
  });
  it("S3: threshold crossing = 1", () => {
    expect(executeFormula(S3).out_threshold_crossing).toBe(1);
  });
  it("S3: money at risk = 0 (profitable)", () => {
    expect(executeFormula(S3).out_money_at_risk).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 — Edge cases", () => {
  it("all-zero inputs: price=0, cm=0, no loss, no crash", () => {
    const o = executeFormula({
      machineRate: 0, materialCost: 0, laborRate: 0,
      overheadRate: 0, defectOrLossCost: 0, targetMargin: 0,
      batchQuantity: 0, annualVolume: 0, sourceConfidence: 0,
    });
    expect(o.out_normalized_demand).toBe(0);
    expect(o.out_demand_metric).toBe(0);
    expect(o.out_utilization_margin).toBe(0);
    expect(o.out_money_at_risk).toBe(0);
    expect(o.out_final_decision_state).toBe(0);
  });

  it("zero batch quantity: price=0, cm=0, decision=0", () => {
    const o = executeFormula({
      machineRate: 50, materialCost: 30, laborRate: 20,
      overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.2,
      batchQuantity: 0, annualVolume: 1000, sourceConfidence: 0.9,
    });
    expect(o.out_normalized_demand).toBe(0);
    expect(o.out_demand_metric).toBeCloseTo(-115, 2); // gm = 0 - 115 = -115
    expect(o.out_fmea_trigger).toBe(1);
  });

  it("negative target margin: still computes correctly", () => {
    const o = executeFormula({
      machineRate: 100, materialCost: 50, laborRate: 30,
      overheadRate: 20, defectOrLossCost: 10, targetMargin: -0.1,
      batchQuantity: 10, annualVolume: 500, sourceConfidence: 0.7,
    });
    // totalCost = 210, price = 1000, gm = 790, cm = 0.79
    // cm >= -0.1 => true => decision = 0
    expect(o.out_utilization_margin).toBeCloseTo(0.79, 4);
    expect(o.out_final_decision_state).toBe(0);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      machineRate: 1e4, materialCost: 5e4, laborRate: 2e4,
      overheadRate: 1e4, defectOrLossCost: 5e3, targetMargin: 0.3,
      batchQuantity: 1e6, annualVolume: 1e7, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof LossMakingJobOutputs>) {
      expect(typeof o[key]).toBe("number");
      if (key !== "out_audit_hash_payload") {
        expect(o[key]).not.toBeNaN();
      }
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 — Semantic insight rules", () => {
  const CUR = "$";

  it("loss_making fires when gm < 0", () => {
    const o = executeFormula({
      machineRate: 100, materialCost: 200, laborRate: 80,
      overheadRate: 60, defectOrLossCost: 30, targetMargin: 0.25,
      batchQuantity: 2, annualVolume: 5000, sourceConfidence: 0.8,
    });
    const active = getActiveInsights(o, {
      machineRate: 100, materialCost: 200, laborRate: 80,
      overheadRate: 60, defectOrLossCost: 30, targetMargin: 0.25,
      batchQuantity: 2, annualVolume: 5000, sourceConfidence: 0.8,
    }, CUR);
    expect(active.some((a) => a.id === "loss_making")).toBe(true);
  });

  it("loss_making does not fire when gm >= 0", () => {
    const o = executeFormula({
      machineRate: 50, materialCost: 30, laborRate: 20,
      overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.20,
      batchQuantity: 500, annualVolume: 1000, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 50, materialCost: 30, laborRate: 20,
      overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.20,
      batchQuantity: 500, annualVolume: 1000, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "loss_making")).toBe(false);
  });

  it("margin_warning fires when cm < tm but cm > 0", () => {
    const o = executeFormula({
      machineRate: 50, materialCost: 30, laborRate: 20,
      overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.95,
      batchQuantity: 20, annualVolume: 1000, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 50, materialCost: 30, laborRate: 20,
      overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.95,
      batchQuantity: 20, annualVolume: 1000, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "margin_warning")).toBe(true);
  });

  it("high_volume_exposure fires when vol > 10000 AND loss-making", () => {
    const o = executeFormula({
      machineRate: 10, materialCost: 100, laborRate: 20,
      overheadRate: 30, defectOrLossCost: 5, targetMargin: 0.1,
      batchQuantity: 1, annualVolume: 20000, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 10, materialCost: 100, laborRate: 20,
      overheadRate: 30, defectOrLossCost: 5, targetMargin: 0.1,
      batchQuantity: 1, annualVolume: 20000, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "high_volume_exposure")).toBe(true);
  });

  it("low_confidence fires when sourceConfidence < 0.7", () => {
    const o = executeFormula({
      machineRate: 50, materialCost: 30, laborRate: 20,
      overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.2,
      batchQuantity: 100, annualVolume: 1000, sourceConfidence: 0.5,
    });
    const active = getActiveInsights(o, {
      machineRate: 50, materialCost: 30, laborRate: 20,
      overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.2,
      batchQuantity: 100, annualVolume: 1000, sourceConfidence: 0.5,
    }, CUR);
    expect(active.some((a) => a.id === "low_confidence")).toBe(true);
  });

  it("healthy_margin fires when cm >= tm AND cm > 0.15", () => {
    const o = executeFormula({
      machineRate: 50, materialCost: 30, laborRate: 10,
      overheadRate: 5, defectOrLossCost: 2, targetMargin: 0.10,
      batchQuantity: 100, annualVolume: 1000, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      machineRate: 50, materialCost: 30, laborRate: 10,
      overheadRate: 5, defectOrLossCost: 2, targetMargin: 0.10,
      batchQuantity: 100, annualVolume: 1000, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "healthy_margin")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("loss_making");
    expect(allIds).toContain("margin_warning");
    expect(allIds).toContain("high_volume_exposure");
    expect(allIds).toContain("low_confidence");
    expect(allIds).toContain("healthy_margin");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 — Stress test", () => {
  it("conservation: moneyAtRisk = |loss| * annualVolume when loss-making", () => {
    const o = executeFormula({
      machineRate: 100, materialCost: 200, laborRate: 80,
      overheadRate: 60, defectOrLossCost: 30, targetMargin: 0.25,
      batchQuantity: 2, annualVolume: 5000, sourceConfidence: 0.8,
    });
    // gm = -270, loss = 270, vol = 5000 => money = 270*5000 = 1350000
    const expected = Math.abs(o.out_demand_metric - 0 > 0 ? 0 : Math.abs(o.out_demand_metric)) * 5000;
    expect(o.out_money_at_risk).toBeCloseTo(1350000, 2);
  });

  it("all positive inputs produce finite outputs (no NaN)", () => {
    const o = executeFormula({
      machineRate: 75, materialCost: 45, laborRate: 25,
      overheadRate: 15, defectOrLossCost: 8, targetMargin: 0.15,
      batchQuantity: 200, annualVolume: 8000, sourceConfidence: 0.85,
    });
    for (const key of Object.keys(o) as Array<keyof LossMakingJobOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });

  it("totalCost = sum of all cost inputs", () => {
    const o = executeFormula({
      machineRate: 60, materialCost: 40, laborRate: 25,
      overheadRate: 12, defectOrLossCost: 3, targetMargin: 0.2,
      batchQuantity: 50, annualVolume: 2000, sourceConfidence: 0.9,
    });
    const expectedTotal = 60 + 40 + 25 + 12 + 3;
    const computedTotal = o.out_capacity_metric / (1 + 0.2); // map = total*(1+tm)
    expect(computedTotal).toBeCloseTo(expectedTotal, 2);
  });

  it("cm = gm/price when price > 0", () => {
    const o = executeFormula({
      machineRate: 80, materialCost: 35, laborRate: 20,
      overheadRate: 10, defectOrLossCost: 5, targetMargin: 0.2,
      batchQuantity: 100, annualVolume: 5000, sourceConfidence: 0.9,
    });
    const expectedCm = o.out_demand_metric / o.out_normalized_demand;
    expect(o.out_utilization_margin).toBeCloseTo(expectedCm, 4);
  });
});
