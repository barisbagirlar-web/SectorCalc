import { describe, expect, it } from "vitest";
import {
  buildTestInputFromSchema,
  validateCalculatorRuntimeResult,
} from "@/lib/features/generated-tools/runtime-validate-calculator";

describe("runtime-validate-calculator", () => {
  it("builds numeric defaults from schema inputs", () => {
    const input = buildTestInputFromSchema({
      inputs: [
        { id: "a", type: "number", default: 3 },
        { id: "b", type: "boolean", default: true },
        { id: "c", type: "select", options: ["low", "high"] },
      ],
    });

    expect(input).toEqual({ a: 3, b: true, c: "low" });
  });

  it("accepts generated calculator output shape", () => {
    expect(
      validateCalculatorRuntimeResult({
        totalWasteCost: 12.5,
        breakdown: {},
        hiddenLossDrivers: [],
        suggestedActions: [],
        dataConfidenceAdjusted: 12.5,
        premiumRequired: false,
        premiumFeatures: [],
      }).status,
    ).toBe("PASS");
  });

  it("rejects missing primary output", () => {
    expect(validateCalculatorRuntimeResult({ breakdown: {} }).status).toBe("FAIL");
  });

  it("rejects non-finite primary output", () => {
    expect(
      validateCalculatorRuntimeResult({
        totalWasteCost: Number.NaN,
      }).status,
    ).toBe("FAIL");
  });
});
