import { describe, expect, test } from "vitest";
import {
  ACTION_PLAN_VARIANCE_THRESHOLD,
  IntelligenceLayer,
  buildSectorIntelligence,
  calculateCarbonImpact,
  calculateHiddenLoss,
  generateActionPlan,
} from "@/lib/os/core/intelligence-layer";

describe("IntelligenceLayer", () => {
  test("calculateHiddenLoss applies sector multipliers", () => {
    expect(calculateHiddenLoss("cnc", 1000)).toBe(150);
    expect(calculateHiddenLoss("logistics", 1000)).toBe(250);
    expect(calculateHiddenLoss("construction", 1000)).toBe(200);
    expect(calculateHiddenLoss("textile", 1000)).toBe(100);
  });

  test("generateActionPlan triggers calibration above threshold", () => {
    const critical = generateActionPlan(ACTION_PLAN_VARIANCE_THRESHOLD + 0.01);
    expect(critical.code).toBe("IMMEDIATE_CALIBRATION");
    expect(critical.message).toContain("ACTION");

    const stable = generateActionPlan(0.05);
    expect(stable.code).toBe("MONITOR_OPTIMAL");
    expect(stable.message).toContain("STATUS");
  });

  test("calculateCarbonImpact uses sector emission factors", () => {
    expect(calculateCarbonImpact("textile", 100)).toBe(80);
    expect(calculateCarbonImpact("metalworking", 100)).toBeCloseTo(220);
    expect(calculateCarbonImpact("cnc", 100)).toBe(100);
  });

  test("buildSectorIntelligence composes full brief", () => {
    const brief = buildSectorIntelligence("cnc", 100, 120, 50);

    expect(brief.varianceRatio).toBeCloseTo(0.2);
    expect(brief.hiddenLoss).toBe(7.5);
    expect(brief.carbonImpact).toBe(120);
    expect(brief.actionPlan.code).toBe("IMMEDIATE_CALIBRATION");
  });

  test("IntelligenceLayer object exposes core APIs", () => {
    expect(IntelligenceLayer.calculateHiddenLoss("logistics", 200)).toBe(50);
    expect(IntelligenceLayer.generateActionPlan(0).code).toBe("MONITOR_OPTIMAL");
  });
});
