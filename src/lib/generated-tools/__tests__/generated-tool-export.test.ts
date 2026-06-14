import { describe, expect, test } from "vitest";
import { serializeGeneratedToolCsv } from "@/lib/generated-tools/generated-tool-export";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";

const schema: GeneratedToolSchema = {
  toolName: "discount-calculator",
  inputs: [
    {
      id: "originalPrice",
      label: "Original price",
      type: "number",
      unit: "USD",
      default: 100,
      businessContext: "List price",
    },
  ],
  validation: { rules: [], thresholds: {} },
  formulas: {},
  outputs: {
    primary: "total",
    breakdown: { total: "total" },
    hiddenLossDrivers: [],
    suggestedActions: [],
    dataConfidenceAdjusted: "total",
  },
  premiumFeatures: [],
  premiumRequired: false,
};

const result: GeneratedToolResult = {
  breakdown: { total: 90 },
  hiddenLossDrivers: ["High discount"],
  suggestedActions: ["Review margin"],
  dataConfidenceAdjusted: 85,
  premiumRequired: false,
  premiumFeatures: [],
  total: 90,
};

describe("serializeGeneratedToolCsv", () => {
  test("includes inputs, breakdown, and narrative fields", () => {
    const csv = serializeGeneratedToolCsv({
      slug: "discount-calculator",
      title: "Discount Calculator",
      schema,
      inputs: { originalPrice: 100 },
      result,
    });

    expect(csv).toContain("Discount Calculator");
    expect(csv).toContain("Original price,100");
    expect(csv).toContain("total,90");
    expect(csv).toContain("High discount");
    expect(csv).toContain("Review margin");
  });
});
