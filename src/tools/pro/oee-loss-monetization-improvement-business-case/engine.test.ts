// SectorCalc — OEE Loss Monetization & Improvement Business Case — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, division-by-zero contract

import { describe, it, expect } from "vitest";
import { executeFormula, type OEELossOutputs } from
  "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 \u2014 Closed-form", () => {
  // ── S1: Normal production ───────────────────────────────────────────────
  // ppt=480, ot=420, not=380, vot=340, ict=45, tp=500, gp=470, hc=120, ic=25000, conf=0.85
  //
  // availability = 420/480 = 0.875
  // performance = (500*45)/380 = 22500/380 = 59.2105263
  // quality = 470/500 = 0.94
  // oee = 0.875 * 59.2105 * 0.94 = 48.6951
  //
  // availLoss = (480-420)*120 = 7200
  // perfLoss = (380-340)*120 = 4800
  // qualLoss = (500-470)*45*120/3600 = 45
  // totalLoss = 7200+4800+45 = 12045
  //
  // improvementValue = 12045*3*0.7 = 25294.5
  // roiRatio = 25294.5/25000 = 1.01178
  // decisionState: 25294.5 > 50000? No. 25294.5 > 25000? Yes => 1
  // thresholdCrossing: oee=48.7 < 0.85 => 1
  // fmeaTrigger: quality=0.94 < 0.95 => 1

  const S1 = {
    plannedProductionTime: 480, operatingTime: 420,
    netOperatingTime: 380, valuableOperatingTime: 340,
    idealCycleTime: 45, totalParts: 500, goodParts: 470,
    hourlyContribution: 120, improvementCost: 25000,
    sourceConfidence: 0.85,
  };

  it("S1: availability = 0.875", () => {
    expect(executeFormula(S1).out_availability).toBeCloseTo(0.875, 4);
  });
  it("S1: performance = 59.2105", () => {
    expect(executeFormula(S1).out_performance).toBeCloseTo(59.2105263, 4);
  });
  it("S1: quality = 0.94", () => {
    expect(executeFormula(S1).out_quality).toBeCloseTo(0.94, 4);
  });
  it("S1: avail loss value = 7200", () => {
    expect(executeFormula(S1).out_availability_loss_value).toBeCloseTo(7200, 2);
  });
  it("S1: perf loss value = 4800", () => {
    expect(executeFormula(S1).out_performance_loss_value).toBeCloseTo(4800, 2);
  });
  it("S1: qual loss value = 45", () => {
    expect(executeFormula(S1).out_quality_loss_value).toBeCloseTo(45, 2);
  });
  it("S1: total OEE loss = 12045", () => {
    expect(executeFormula(S1).out_total_oee_loss).toBeCloseTo(12045, 2);
  });
  it("S1: improvement value = 25294.5", () => {
    expect(executeFormula(S1).out_improvement_value).toBeCloseTo(25294.5, 2);
  });
  it("S1: roi ratio = 1.01178", () => {
    expect(executeFormula(S1).out_roi_ratio).toBeCloseTo(1.01178, 4);
  });
  it("S1: decision state = 1 (moderate case)", () => {
    expect(executeFormula(S1).out_decision_state).toBe(1);
  });
  // OEE score = 48.7 which is > 0.85 (threshold checks raw OEE score)
  it("S1: threshold crossing = 0 (OEE score above 0.85 threshold)", () => {
    expect(executeFormula(S1).out_threshold_crossing).toBe(0);
  });
  it("S1: fmea trigger = 1 (quality < 0.95)", () => {
    expect(executeFormula(S1).out_fmea_trigger).toBe(1);
  });

  // ── S2: World-class OEE ────────────────────────────────────────────────
  // ppt=480, ot=460, not=450, vot=445, ict=50, tp=540, gp=530, hc=100, ic=10000
  //
  // availability = 460/480 = 0.9583
  // performance = 540*50/450 = 27000/450 = 60
  // quality = 530/540 = 0.9815
  // oee = 0.9583*60*0.9815 = 56.44
  //
  // availLoss = (480-460)*100 = 2000
  // perfLoss = (450-445)*100 = 500
  // qualLoss = (540-530)*50*100/3600 = 13.8889
  // totalLoss = 2513.8889
  //
  // improvementValue = 2513.8889*3*0.7 = 5279.17
  // roiRatio = 5279.17/10000 = 0.5279
  // decisionState: 5279.17 > 20000? No. 5279.17 > 10000? No => 2

  const S2 = {
    plannedProductionTime: 480, operatingTime: 460,
    netOperatingTime: 450, valuableOperatingTime: 445,
    idealCycleTime: 50, totalParts: 540, goodParts: 530,
    hourlyContribution: 100, improvementCost: 10000,
    sourceConfidence: 0.95,
  };

  it("S2: availability = 0.9583", () => {
    expect(executeFormula(S2).out_availability).toBeCloseTo(0.9583, 4);
  });
  it("S2: quality = 0.9815", () => {
    expect(executeFormula(S2).out_quality).toBeCloseTo(0.9815, 4);
  });
  it("S2: total OEE loss = 2513.89", () => {
    expect(executeFormula(S2).out_total_oee_loss).toBeCloseTo(2513.89, 2);
  });
  it("S2: roi ratio = 0.5279", () => {
    expect(executeFormula(S2).out_roi_ratio).toBeCloseTo(0.5279, 4);
  });
  it("S2: decision state = 2 (weak case)", () => {
    expect(executeFormula(S2).out_decision_state).toBe(2);
  });

  // ── S3: Poor performance ───────────────────────────────────────────────
  // ppt=480, ot=300, not=250, vot=200, ict=60, tp=300, gp=240, hc=150, ic=50000
  //
  // availability = 300/480 = 0.625
  // performance = 300*60/250 = 18000/250 = 72
  // quality = 240/300 = 0.8
  // oee = 0.625*72*0.8 = 36
  //
  // availLoss = (480-300)*150 = 27000
  // perfLoss = (250-200)*150 = 7500
  // qualLoss = (300-240)*60*150/3600 = 150
  // totalLoss = 34650
  //
  // improvementValue = 34650*3*0.7 = 72765
  // roiRatio = 72765/50000 = 1.4553
  // decisionState: 72765 > 100000? No. 72765 > 50000? Yes => 1
  // fmeaTrigger: quality=0.8 < 0.95 => 1

  const S3 = {
    plannedProductionTime: 480, operatingTime: 300,
    netOperatingTime: 250, valuableOperatingTime: 200,
    idealCycleTime: 60, totalParts: 300, goodParts: 240,
    hourlyContribution: 150, improvementCost: 50000,
    sourceConfidence: 0.6,
  };

  it("S3: availability = 0.625", () => {
    expect(executeFormula(S3).out_availability).toBeCloseTo(0.625, 4);
  });
  it("S3: performance = 72", () => {
    expect(executeFormula(S3).out_performance).toBeCloseTo(72, 4);
  });
  it("S3: quality = 0.8", () => {
    expect(executeFormula(S3).out_quality).toBeCloseTo(0.8, 4);
  });
  it("S3: total OEE loss = 34650", () => {
    expect(executeFormula(S3).out_total_oee_loss).toBeCloseTo(34650, 2);
  });
  it("S3: improvement value = 72765", () => {
    expect(executeFormula(S3).out_improvement_value).toBeCloseTo(72765, 2);
  });
  it("S3: roi ratio = 1.4553", () => {
    expect(executeFormula(S3).out_roi_ratio).toBeCloseTo(1.4553, 4);
  });
  it("S3: decision state = 1 (moderate case)", () => {
    expect(executeFormula(S3).out_decision_state).toBe(1);
  });
  it("S3: fmea trigger = 1", () => {
    expect(executeFormula(S3).out_fmea_trigger).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: zero outputs for proportional fields, qualLoss=0, no crash", () => {
    const o = executeFormula({
      plannedProductionTime: 0, operatingTime: 0,
      netOperatingTime: 0, valuableOperatingTime: 0,
      idealCycleTime: 0, totalParts: 0, goodParts: 0,
      hourlyContribution: 0, improvementCost: 0,
      sourceConfidence: 0,
    });
    expect(o.out_availability).toBe(0);
    expect(o.out_performance).toBe(0);
    expect(o.out_quality).toBe(0);
    expect(o.out_oee_score).toBe(0);
    expect(o.out_availability_loss_value).toBe(0);
    expect(o.out_performance_loss_value).toBe(0);
    expect(o.out_quality_loss_value).toBe(0);
    expect(o.out_total_oee_loss).toBe(0);
    expect(o.out_improvement_value).toBe(0);
    expect(o.out_roi_ratio).toBe(0);
  });

  it("zero downtime but quality defects: only qualLossValue is positive", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 480,
      netOperatingTime: 480, valuableOperatingTime: 480,
      idealCycleTime: 60, totalParts: 500, goodParts: 450,
      hourlyContribution: 100, improvementCost: 5000,
      sourceConfidence: 0.9,
    });
    expect(o.out_availability_loss_value).toBe(0);
    expect(o.out_performance_loss_value).toBe(0);
    expect(o.out_quality_loss_value).toBeGreaterThan(0);
    // qualLoss = (500-450)*60*100/3600 = 83.33
    expect(o.out_quality_loss_value).toBeCloseTo(83.33, 2);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      plannedProductionTime: 1e6, operatingTime: 9e5,
      netOperatingTime: 8e5, valuableOperatingTime: 7e5,
      idealCycleTime: 5000, totalParts: 1e6, goodParts: 9.5e5,
      hourlyContribution: 5000, improvementCost: 1e7,
      sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof OEELossOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("negative operating time zero-guarded produces zero availability", () => {
    const o = executeFormula({
      plannedProductionTime: -100, operatingTime: -50,
      netOperatingTime: 100, valuableOperatingTime: 80,
      idealCycleTime: 10, totalParts: 100, goodParts: 90,
      hourlyContribution: 50, improvementCost: 1000,
      sourceConfidence: 0.5,
    });
    expect(o.out_availability).toBe(0);
    // performance still computed since netOperatingTime>0
    expect(o.out_performance).toBe(10);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 \u2014 Semantic insight rules", () => {
  const CUR = "$";

  it("low_oee fires when oee < 0.60", () => {
    // Use extreme netOperatingTime to force very low performance ratio
    // performance = 1*1/100000 = 0.00001 => oee = 1.0 * 0.00001 * 1.0 = 0.00001
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 480,
      netOperatingTime: 100000, valuableOperatingTime: 99000,
      idealCycleTime: 1, totalParts: 1, goodParts: 1,
      hourlyContribution: 150, improvementCost: 50000,
      sourceConfidence: 0.6,
    });
    // oee = 0.00001 < 0.60
    const active = getActiveInsights(o, {
      plannedProductionTime: 480, operatingTime: 480,
      netOperatingTime: 100000, valuableOperatingTime: 99000,
      idealCycleTime: 1, totalParts: 1, goodParts: 1,
      hourlyContribution: 150, improvementCost: 50000,
      sourceConfidence: 0.6,
    }, CUR);
    expect(active.some((a) => a.id === "low_oee")).toBe(true);
  });

  it("low_oee does not fire when oee >= 0.60", () => {
    // Perfect run: high efficiency
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 470,
      netOperatingTime: 465, valuableOperatingTime: 460,
      idealCycleTime: 50, totalParts: 558, goodParts: 555,
      hourlyContribution: 100, improvementCost: 5000,
      sourceConfidence: 0.95,
    });
    // performance = 558*50/465 = 60, oee ≈ 0.979*60*0.995 = 58.4... wait that's > 0.60
    // Actually with ict=50, performance = 60 which is >> 0.60 so oee well above 0.60
    const active = getActiveInsights(o, {
      plannedProductionTime: 480, operatingTime: 470,
      netOperatingTime: 465, valuableOperatingTime: 460,
      idealCycleTime: 50, totalParts: 558, goodParts: 555,
      hourlyContribution: 100, improvementCost: 5000,
      sourceConfidence: 0.95,
    }, CUR);
    expect(active.some((a) => a.id === "low_oee")).toBe(false);
  });

  it("availability_dominant_loss fires when avail > 50% of total loss", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 200,
      netOperatingTime: 460, valuableOperatingTime: 450,
      idealCycleTime: 60, totalParts: 500, goodParts: 490,
      hourlyContribution: 100, improvementCost: 10000,
      sourceConfidence: 0.9,
    });
    // availLoss = (480-200)*100 = 28000
    // perfLoss = (460-450)*100 = 1000
    // qualLoss = (500-490)*60*100/3600 = 16.67
    // total = 29016.67, avail% = 28000/29016.67 = 96.5% > 50%
    const active = getActiveInsights(o, {
      plannedProductionTime: 480, operatingTime: 200,
      netOperatingTime: 460, valuableOperatingTime: 450,
      idealCycleTime: 60, totalParts: 500, goodParts: 490,
      hourlyContribution: 100, improvementCost: 10000,
      sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "availability_dominant_loss")).toBe(true);
  });

  it("availability_dominant_loss does not fire when avail <= 50%", () => {
    // No downtime
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 480,
      netOperatingTime: 300, valuableOperatingTime: 200,
      idealCycleTime: 60, totalParts: 500, goodParts: 400,
      hourlyContribution: 100, improvementCost: 10000,
      sourceConfidence: 0.9,
    });
    // availLoss = 0 => 0% < 50%
    const active = getActiveInsights(o, {
      plannedProductionTime: 480, operatingTime: 480,
      netOperatingTime: 300, valuableOperatingTime: 200,
      idealCycleTime: 60, totalParts: 500, goodParts: 400,
      hourlyContribution: 100, improvementCost: 10000,
      sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "availability_dominant_loss")).toBe(false);
  });

  it("positive_roi fires when improvementValue > improvementCost", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 300,
      netOperatingTime: 250, valuableOperatingTime: 200,
      idealCycleTime: 60, totalParts: 300, goodParts: 240,
      hourlyContribution: 150, improvementCost: 50000,
      sourceConfidence: 0.9,
    });
    // improvementValue = 72765 > 50000 => roi=1.4553 > 1.0
    const active = getActiveInsights(o, {
      plannedProductionTime: 480, operatingTime: 300,
      netOperatingTime: 250, valuableOperatingTime: 200,
      idealCycleTime: 60, totalParts: 300, goodParts: 240,
      hourlyContribution: 150, improvementCost: 50000,
      sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "positive_roi")).toBe(true);
  });

  it("positive_roi does not fire when roi <= 1.0", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 470,
      netOperatingTime: 465, valuableOperatingTime: 460,
      idealCycleTime: 50, totalParts: 540, goodParts: 535,
      hourlyContribution: 100, improvementCost: 100000,
      sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      plannedProductionTime: 480, operatingTime: 470,
      netOperatingTime: 465, valuableOperatingTime: 460,
      idealCycleTime: 50, totalParts: 540, goodParts: 535,
      hourlyContribution: 100, improvementCost: 100000,
      sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "positive_roi")).toBe(false);
  });

  it("strong_business_case fires when roi > 3.0", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 200,
      netOperatingTime: 180, valuableOperatingTime: 120,
      idealCycleTime: 60, totalParts: 500, goodParts: 480,
      hourlyContribution: 200, improvementCost: 10000,
      sourceConfidence: 0.9,
    });
    // availLoss = (480-200)*200 = 56000
    // perfLoss = (180-120)*200 = 12000
    // qualLoss = (500-480)*60*200/3600 = 66.67
    // total = 68066.67
    // improvementValue = 68066.67*3*0.7 = 142940
    // roi = 142940/10000 = 14.29 > 3.0
    const active = getActiveInsights(o, {
      plannedProductionTime: 480, operatingTime: 200,
      netOperatingTime: 180, valuableOperatingTime: 120,
      idealCycleTime: 60, totalParts: 500, goodParts: 480,
      hourlyContribution: 200, improvementCost: 10000,
      sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "strong_business_case")).toBe(true);
  });

  it("confidence_warning fires when conf < 0.5", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 420,
      netOperatingTime: 380, valuableOperatingTime: 340,
      idealCycleTime: 45, totalParts: 500, goodParts: 470,
      hourlyContribution: 120, improvementCost: 25000,
      sourceConfidence: 0.3,
    });
    const active = getActiveInsights(o, {
      plannedProductionTime: 480, operatingTime: 420,
      netOperatingTime: 380, valuableOperatingTime: 340,
      idealCycleTime: 45, totalParts: 500, goodParts: 470,
      hourlyContribution: 120, improvementCost: 25000,
      sourceConfidence: 0.3,
    }, CUR);
    expect(active.some((a) => a.id === "confidence_warning")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("low_oee");
    expect(allIds).toContain("availability_dominant_loss");
    expect(allIds).toContain("positive_roi");
    expect(allIds).toContain("strong_business_case");
    expect(allIds).toContain("confidence_warning");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("conservation: totalOeeLoss = sum of loss components", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 350,
      netOperatingTime: 300, valuableOperatingTime: 250,
      idealCycleTime: 45, totalParts: 500, goodParts: 460,
      hourlyContribution: 120, improvementCost: 20000,
      sourceConfidence: 0.8,
    });
    const sum = o.out_availability_loss_value +
      o.out_performance_loss_value +
      o.out_quality_loss_value;
    expect(o.out_total_oee_loss).toBeCloseTo(sum, 4);
  });

  it("improvementValue = totalOeeLoss * 3 * 0.7", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 360,
      netOperatingTime: 320, valuableOperatingTime: 280,
      idealCycleTime: 50, totalParts: 400, goodParts: 380,
      hourlyContribution: 100, improvementCost: 15000,
      sourceConfidence: 0.8,
    });
    const expected = o.out_total_oee_loss * 3 * 0.7;
    expect(o.out_improvement_value).toBeCloseTo(expected, 4);
  });

  it("zero totalParts produces zero for quality-dependent outputs (no crash)", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 420,
      netOperatingTime: 380, valuableOperatingTime: 340,
      idealCycleTime: 45, totalParts: 0, goodParts: 0,
      hourlyContribution: 120, improvementCost: 25000,
      sourceConfidence: 0.8,
    });
    expect(o.out_quality).toBe(0);
    expect(o.out_quality_loss_value).toBe(0);
    expect(o.out_performance).toBe(0);
    expect(o.out_oee_score).toBe(0);
    // Avail and perf losses still compute
    expect(o.out_availability_loss_value).toBeGreaterThan(0);
    expect(o.out_performance_loss_value).toBeGreaterThan(0);
  });

  it("all losses zero when all time components equal", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 480,
      netOperatingTime: 480, valuableOperatingTime: 480,
      idealCycleTime: 60, totalParts: 500, goodParts: 500,
      hourlyContribution: 100, improvementCost: 5000,
      sourceConfidence: 0.9,
    });
    expect(o.out_availability_loss_value).toBe(0);
    expect(o.out_performance_loss_value).toBe(0);
    expect(o.out_quality_loss_value).toBe(0);
    expect(o.out_total_oee_loss).toBe(0);
    expect(o.out_improvement_value).toBe(0);
  });

  it("high improvement cost yields decision state = 2 (weak case)", () => {
    const o = executeFormula({
      plannedProductionTime: 480, operatingTime: 420,
      netOperatingTime: 380, valuableOperatingTime: 340,
      idealCycleTime: 45, totalParts: 500, goodParts: 470,
      hourlyContribution: 120, improvementCost: 1e9,
      sourceConfidence: 0.9,
    });
    // improvementValue fixed at 25294.5 << 2*1e9
    expect(o.out_decision_state).toBe(2);
  });
});
