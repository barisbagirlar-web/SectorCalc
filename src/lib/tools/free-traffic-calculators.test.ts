import { describe, expect, test } from "vitest";
import {
  calculateFreeTrafficTool,
  hasDedicatedTrafficCalculator,
} from "@/lib/tools/free-traffic-calculators";
import {
  FREE_TRAFFIC_TOOLS,
  getFreeTrafficToolBySlug,
  listFreeTrafficSlugs,
} from "@/lib/tools/free-traffic-catalog";

describe("free-traffic-catalog", () => {
  test("contains 100 tools", () => {
    expect(FREE_TRAFFIC_TOOLS.length).toBe(100);
    expect(listFreeTrafficSlugs().length).toBe(100);
  });

  test("mortgage calculator returns payment", () => {
    const result = calculateFreeTrafficTool("mortgage-calculator", {
      principal: 200000,
      annualRate: 6,
      months: 360,
    });
    expect(result.isExpandedFormula).toBe(true);
    expect(result.primaryValue).toMatch(/\$/);
  });

  test("bmi calculator returns numeric BMI", () => {
    const result = calculateFreeTrafficTool("bmi-calculator", {
      weightKg: 70,
      heightM: 1.75,
    });
    expect(result.primaryValue).toBe("22.9");
  });

  test("generic shell does not fake numeric premium output", () => {
    const result = calculateFreeTrafficTool("tip-calculator", {
      bill: 50,
      tipPercent: 15,
    });
    expect(result.isExpandedFormula).toBe(false);
    expect(result.primaryValue).toBe("Inputs captured");
    expect(result.explanation).toContain("expanded");
  });

  test("hasDedicatedTrafficCalculator matches active set", () => {
    expect(hasDedicatedTrafficCalculator("mortgage-calculator")).toBe(true);
    expect(hasDedicatedTrafficCalculator("tip-calculator")).toBe(false);
  });

  test("every tool has 2-5 inputs with units", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      expect(tool.inputs.length).toBeGreaterThanOrEqual(2);
      expect(tool.inputs.length).toBeLessThanOrEqual(5);
      for (const input of tool.inputs) {
        expect(input.unit.length).toBeGreaterThan(0);
      }
    }
  });

  test("lookup by slug", () => {
    expect(getFreeTrafficToolBySlug("concrete-volume-calculator")?.title).toContain("Concrete");
  });
});
