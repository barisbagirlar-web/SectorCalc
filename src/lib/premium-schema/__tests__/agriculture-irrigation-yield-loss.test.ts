import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAgricultureIrrigationYieldLoss,
  type AgricultureIrrigationYieldLossInputs,
} from "@/lib/premium-schema/calculators/agriculture-irrigation-yield-loss";
import {
  validateAgricultureIrrigationYieldLossInputs,
} from "@/lib/premium-schema/calculators/agriculture-irrigation-yield-loss-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "agriculture-irrigation-yield-loss";

const defaultInputs: AgricultureIrrigationYieldLossInputs = {
  areaHa: 18,
  expectedYieldTonPerHa: 7,
  actualYieldTonPerHa: 6.2,
  pricePerTon: 230,
  irrigationCost: 3400,
};

function expectValidationFailure(inputs: AgricultureIrrigationYieldLossInputs): void {
  const validation = validateAgricultureIrrigationYieldLossInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAgricultureIrrigationYieldLoss(inputs)).toThrow();
}

describe("agriculture-irrigation-yield-loss", () => {
  test("exact default oracle", () => {
    const result = calculateAgricultureIrrigationYieldLoss(defaultInputs);

    expect(result.yieldGapTonPerHa).toBeCloseTo(0.8, 2);
    expect(result.lostYieldTon).toBeCloseTo(14.4, 2);
    expect(result.yieldLossRevenue).toBeCloseTo(3312, 2);
    expect(result.totalExposure).toBeCloseTo(6712, 2);
    expect(result.exposurePerHa).toBeCloseTo(372.8888888888889, 2);
    expect(result.yieldLossPct).toBeCloseTo(11.428571428571429, 2);
    expect(result.summaryLevel).toBe("warning");
    expect(result.primaryDriver).toBe("irrigationCost");
  });

  test("low threshold when totalExposure is below 3000", () => {
    const result = calculateAgricultureIrrigationYieldLoss({
      areaHa: 10,
      expectedYieldTonPerHa: 7,
      actualYieldTonPerHa: 7,
      pricePerTon: 100,
      irrigationCost: 500,
    });

    expect(result.totalExposure).toBeLessThan(3000);
    expect(result.summaryLevel).toBe("low");
  });

  test("critical threshold when totalExposure is at or above 8000", () => {
    const result = calculateAgricultureIrrigationYieldLoss({
      areaHa: 40,
      expectedYieldTonPerHa: 10,
      actualYieldTonPerHa: 5,
      pricePerTon: 230,
      irrigationCost: 5000,
    });

    expect(result.totalExposure).toBeGreaterThanOrEqual(8000);
    expect(result.summaryLevel).toBe("critical");
  });

  test("actual yield above expected treats yield loss as zero", () => {
    const result = calculateAgricultureIrrigationYieldLoss({
      areaHa: 18,
      expectedYieldTonPerHa: 6,
      actualYieldTonPerHa: 7,
      pricePerTon: 230,
      irrigationCost: 3400,
    });

    expect(result.yieldGapTonPerHa).toBe(0);
    expect(result.lostYieldTon).toBe(0);
    expect(result.yieldLossRevenue).toBe(0);
    expect(result.totalExposure).toBe(3400);
    expect(result.warnings.some((warning) => warning.includes("above expected yield"))).toBe(true);
  });

  test("invalid area fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, areaHa: 0 });
    expectValidationFailure({ ...defaultInputs, areaHa: -1 });
  });

  test("invalid expected yield fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, expectedYieldTonPerHa: 0 });
    expectValidationFailure({ ...defaultInputs, expectedYieldTonPerHa: -2 });
  });

  test("invalid actual yield fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, actualYieldTonPerHa: -0.1 });
  });

  test("invalid price fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, pricePerTon: 0 });
    expectValidationFailure({ ...defaultInputs, pricePerTon: -10 });
  });

  test("invalid irrigation cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, irrigationCost: -1 });
  });

  test("non-finite input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, areaHa: Number.NaN });
    expectValidationFailure({ ...defaultInputs, pricePerTon: Number.POSITIVE_INFINITY });
  });

  test("irrigation cost greater than yield loss emits warning", () => {
    const result = calculateAgricultureIrrigationYieldLoss(defaultInputs);

    expect(result.yieldLossRevenue).toBeLessThan(result.irrigationCost);
    expect(
      result.warnings.some((warning) => warning.includes("Irrigation cost is higher than estimated yield-loss revenue")),
    ).toBe(true);
  });

  test("yield loss pct above 40 emits warning", () => {
    const result = calculateAgricultureIrrigationYieldLoss({
      areaHa: 20,
      expectedYieldTonPerHa: 10,
      actualYieldTonPerHa: 5,
      pricePerTon: 200,
      irrigationCost: 1000,
    });

    expect(result.yieldLossPct).toBeGreaterThan(40);
    expect(
      result.warnings.some((warning) => warning.includes("Yield gap exceeds 40 percent")),
    ).toBe(true);
  });

  test("contract metadata matches agriculture irrigation yield-loss slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "areaHa",
        "expectedYieldTonPerHa",
        "actualYieldTonPerHa",
        "pricePerTon",
        "irrigationCost",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("yieldGapTonPerHa");
    expect(assumptionText).toContain("yieldLossRevenue");
    expect(assumptionText).toContain("totalExposure");
    expect(assumptionText).toContain("3000");
    expect(assumptionText).toContain("8000");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateAgricultureIrrigationYieldLoss(defaultInputs);

    const engineYieldLossRevenue = engineResult.outputs.find(
      (output) => output.id === "yieldLossRevenue",
    )?.raw;
    const engineTotalExposure = engineResult.outputs.find(
      (output) => output.id === "totalExposure",
    )?.raw;

    expect(engineYieldLossRevenue).toBeCloseTo(calculatorResult.yieldLossRevenue, 2);
    expect(engineTotalExposure).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(calculatorResult.yieldLossRevenue).toBeCloseTo(3312, 2);
    expect(calculatorResult.totalExposure).toBeCloseTo(6712, 2);
  });
});
