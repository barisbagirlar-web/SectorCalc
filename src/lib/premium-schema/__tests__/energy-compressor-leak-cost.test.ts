import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEnergyCompressorLeakCost,
  type EnergyCompressorLeakCostInputs,
} from "@/lib/premium-schema/calculators/energy-compressor-leak-cost";
import { validateEnergyCompressorLeakCostInputs } from "@/lib/premium-schema/calculators/energy-compressor-leak-cost-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "energy-compressor-leak-cost";

const defaultInputs: EnergyCompressorLeakCostInputs = {
  compressorKw: 45,
  leakPercent: 12,
  operatingHours: 360,
  energyRate: 0.14,
};

function expectValidationFailure(inputs: EnergyCompressorLeakCostInputs): void {
  const validation = validateEnergyCompressorLeakCostInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEnergyCompressorLeakCost(inputs)).toThrow();
}

describe("energy-compressor-leak-cost", () => {
  test("exact default oracle", () => {
    const result = calculateEnergyCompressorLeakCost(defaultInputs);

    expect(result.leakKwh).toBeCloseTo(1944, 2);
    expect(result.monthlyLeakCost).toBeCloseTo(272.16, 2);
    expect(result.annualLeakCost).toBeCloseTo(3265.92, 2);
    expect(result.summaryLevel).toBe("low");
    expect(result.primaryDriver).toBe("monthlyLeakCost");
  });

  test("low threshold when monthly leak cost is below 500", () => {
    const result = calculateEnergyCompressorLeakCost(defaultInputs);

    expect(result.monthlyLeakCost).toBeLessThan(500);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when monthly leak cost is between 500 and 1500", () => {
    const result = calculateEnergyCompressorLeakCost({
      compressorKw: 80,
      leakPercent: 15,
      operatingHours: 400,
      energyRate: 0.14,
    });

    expect(result.monthlyLeakCost).toBeGreaterThanOrEqual(500);
    expect(result.monthlyLeakCost).toBeLessThan(1500);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when monthly leak cost is at or above 1500", () => {
    const result = calculateEnergyCompressorLeakCost({
      compressorKw: 100,
      leakPercent: 25,
      operatingHours: 600,
      energyRate: 0.15,
    });

    expect(result.monthlyLeakCost).toBeGreaterThanOrEqual(1500);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid negative leak percent fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, leakPercent: -1 });
  });

  test("invalid leak percent above 100 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, leakPercent: 101 });
  });

  test("invalid negative operating hours fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, operatingHours: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, compressorKw: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, energyRate: Number.POSITIVE_INFINITY });
  });

  test("elevated leak percent emits warning", () => {
    const result = calculateEnergyCompressorLeakCost(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("above typical industrial band")),
    ).toBe(true);
  });

  test("contract metadata matches energy compressor leak cost slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining(["compressorKw", "leakPercent", "operatingHours", "energyRate"]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("monthlyLeakCost");
    expect(assumptionText).toContain("annualLeakCost");
    expect(assumptionText).toContain("500");
    expect(assumptionText).toContain("1500");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateEnergyCompressorLeakCost(defaultInputs);

    const engineMonthlyLeakCost = engineResult.outputs.find(
      (output) => output.id === "monthlyLeakCost",
    )?.raw;
    const engineAnnualLeakCost = engineResult.outputs.find(
      (output) => output.id === "annualLeakCost",
    )?.raw;

    expect(engineMonthlyLeakCost).toBeCloseTo(calculatorResult.monthlyLeakCost, 2);
    expect(engineAnnualLeakCost).toBeCloseTo(calculatorResult.annualLeakCost, 2);
  });
});
