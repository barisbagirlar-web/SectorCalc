import { describe, expect, it } from "vitest";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";
import {
  inferUnitFromOutputKey,
  resolveBreakdownOutputUnit,
  resolvePrimaryOutputUnit,
} from "@/lib/features/generated-tools/resolve-output-unit";

function buildSchema(
  overrides: Partial<GeneratedToolSchema["outputs"]> = {},
  inputs: GeneratedToolSchema["inputs"] = [],
): GeneratedToolSchema {
  return {
    toolName: "test-tool",
    inputs,
    validation: { rules: [], thresholds: {} },
    formulas: {},
    outputs: {
      primary: "fileSizeMB",
      breakdown: {},
      hiddenLossDrivers: [],
      suggestedActions: [],
      dataConfidenceAdjusted: "fileSizeMB",
      ...overrides,
    },
    premiumFeatures: [],
    premiumRequired: false,
  };
}

describe("resolve-output-unit", () => {
  it("infers MB from fileSizeMB output key", () => {
    expect(inferUnitFromOutputKey("fileSizeMB")).toBe("MB");
    expect(resolvePrimaryOutputUnit(buildSchema())).toBe("MB");
  });

  it("prefers explicit outputs.unit over key inference", () => {
    expect(resolvePrimaryOutputUnit(buildSchema({ unit: "GiB" }))).toBe("GiB");
  });

  it("resolves breakdown units from key patterns", () => {
    const schema = buildSchema({
      primary: "fileSizeMB",
      breakdown: {
        fileSizeBytes: "File size (bytes)",
        printWidthInches: "Print width",
      },
    });

    expect(resolveBreakdownOutputUnit(schema, "fileSizeBytes")).toBe("bytes");
    expect(resolveBreakdownOutputUnit(schema, "printWidthInches")).toBe("in");
  });

  it("uses breakdownUnits when provided", () => {
    const schema = buildSchema({
      breakdownUnits: {
        total_pixels: "px",
      },
    });

    expect(resolveBreakdownOutputUnit(schema, "total_pixels")).toBe("px");
  });
});
