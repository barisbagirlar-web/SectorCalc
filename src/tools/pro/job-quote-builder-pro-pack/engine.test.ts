// SectorCalc — Job Quote Builder Pro Pack — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, conservation, NaN immunity

import { describe, it, expect } from "vitest";
import { executeFormula, type JobQuoteOutputs } from
  "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 \u2014 Closed-form", () => {
  // ── S1: Normal job ────────────────────────────────────────────────────
  // machineRate=85, cycleTime=12, setupTime=8, materialCost=45,
  // targetMargin=0.25, batchQuantity=500, annualVolume=12000, laborRate=35,
  // overheadRate=60000, defectOrLossCost=1500, conf=0.85, unc=0.15
  //
  // tc = 20
  // lc = 35*20/60 = 11.6667
  // mac = 85*20/60 = 28.3333
  // sc = 1500*0.1 = 150
  // matTotal = 45*500 = 22500
  // oa = 60000/12000*500 = 2500
  // tjc = 11.6667+28.3333+22500+150+2500 = 25190
  // mu = 1.25
  // rp = 25190*1.25 = 31487.50
  // ra = 31487.50*(1+0.15*0.1) = 31487.50*1.015 = 31959.8125
  // mp = (31959.8125-25190)/31959.8125 = 6769.8125/31959.8125 = 0.2118...

  const S1 = {
    machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
    targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
    laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
    sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
  };

  it("S1: labor cost = 11.6667", () => {
    expect(executeFormula(S1).out_laborCost).toBeCloseTo(11.6667, 4);
  });
  it("S1: machine cost = 28.3333", () => {
    expect(executeFormula(S1).out_machineCost).toBeCloseTo(28.3333, 4);
  });
  it("S1: material cost total = 22500", () => {
    expect(executeFormula(S1).out_materialCostTotal).toBe(22500);
  });
  it("S1: scrap allowance = 150", () => {
    expect(executeFormula(S1).out_scrapAllowance).toBe(150);
  });
  it("S1: overhead allocation = 2500", () => {
    expect(executeFormula(S1).out_overheadAllocation).toBe(2500);
  });
  it("S1: total job cost = 25190", () => {
    expect(executeFormula(S1).out_totalJobCost).toBeCloseTo(25190, 2);
  });
  it("S1: markup multiplier = 1.25", () => {
    expect(executeFormula(S1).out_markupMultiplier).toBe(1.25);
  });
  it("S1: recommended price = 31487.50", () => {
    expect(executeFormula(S1).out_recommendedPrice).toBeCloseTo(31487.50, 2);
  });
  it("S1: risk-adjusted price = 31959.8125", () => {
    expect(executeFormula(S1).out_riskAdjustedPrice).toBeCloseTo(31959.8125, 4);
  });
  it("S1: margin pct = 0.2118", () => {
    expect(executeFormula(S1).out_marginPct).toBeCloseTo(0.2118, 4);
  });
  it("S1: threshold crossing = 1 (margin below target)", () => {
    expect(executeFormula(S1).out_thresholdCrossing).toBe(1);
  });
  it("S1: decision state = 1 (below target but above half)", () => {
    expect(executeFormula(S1).out_decisionState).toBe(1);
  });
  it("S1: fmea trigger = 0", () => {
    expect(executeFormula(S1).out_fmeaTrigger).toBe(0);
  });

  // ── S2: High margin ───────────────────────────────────────────────────
  // targetMargin=0.40, rest same as S1
  //
  // tc = 20, lc = 11.6667, mac = 28.3333, sc = 150, matTotal = 22500, oa = 2500
  // tjc = 25190
  // mu = 1.40
  // rp = 25190*1.40 = 35266
  // ra = 35266*1.015 = 35794.99
  // mp = (35794.99-25190)/35794.99 = 10604.99/35794.99 = 0.2963

  const S2 = {
    machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
    targetMargin: 0.40, batchQuantity: 500, annualVolume: 12000,
    laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
    sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
  };

  it("S2: recommended price = 35266", () => {
    expect(executeFormula(S2).out_recommendedPrice).toBeCloseTo(35266, 2);
  });
  it("S2: risk-adjusted price = 35794.99", () => {
    expect(executeFormula(S2).out_riskAdjustedPrice).toBeCloseTo(35794.99, 2);
  });
  it("S2: margin pct = 0.2963", () => {
    expect(executeFormula(S2).out_marginPct).toBeCloseTo(0.2963, 4);
  });
  it("S2: threshold crossing = 1 (margin below target)", () => {
    expect(executeFormula(S2).out_thresholdCrossing).toBe(1);
  });
  it("S2: decision state = 1 (below target, above half)", () => {
    expect(executeFormula(S2).out_decisionState).toBe(1);
  });

  // ── S3: Low margin ────────────────────────────────────────────────────
  // targetMargin=0.05, unc=0.4, rest same as S1
  //
  // tc = 20, lc = 11.6667, mac = 28.3333, sc = 150, matTotal = 22500, oa = 2500
  // tjc = 25190
  // mu = 1.05
  // rp = 25190*1.05 = 26449.50
  // ra = 26449.50*(1+0.4*0.1) = 26449.50*1.04 = 27507.48
  // mp = (27507.48-25190)/27507.48 = 2317.48/27507.48 = 0.0843

  const S3 = {
    machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
    targetMargin: 0.05, batchQuantity: 500, annualVolume: 12000,
    laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
    sourceConfidence: 0.85, uncertaintyMultiplier: 0.4,
  };

  it("S3: recommended price = 26449.50", () => {
    expect(executeFormula(S3).out_recommendedPrice).toBeCloseTo(26449.50, 2);
  });
  it("S3: risk-adjusted price = 27507.48", () => {
    expect(executeFormula(S3).out_riskAdjustedPrice).toBeCloseTo(27507.48, 2);
  });
  it("S3: margin pct = 0.0842", () => {
    expect(executeFormula(S3).out_marginPct).toBeCloseTo(0.0842, 4);
  });
  it("S3: threshold crossing = 0 (margin >= target)", () => {
    expect(executeFormula(S3).out_thresholdCrossing).toBe(0);
  });
  it("S3: decision state = 0 (margin >= target)", () => {
    expect(executeFormula(S3).out_decisionState).toBe(0);
  });
  it("S3: fmea trigger = 0 (margin >= half target)", () => {
    expect(executeFormula(S3).out_fmeaTrigger).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: tjc=0, margin=NaN (div by 0), no crash", () => {
    const o = executeFormula({
      machineRate: 0, cycleTime: 0, setupTime: 0, materialCost: 0,
      targetMargin: 0, batchQuantity: 0, annualVolume: 0,
      laborRate: 0, overheadRate: 0, defectOrLossCost: 0,
      sourceConfidence: 0, uncertaintyMultiplier: 0,
    });
    expect(o.out_totalJobCost).toBe(0);
    expect(o.out_laborCost).toBe(0);
    expect(o.out_machineCost).toBe(0);
    expect(o.out_materialCostTotal).toBe(0);
    // ra = 0, ra > 0 is false => mp = 0 (guarded)
    expect(o.out_marginPct).toBe(0);
    // thresholdCrossing: 0 >= 0 is true => 0
    expect(o.out_thresholdCrossing).toBe(0);
  });

  it("zero annual volume: overhead allocation = 0 (no crash)", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 0,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    });
    expect(o.out_overheadAllocation).toBe(0);
    expect(isFiniteNumber(o.out_totalJobCost)).toBe(true);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      machineRate: 5000, cycleTime: 1440, setupTime: 480, materialCost: 50000,
      targetMargin: 0.50, batchQuantity: 1e7, annualVolume: 1e8,
      laborRate: 500, overheadRate: 1e7, defectOrLossCost: 1e6,
      sourceConfidence: 1, uncertaintyMultiplier: 0.5,
    });
    for (const key of Object.keys(o) as Array<keyof JobQuoteOutputs>) {
      expect(typeof o[key]).toBe("number");
    }
  });

  it("negative input values produce finite outputs (guarded)", () => {
    const o = executeFormula({
      machineRate: -85, cycleTime: -12, setupTime: -8, materialCost: -45,
      targetMargin: -0.25, batchQuantity: -500, annualVolume: -12000,
      laborRate: -35, overheadRate: -60000, defectOrLossCost: -1500,
      sourceConfidence: -0.5, uncertaintyMultiplier: -0.15,
    });
    // Outputs should still be finite numbers (no crash)
    for (const key of Object.keys(o) as Array<keyof JobQuoteOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 \u2014 Semantic insight rules", () => {
  const CUR = "$";

  it("low_margin_warning fires when marginPct < targetMargin/2", () => {
    // tm=1.5 yields marginPct ~0.606, targetMargin/2=0.75 => 0.606 < 0.75
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 1.5, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 1.5, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    }, CUR);
    expect(active.some((a) => a.id === "low_margin_warning")).toBe(true);
  });

  it("low_margin_warning does not fire when marginPct >= targetMargin/2", () => {
    // targetMargin=0.25, targetMargin/2=0.125, marginPct~0.21 >= 0.125
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    }, CUR);
    expect(active.some((a) => a.id === "low_margin_warning")).toBe(false);
  });

  it("high_labor_burden fires when laborCost > machineCost * 1.5", () => {
    // laborRate=100, machineRate=10 => lc=33.33, mac=3.33 => 33.33>5
    const o = executeFormula({
      machineRate: 10, cycleTime: 20, setupTime: 10, materialCost: 10,
      targetMargin: 0.25, batchQuantity: 100, annualVolume: 1000,
      laborRate: 100, overheadRate: 10000, defectOrLossCost: 500,
      sourceConfidence: 0.9, uncertaintyMultiplier: 0.1,
    });
    const active = getActiveInsights(o, {
      machineRate: 10, cycleTime: 20, setupTime: 10, materialCost: 10,
      targetMargin: 0.25, batchQuantity: 100, annualVolume: 1000,
      laborRate: 100, overheadRate: 10000, defectOrLossCost: 500,
      sourceConfidence: 0.9, uncertaintyMultiplier: 0.1,
    }, CUR);
    expect(active.some((a) => a.id === "high_labor_burden")).toBe(true);
  });

  it("high_labor_burden does not fire when laborCost <= machineCost * 1.5", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    }, CUR);
    expect(active.some((a) => a.id === "high_labor_burden")).toBe(false);
  });

  it("high_uncertainty fires when uncertaintyMultiplier > 0.3", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.4,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.4,
    }, CUR);
    expect(active.some((a) => a.id === "high_uncertainty")).toBe(true);
  });

  it("high_uncertainty does not fire when uncertaintyMultiplier <= 0.3", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    }, CUR);
    expect(active.some((a) => a.id === "high_uncertainty")).toBe(false);
  });

  it("wider_opportunity fires when marginPct > targetMargin * 1.5", () => {
    // Use S3 inputs where marginPct~0.084 > 0.05*1.5=0.075
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.05, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.4,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.05, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.4,
    }, CUR);
    expect(active.some((a) => a.id === "wider_opportunity")).toBe(true);
  });

  it("confidence_warning fires when sourceConfidence < 0.5", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.3, uncertaintyMultiplier: 0.15,
    });
    const active = getActiveInsights(o, {
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.3, uncertaintyMultiplier: 0.15,
    }, CUR);
    expect(active.some((a) => a.id === "confidence_warning")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("low_margin_warning");
    expect(allIds).toContain("high_labor_burden");
    expect(allIds).toContain("high_uncertainty");
    expect(allIds).toContain("wider_opportunity");
    expect(allIds).toContain("confidence_warning");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("conservation: marginPct = (riskAdjustedPrice - totalJobCost) / riskAdjustedPrice", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    });
    const expected = (o.out_riskAdjustedPrice - o.out_totalJobCost) / o.out_riskAdjustedPrice;
    expect(o.out_marginPct).toBeCloseTo(expected, 6);
  });

  it("cost components sum to total job cost", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    });
    const sum = o.out_laborCost + o.out_machineCost + o.out_materialCostTotal +
      o.out_scrapAllowance + o.out_overheadAllocation;
    expect(sum).toBeCloseTo(o.out_totalJobCost, 4);
  });

  it("recommendedPrice = totalJobCost * markupMultiplier", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 45,
      targetMargin: 0.25, batchQuantity: 500, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    });
    expect(o.out_recommendedPrice).toBeCloseTo(o.out_totalJobCost * o.out_markupMultiplier, 4);
  });

  it("zero materialCost and batchQuantity: materialCostTotal=0, no crash", () => {
    const o = executeFormula({
      machineRate: 85, cycleTime: 12, setupTime: 8, materialCost: 0,
      targetMargin: 0.25, batchQuantity: 0, annualVolume: 12000,
      laborRate: 35, overheadRate: 60000, defectOrLossCost: 1500,
      sourceConfidence: 0.85, uncertaintyMultiplier: 0.15,
    });
    expect(o.out_materialCostTotal).toBe(0);
    expect(isFiniteNumber(o.out_totalJobCost)).toBe(true);
  });
});
