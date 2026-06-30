import { describe, expect, it } from "vitest";
import { applyIndustrialSchemaAutoFix } from "@/lib/features/generated-tools/industrial-schema-auto-fix";
import { validateIndustrialSchema } from "@/lib/features/generated-tools/validate-industrial-schema";

describe("industrial-schema-auto-fix", () => {
  it("maps expression primary output to formula key", () => {
    const schema: Record<string, unknown> = {
      toolName: "1-percent-rule-calculator",
      inputs: [
        { id: "a", label: "A", type: "number", unit: "x", default: 1, businessContext: "A input" },
        { id: "b", label: "B", type: "number", unit: "x", default: 1, businessContext: "B input" },
        { id: "c", label: "C", type: "number", unit: "x", default: 1, businessContext: "C input" },
      ],
      formulas: {
        total: "a + b",
        ratio: "total / c",
      },
      outputs: {
        primary: "a + b > c ? 1 : 0",
        breakdown: [],
      },
    };

    applyIndustrialSchemaAutoFix(schema, "1-percent-rule-calculator");
    const formulas = schema.formulas as Record<string, string>;
    expect(formulas.result).toBe("a + b > c ? 1 : 0");
    expect((schema.outputs as Record<string, string>).primary).toBe("result");
  });

  it("creates formulas from empty formula object and expression primary", () => {
    const schema: Record<string, unknown> = {
      toolName: "3d-vector-calculator",
      inputs: [
        { id: "v1x", label: "V1X", type: "number", unit: "", default: 1, businessContext: "x" },
        { id: "v1y", label: "V1Y", type: "number", unit: "", default: 1, businessContext: "y" },
        { id: "v1z", label: "V1Z", type: "number", unit: "", default: 1, businessContext: "z" },
      ],
      formulas: {},
      outputs: {
        primary: "v1x * v1y + v1z * v1x - v1y * v1z",
        breakdown: [],
      },
    };

    applyIndustrialSchemaAutoFix(schema, "3d-vector-calculator");
    const validation = validateIndustrialSchema(schema);
    expect(validation.valid).toBe(true);
  });
});
