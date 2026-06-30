import { describe, expect, it } from "vitest";
import { measureFallbackRate, shouldTriggerSelfHeal } from "@/lib/core/steelcore/fallback-metrics";
import { validateSchemaRecord } from "@/lib/core/steelcore/schema-validator";
import { validateStructuralSchema } from "@/lib/core/steelcore/structural-validator";

const validSchema = {
  toolName: "pressure-vessel-thickness",
  inputs: [
    {
      id: "operating_pressure",
      label: "Operating Pressure",
      type: "number",
      unit: "MPa",
      default: 1,
      businessContext: "Internal design pressure per ASME Section VIII.",
    },
    {
      id: "inner_radius",
      label: "Inner Radius",
      type: "number",
      unit: "mm",
      default: 500,
      businessContext: "Vessel inner radius.",
    },
    {
      id: "allowable_stress",
      label: "Allowable Stress",
      type: "number",
      unit: "MPa",
      default: 138,
      businessContext: "Material allowable stress.",
    },
  ],
  formulas: {
    t_min: "(operating_pressure * inner_radius) / allowable_stress",
    t_design: "t_min + 3",
  },
  outputs: { primary: "t_design", breakdown: { t_min: "t min", t_design: "t design" } },
  category: "Üretim & İmalat",
  sector: "Makine & Metal",
};

describe("SteelCore structural validator", () => {
  it("accepts a well-formed calculator schema", () => {
    expect(validateStructuralSchema(validSchema)).toHaveLength(0);
  });

  it("rejects missing required top-level fields", () => {
    const errors = validateStructuralSchema({ toolName: "x", inputs: [] });
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe("SteelCore schema validator", () => {
  it("marks industrial-valid schemas as valid", () => {
    const result = validateSchemaRecord(validSchema, "pressure-vessel-thickness-schema.json");
    expect(result.valid).toBe(true);
    expect(result.trustStatus).toBe("PASS");
  });
});

describe("SteelCore fallback metrics", () => {
  it("flags unhealthy fallback rates", () => {
    const metrics = {
      timestamp: new Date().toISOString(),
      total: 100,
      fallbackCount: 5,
      ratePercent: 5,
      thresholdPercent: 1,
      healthy: false,
    };
    expect(shouldTriggerSelfHeal(metrics)).toBe(true);
  });

  it("accepts healthy fallback rates", () => {
    const metrics = measureFallbackRate("/path/does/not/exist");
    expect(metrics.total).toBe(0);
    expect(metrics.healthy).toBe(true);
  });
});
