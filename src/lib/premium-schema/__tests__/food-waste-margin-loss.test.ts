import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFoodWasteMarginLoss,
  type FoodWasteMarginLossInputs,
} from "@/lib/premium-schema/calculators/food-waste-margin-loss";
import { validateFoodWasteMarginLossInputs } from "@/lib/premium-schema/calculators/food-waste-margin-loss-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "food-waste-margin-loss";

const defaultInputs: FoodWasteMarginLossInputs = {
  monthlyIngredientCost: 18000,
  wasteRate: 7,
  targetWasteRate: 3,
  monthlyRevenue: 42000,
  grossMargin: 62,
};

function expectValidationFailure(inputs: FoodWasteMarginLossInputs): void {
  const validation = validateFoodWasteMarginLossInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFoodWasteMarginLoss(inputs)).toThrow();
}

describe("food-waste-margin-loss", () => {
  test("exact default oracle", () => {
    const result = calculateFoodWasteMarginLoss(defaultInputs);

    expect(result.wasteExposure).toBeCloseTo(1260, 2);
    expect(result.excessWasteCost).toBeCloseTo(720, 2);
    expect(result.marginPressure).toBeCloseTo(1.7143, 2);
    expect(result.summaryLevel).toBe("warning");
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("low threshold when margin pressure is below 1 percent", () => {
    const result = calculateFoodWasteMarginLoss({
      monthlyIngredientCost: 10000,
      wasteRate: 3.5,
      targetWasteRate: 3,
      monthlyRevenue: 100000,
      grossMargin: 62,
    });

    expect(result.marginPressure).toBeLessThan(1);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when margin pressure is between 1 and 3 percent", () => {
    const result = calculateFoodWasteMarginLoss(defaultInputs);

    expect(result.marginPressure).toBeGreaterThanOrEqual(1);
    expect(result.marginPressure).toBeLessThan(3);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when margin pressure is at or above 3 percent", () => {
    const result = calculateFoodWasteMarginLoss({
      ...defaultInputs,
      wasteRate: 10,
    });

    expect(result.marginPressure).toBeGreaterThanOrEqual(3);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid zero monthly revenue fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, monthlyRevenue: 0 });
  });

  test("invalid waste rate above 100 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, wasteRate: 101 });
  });

  test("invalid negative ingredient cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, monthlyIngredientCost: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, grossMargin: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, targetWasteRate: Number.POSITIVE_INFINITY });
  });

  test("elevated waste rate emits warning", () => {
    const result = calculateFoodWasteMarginLoss(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Waste rate is above target")),
    ).toBe(true);
  });

  test("contract metadata matches food waste margin loss slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "monthlyIngredientCost",
        "wasteRate",
        "targetWasteRate",
        "monthlyRevenue",
        "grossMargin",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("marginPressure");
    expect(assumptionText).toContain("excessWasteCost");
    expect(assumptionText).toContain("1");
    expect(assumptionText).toContain("3");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateFoodWasteMarginLoss(defaultInputs);

    const engineMarginPressure = engineResult.outputs.find(
      (output) => output.id === "marginPressure",
    )?.raw;
    const engineExcessWasteCost = engineResult.outputs.find(
      (output) => output.id === "excessWasteCost",
    )?.raw;

    expect(engineMarginPressure).toBeCloseTo(calculatorResult.marginPressure, 2);
    expect(engineExcessWasteCost).toBeCloseTo(calculatorResult.excessWasteCost, 2);
  });
});
