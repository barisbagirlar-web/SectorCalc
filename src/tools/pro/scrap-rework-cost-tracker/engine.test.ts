// SectorCalc — Scrap & Rework Cost Tracker — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, division-by-zero contract

import { describe, it, expect } from "vitest";
import { executeFormula, type ScrapReworkOutputs } from
  "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 \u2014 Closed-form", () => {
  // ── S1: Normal ─────────────────────────────────────────────────────────
  // totalProduced=10000, scrapQty=150, reworkQty=80, matCost=25, labCost=15
  // reworkRate=45, reworkTime=0.5, target=2%, monthlyVol=10000, conf=0.9
  //
  // scrapCost = 150 * (25+15) = 6000
  // reworkCost = 80 * 45 * 0.5 = 1800
  // totalDefect = 230
  // defectCostPerUnit = 7800/230 = 33.9130
  // monthlyLoss = 7800 * (10000/10000) = 7800
  // defectRate = 230/10000 = 0.023
  // primaryDriver = 0 (scrap > rework)
  // decision: 0.023 > 0.02 AND 33.91 > 12.5 => 2

  const S1 = {
    totalProduced: 10000, scrapQuantity: 150, reworkQuantity: 80,
    unitMaterialCost: 25, unitLaborCost: 15,
    reworkLaborRate: 45, reworkTimePerUnit: 0.5,
    defectRateTargetPct: 2, monthlyVolume: 10000, sourceConfidence: 0.9,
  };

  it("S1: scrap cost = 6000", () => {
    expect(executeFormula(S1).out_scrapCost).toBeCloseTo(6000, 2);
  });
  it("S1: rework cost = 1800", () => {
    expect(executeFormula(S1).out_reworkCost).toBeCloseTo(1800, 2);
  });
  it("S1: total defect units = 230", () => {
    expect(executeFormula(S1).out_totalDefectUnits).toBe(230);
  });
  it("S1: defect cost per unit = 33.9130", () => {
    expect(executeFormula(S1).out_defectCostPerUnit).toBeCloseTo(33.9130, 4);
  });
  it("S1: monthly quality loss = 7800", () => {
    expect(executeFormula(S1).out_monthlyQualityLoss).toBeCloseTo(7800, 2);
  });
  it("S1: defect rate = 0.023", () => {
    expect(executeFormula(S1).out_defectRate).toBeCloseTo(0.023, 4);
  });
  it("S1: primary driver = 0 (scrap dominant)", () => {
    expect(executeFormula(S1).out_primaryDriver).toBe(0);
  });
  it("S1: decision state = 2 (exceed + high cost)", () => {
    expect(executeFormula(S1).out_decisionState).toBe(2);
  });
  it("S1: threshold crossing = 1", () => {
    expect(executeFormula(S1).out_thresholdCrossing).toBe(1);
  });

  // ── S2: Low defect (within target) ─────────────────────────────────────
  // totalProduced=5000, scrapQty=20, reworkQty=30, matCost=50, labCost=30
  // reworkRate=40, reworkTime=0.25, target=3%, monthlyVol=5000, conf=0.95
  //
  // scrapCost=1600, reworkCost=300, totalDefect=50
  // defectRate=0.01 <= 0.03 => decision=0

  const S2 = {
    totalProduced: 5000, scrapQuantity: 20, reworkQuantity: 30,
    unitMaterialCost: 50, unitLaborCost: 30,
    reworkLaborRate: 40, reworkTimePerUnit: 0.25,
    defectRateTargetPct: 3, monthlyVolume: 5000, sourceConfidence: 0.95,
  };

  it("S2: scrap cost = 1600", () => {
    expect(executeFormula(S2).out_scrapCost).toBeCloseTo(1600, 2);
  });
  it("S2: defect rate = 0.01", () => {
    expect(executeFormula(S2).out_defectRate).toBeCloseTo(0.01, 4);
  });
  it("S2: decision state = 0 (within target)", () => {
    expect(executeFormula(S2).out_decisionState).toBe(0);
  });
  it("S2: threshold crossing = 0", () => {
    expect(executeFormula(S2).out_thresholdCrossing).toBe(0);
  });

  // ── S3: Rework dominant ────────────────────────────────────────────────
  // totalProduced=2000, scrapQty=50, reworkQty=200, matCost=10, labCost=5
  // reworkRate=35, reworkTime=2, target=5%, monthlyVol=2000, conf=0.7
  //
  // scrapCost=750, reworkCost=14000, totalDefect=250
  // defectRate=0.125 > 0.05 => decision=2
  // primaryDriver: 750 < 14000 => 1 (rework dominant)

  const S3 = {
    totalProduced: 2000, scrapQuantity: 50, reworkQuantity: 200,
    unitMaterialCost: 10, unitLaborCost: 5,
    reworkLaborRate: 35, reworkTimePerUnit: 2,
    defectRateTargetPct: 5, monthlyVolume: 2000, sourceConfidence: 0.7,
  };

  it("S3: rework cost = 14000", () => {
    expect(executeFormula(S3).out_reworkCost).toBeCloseTo(14000, 2);
  });
  it("S3: scrap cost = 750", () => {
    expect(executeFormula(S3).out_scrapCost).toBeCloseTo(750, 2);
  });
  it("S3: primary driver = 1 (rework dominant)", () => {
    expect(executeFormula(S3).out_primaryDriver).toBe(1);
  });
  it("S3: defect rate = 0.125", () => {
    expect(executeFormula(S3).out_defectRate).toBeCloseTo(0.125, 4);
  });
  it("S3: monthly loss = 14750", () => {
    expect(executeFormula(S3).out_monthlyQualityLoss).toBeCloseTo(14750, 2);
  });
  it("S3: fmea trigger = 1 (rate > 0.05)", () => {
    expect(executeFormula(S3).out_fmeaTrigger).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: cost=0, defectRate=NaN (div by 0), no crash", () => {
    const o = executeFormula({
      totalProduced: 0, scrapQuantity: 0, reworkQuantity: 0,
      unitMaterialCost: 0, unitLaborCost: 0,
      reworkLaborRate: 0, reworkTimePerUnit: 0,
      defectRateTargetPct: 0, monthlyVolume: 0, sourceConfidence: 0,
    });
    expect(o.out_scrapCost).toBe(0);
    expect(o.out_reworkCost).toBe(0);
    expect(o.out_totalDefectUnits).toBe(0);
    expect(o.out_defectCostPerUnit).toBeNaN(); // totalDefect=0
    expect(o.out_defectRate).toBeNaN(); // totalProduced=0
    expect(o.out_monthlyQualityLoss).toBeNaN(); // totalProduced=0
  });

  it("zero scrap but positive rework: scrapCost=0, rework dominant", () => {
    const o = executeFormula({
      totalProduced: 1000, scrapQuantity: 0, reworkQuantity: 50,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 20, reworkTimePerUnit: 0.5,
      defectRateTargetPct: 3, monthlyVolume: 1000, sourceConfidence: 0.8,
    });
    expect(o.out_scrapCost).toBe(0);
    expect(o.out_reworkCost).toBe(500);
    expect(o.out_primaryDriver).toBe(1);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      totalProduced: 1e7, scrapQuantity: 5e5, reworkQuantity: 2e5,
      unitMaterialCost: 5000, unitLaborCost: 3000,
      reworkLaborRate: 200, reworkTimePerUnit: 8,
      defectRateTargetPct: 5, monthlyVolume: 1e6, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof ScrapReworkOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("negative quantities produce cost outputs but defect rate is NaN (guarded)", () => {
    const o = executeFormula({
      totalProduced: -100, scrapQuantity: -10, reworkQuantity: -5,
      unitMaterialCost: 25, unitLaborCost: 15,
      reworkLaborRate: 45, reworkTimePerUnit: 0.5,
      defectRateTargetPct: 2, monthlyVolume: -100, sourceConfidence: 0.5,
    });
    expect(o.out_scrapCost).toBe(-400);
    // totalProduced <= 0 => defectRate = NaN (guarded)
    expect(o.out_defectRate).toBeNaN();
    // Cost outputs still finite
    expect(isFiniteNumber(o.out_scrapCost)).toBe(true);
    expect(isFiniteNumber(o.out_reworkCost)).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 \u2014 Semantic insight rules", () => {
  const CUR = "$";

  it("scrap_dominant fires when scrap > 70% of total", () => {
    const o = executeFormula({
      totalProduced: 1000, scrapQuantity: 100, reworkQuantity: 5,
      unitMaterialCost: 50, unitLaborCost: 30,
      reworkLaborRate: 40, reworkTimePerUnit: 0.25,
      defectRateTargetPct: 5, monthlyVolume: 1000, sourceConfidence: 0.9,
    });
    // scrap=100*80=8000, rework=5*40*0.25=50, total=8050, scrap% = 8000/8050=99.4%
    const active = getActiveInsights(o, {
      totalProduced: 1000, scrapQuantity: 100, reworkQuantity: 5,
      unitMaterialCost: 50, unitLaborCost: 30,
      reworkLaborRate: 40, reworkTimePerUnit: 0.25,
      defectRateTargetPct: 5, monthlyVolume: 1000, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "scrap_dominant")).toBe(true);
  });

  it("scrap_dominant does not fire when scrap <= 70%", () => {
    const o = executeFormula({
      totalProduced: 2000, scrapQuantity: 50, reworkQuantity: 200,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 35, reworkTimePerUnit: 2,
      defectRateTargetPct: 5, monthlyVolume: 2000, sourceConfidence: 0.7,
    });
    // scrap=750, rework=14000 => scrap% = 5.1%
    const active = getActiveInsights(o, {
      totalProduced: 2000, scrapQuantity: 50, reworkQuantity: 200,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 35, reworkTimePerUnit: 2,
      defectRateTargetPct: 5, monthlyVolume: 2000, sourceConfidence: 0.7,
    }, CUR);
    expect(active.some((a) => a.id === "scrap_dominant")).toBe(false);
  });

  it("rework_dominant fires when rework > 70% of total", () => {
    const o = executeFormula({
      totalProduced: 2000, scrapQuantity: 50, reworkQuantity: 200,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 35, reworkTimePerUnit: 2,
      defectRateTargetPct: 5, monthlyVolume: 2000, sourceConfidence: 0.7,
    });
    const active = getActiveInsights(o, {
      totalProduced: 2000, scrapQuantity: 50, reworkQuantity: 200,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 35, reworkTimePerUnit: 2,
      defectRateTargetPct: 5, monthlyVolume: 2000, sourceConfidence: 0.7,
    }, CUR);
    expect(active.some((a) => a.id === "rework_dominant")).toBe(true);
  });

  it("high_defect_rate fires when defect rate > 0.05", () => {
    const o = executeFormula({
      totalProduced: 1000, scrapQuantity: 100, reworkQuantity: 50,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 20, reworkTimePerUnit: 0.5,
      defectRateTargetPct: 2, monthlyVolume: 1000, sourceConfidence: 0.8,
    });
    // defectRate = 150/1000 = 0.15 > 0.05
    const active = getActiveInsights(o, {
      totalProduced: 1000, scrapQuantity: 100, reworkQuantity: 50,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 20, reworkTimePerUnit: 0.5,
      defectRateTargetPct: 2, monthlyVolume: 1000, sourceConfidence: 0.8,
    }, CUR);
    expect(active.some((a) => a.id === "high_defect_rate")).toBe(true);
  });

  it("high_defect_rate does not fire when defect rate <= 0.05", () => {
    const o = executeFormula({
      totalProduced: 1000, scrapQuantity: 10, reworkQuantity: 5,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 20, reworkTimePerUnit: 0.5,
      defectRateTargetPct: 2, monthlyVolume: 1000, sourceConfidence: 0.8,
    });
    // defectRate = 15/1000 = 0.015 <= 0.05
    const active = getActiveInsights(o, {
      totalProduced: 1000, scrapQuantity: 10, reworkQuantity: 5,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 20, reworkTimePerUnit: 0.5,
      defectRateTargetPct: 2, monthlyVolume: 1000, sourceConfidence: 0.8,
    }, CUR);
    expect(active.some((a) => a.id === "high_defect_rate")).toBe(false);
  });

  it("target_achieved fires when defect rate <= target", () => {
    const o = executeFormula({
      totalProduced: 5000, scrapQuantity: 20, reworkQuantity: 30,
      unitMaterialCost: 50, unitLaborCost: 30,
      reworkLaborRate: 40, reworkTimePerUnit: 0.25,
      defectRateTargetPct: 3, monthlyVolume: 5000, sourceConfidence: 0.95,
    });
    const active = getActiveInsights(o, {
      totalProduced: 5000, scrapQuantity: 20, reworkQuantity: 30,
      unitMaterialCost: 50, unitLaborCost: 30,
      reworkLaborRate: 40, reworkTimePerUnit: 0.25,
      defectRateTargetPct: 3, monthlyVolume: 5000, sourceConfidence: 0.95,
    }, CUR);
    expect(active.some((a) => a.id === "target_achieved")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("scrap_dominant");
    expect(allIds).toContain("rework_dominant");
    expect(allIds).toContain("high_defect_rate");
    expect(allIds).toContain("target_achieved");
    expect(allIds).toContain("high_loss_per_unit");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("conservation: monthlyLoss = totalCost * (monthlyVol/totalProduced)", () => {
    const o = executeFormula({
      totalProduced: 5000, scrapQuantity: 100, reworkQuantity: 40,
      unitMaterialCost: 20, unitLaborCost: 10,
      reworkLaborRate: 30, reworkTimePerUnit: 0.5,
      defectRateTargetPct: 3, monthlyVolume: 2500, sourceConfidence: 0.8,
    });
    const totalCost = o.out_scrapCost + o.out_reworkCost;
    const expectedLoss = totalCost * (2500 / 5000);
    expect(o.out_monthlyQualityLoss).toBeCloseTo(expectedLoss, 4);
  });

  it("scrap/rework split equals total money at risk", () => {
    const o = executeFormula({
      totalProduced: 8000, scrapQuantity: 200, reworkQuantity: 60,
      unitMaterialCost: 30, unitLaborCost: 20,
      reworkLaborRate: 50, reworkTimePerUnit: 0.3,
      defectRateTargetPct: 4, monthlyVolume: 8000, sourceConfidence: 0.9,
    });
    const sum = o.out_scrapCost + o.out_reworkCost;
    expect(sum).toBeCloseTo(o.out_moneyAtRisk, 4);
  });

  it("zero totalProduced produces NaN for rate-based outputs (no crash)", () => {
    const o = executeFormula({
      totalProduced: 0, scrapQuantity: 50, reworkQuantity: 30,
      unitMaterialCost: 10, unitLaborCost: 5,
      reworkLaborRate: 20, reworkTimePerUnit: 0.25,
      defectRateTargetPct: 2, monthlyVolume: 1000, sourceConfidence: 0.7,
    });
    expect(o.out_scrapCost).toBeGreaterThan(0);
    expect(o.out_defectRate).toBeNaN();
    expect(o.out_monthlyQualityLoss).toBeNaN();
  });

  it("defectCostPerUnit = totalCost / totalDefectUnits", () => {
    const o = executeFormula({
      totalProduced: 5000, scrapQuantity: 100, reworkQuantity: 60,
      unitMaterialCost: 25, unitLaborCost: 15,
      reworkLaborRate: 40, reworkTimePerUnit: 0.5,
      defectRateTargetPct: 3, monthlyVolume: 5000, sourceConfidence: 0.9,
    });
    const totalCost = o.out_scrapCost + o.out_reworkCost;
    const expected = totalCost / o.out_totalDefectUnits;
    expect(o.out_defectCostPerUnit).toBeCloseTo(expected, 4);
  });
});
