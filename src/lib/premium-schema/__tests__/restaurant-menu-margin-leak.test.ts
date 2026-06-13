import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRestaurantMenuMarginLeak,
  type RestaurantMenuMarginLeakInputs,
} from "@/lib/premium-schema/calculators/restaurant-menu-margin-leak";
import { validateRestaurantMenuMarginLeakInputs } from "@/lib/premium-schema/calculators/restaurant-menu-margin-leak-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "restaurant-menu-margin-leak";
const PAID_ROUTE_SLUG = "menu-profit-leak-detector";

const defaultInputs: RestaurantMenuMarginLeakInputs = {
  monthlyRevenue: 38000,
  ingredientCost: 14500,
  deliveryAppFeePercent: 22,
  wasteRate: 6,
  targetFoodCostPercent: 32,
};

function expectValidationFailure(inputs: RestaurantMenuMarginLeakInputs): void {
  const validation = validateRestaurantMenuMarginLeakInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRestaurantMenuMarginLeak(inputs)).toThrow();
}

describe("restaurant-menu-margin-leak", () => {
  test("exact default oracle", () => {
    const result = calculateRestaurantMenuMarginLeak(defaultInputs);

    expect(result.foodCostPercent).toBeCloseTo(38.1579, 2);
    expect(result.deliveryFeeCost).toBeCloseTo(8360, 2);
    expect(result.wasteExposure).toBeCloseTo(870, 2);
    expect(result.totalMarginPressure).toBeCloseTo(62.4474, 2);
    expect(result.summaryLevel).toBe("critical");
    expect(result.primaryDriver).toBe("totalMarginPressure");
  });

  test("low threshold when total margin pressure is below 45 percent", () => {
    const result = calculateRestaurantMenuMarginLeak({
      monthlyRevenue: 50000,
      ingredientCost: 10000,
      deliveryAppFeePercent: 10,
      wasteRate: 2,
      targetFoodCostPercent: 32,
    });

    expect(result.totalMarginPressure).toBeLessThan(45);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when total margin pressure is between 45 and 55 percent", () => {
    const result = calculateRestaurantMenuMarginLeak({
      monthlyRevenue: 40000,
      ingredientCost: 12000,
      deliveryAppFeePercent: 18,
      wasteRate: 4,
      targetFoodCostPercent: 32,
    });

    expect(result.totalMarginPressure).toBeGreaterThanOrEqual(45);
    expect(result.totalMarginPressure).toBeLessThan(55);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when total margin pressure is at or above 55 percent", () => {
    const result = calculateRestaurantMenuMarginLeak(defaultInputs);

    expect(result.totalMarginPressure).toBeGreaterThanOrEqual(55);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid zero monthly revenue fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, monthlyRevenue: 0 });
  });

  test("invalid delivery fee above 100 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, deliveryAppFeePercent: 101 });
  });

  test("invalid negative ingredient cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, ingredientCost: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, wasteRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, targetFoodCostPercent: Number.POSITIVE_INFINITY });
  });

  test("elevated combined cost pressure emits warning", () => {
    const result = calculateRestaurantMenuMarginLeak(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Combined cost pressure is building")),
    ).toBe(true);
  });

  test("contract metadata matches restaurant menu margin leak slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "monthlyRevenue",
        "ingredientCost",
        "deliveryAppFeePercent",
        "wasteRate",
        "targetFoodCostPercent",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("totalMarginPressure");
    expect(assumptionText).toContain("deliveryFeeCost");
    expect(assumptionText).toContain("45");
    expect(assumptionText).toContain("55");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateRestaurantMenuMarginLeak(defaultInputs);

    const engineTotalMarginPressure = engineResult.outputs.find(
      (output) => output.id === "totalMarginPressure",
    )?.raw;
    const engineWasteExposure = engineResult.outputs.find(
      (output) => output.id === "wasteExposure",
    )?.raw;

    expect(engineTotalMarginPressure).toBeCloseTo(calculatorResult.totalMarginPressure, 2);
    expect(engineWasteExposure).toBeCloseTo(calculatorResult.wasteExposure, 2);
  });
});
