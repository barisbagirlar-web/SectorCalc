import { describe, expect, it } from "vitest";
import {
  isStubSumFormula,
  validateIndustrialSchema,
} from "@/lib/features/generated-tools/validate-industrial-schema";

describe("isStubSumFormula", () => {
  it("detects input-only sum placeholders", () => {
    expect(isStubSumFormula("a + b + c", ["a", "b", "c"])).toBe(true);
    expect(isStubSumFormula("num_workers_exposed + avg_daily_exposure_hours + noise_level_dba", [
      "num_workers_exposed",
      "avg_daily_exposure_hours",
      "noise_level_dba",
      "vibration_level_ms2",
    ])).toBe(true);
  });

  it("allows real arithmetic", () => {
    expect(isStubSumFormula("a * b + c / d", ["a", "b", "c", "d"])).toBe(false);
  });
});

describe("validateIndustrialSchema", () => {
  it("quarantines stub cost tools via industrial errors", () => {
    const result = validateIndustrialSchema({
      toolName: "noise-vibration-cost-calculator",
      title: "Noise & Vibration Cost Calculator",
      description: "Quantify total cost of noise and vibration",
      inputs: [
        { id: "a", unit: "workers", businessContext: "x" },
        { id: "b", unit: "hours", businessContext: "x" },
        { id: "c", unit: "dB(A)", businessContext: "x" },
        { id: "d", unit: "m/s²", businessContext: "x" },
      ],
      formulas: {
        result: "a + b + c",
        result_copy: "a + b + c",
      },
      outputs: { primary: "result", unit: "workers" },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("stub sum placeholder"))).toBe(true);
    expect(result.errors.some((e) => e.includes("output unit mismatch"))).toBe(true);
  });
});
