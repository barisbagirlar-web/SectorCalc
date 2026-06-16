import { describe, expect, it } from "vitest";
import { validateIndustrialSchema } from "@/lib/generated-tools/validate-industrial-schema";

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
};

describe("validateIndustrialSchema", () => {
  it("accepts a compilable multi-formula schema", () => {
    const result = validateIndustrialSchema(validSchema);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects missing units and businessContext", () => {
    const result = validateIndustrialSchema({
      ...validSchema,
      inputs: [{ id: "x", label: "X", type: "number" }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("unit"))).toBe(true);
  });

  it("rejects non-compilable formulas", () => {
    const result = validateIndustrialSchema({
      ...validSchema,
      formulas: { bad: "f(x)", ok: "inner_radius * 2" },
      outputs: { primary: "ok", breakdown: {} },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("forbidden") || e.includes("compile"))).toBe(true);
  });
});
