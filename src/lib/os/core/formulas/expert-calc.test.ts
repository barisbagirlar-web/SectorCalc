import { describe, expect, test } from "vitest";
import {
  buildExpertFieldSpecs,
  resolveExpertInputs,
  runExpertCalculation,
} from "@/lib/os/core/formulas/expert-calc";

describe("runExpertCalculation", () => {
  test("CNC on-target inputs → accept verdict", () => {
    const result = runExpertCalculation({
      sectorId: "cnc",
      values: {
        Ideal_Cycle_Time: 10,
        Actual_Cycle_Time: 10,
        Machine_Rate: 75,
      },
      region: "EN",
      locale: "en",
      tier: "premium",
    });

    expect(result.physics.passed).toBe(true);
    expect(result.verdict.severity).toBe("accept");
    expect(result.efficiencyScore).toBe(100);
    expect(result.premium?.logicTerms).toHaveLength(5);
  });

  test("TR region applies premium hidden layer when features enabled", () => {
    const en = runExpertCalculation({
      sectorId: "cnc",
      values: {
        Ideal_Cycle_Time: 10,
        Actual_Cycle_Time: 14,
        Machine_Rate: 100,
      },
      region: "EN",
      locale: "en",
      tier: "premium",
    });

    const tr = runExpertCalculation({
      sectorId: "cnc",
      values: {
        Ideal_Cycle_Time: 10,
        Actual_Cycle_Time: 14,
        Machine_Rate: 100,
      },
      region: "TR",
      locale: "tr",
      tier: "premium",
    });

    expect(tr.totalImpact).toBeGreaterThan(en.totalImpact);
    expect(tr.verdict.severity).not.toBe("accept");
  });

  test("free tier withholds premium logic detail", () => {
    const result = runExpertCalculation({
      sectorId: "logistics",
      values: {
        Planned_KM: 100,
        Actual_KM: 120,
        Fuel_Price: 2.5,
      },
      region: "EN",
      locale: "en",
      tier: "free",
    });

    expect(result.premium).toBeNull();
    expect(result.physics.passed).toBe(true);
  });

  test("physics rejects invalid rate", () => {
    const result = runExpertCalculation({
      sectorId: "cnc",
      values: {
        Ideal_Cycle_Time: 10,
        Actual_Cycle_Time: 10,
        Machine_Rate: 0,
      },
      region: "EN",
      locale: "en",
    });

    expect(result.physics.passed).toBe(false);
    expect(result.verdict.severity).toBe("reject");
  });

  test("buildExpertFieldSpecs returns 3 registry params", () => {
    const fields = buildExpertFieldSpecs("construction");
    expect(fields).toHaveLength(3);
    expect(fields[0]?.kind).toBe("target");
  });

  test("resolveExpertInputs maps param keys", () => {
    const inputs = resolveExpertInputs("logistics", {
      Planned_KM: 50,
      Actual_KM: 55,
      Fuel_Price: 3,
    });
    expect(inputs.target).toBe(50);
    expect(inputs.actual).toBe(55);
    expect(inputs.rate).toBe(3);
  });
});
