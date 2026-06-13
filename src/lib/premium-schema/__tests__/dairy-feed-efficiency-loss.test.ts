import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateDairyFeedEfficiencyLoss,
  type DairyFeedEfficiencyLossInputs,
} from "@/lib/premium-schema/calculators/dairy-feed-efficiency-loss";
import { validateDairyFeedEfficiencyLossInputs } from "@/lib/premium-schema/calculators/dairy-feed-efficiency-loss-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "dairy-feed-efficiency-loss";

const defaultInputs: DairyFeedEfficiencyLossInputs = {
  cows: 80,
  feedCostPerCowPerDay: 6.5,
  milkLitersPerCowPerDay: 24,
  targetMilkLitersPerCowPerDay: 28,
  milkPricePerLiter: 0.42,
  days: 30,
};

function expectValidationFailure(inputs: DairyFeedEfficiencyLossInputs): void {
  const validation = validateDairyFeedEfficiencyLossInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateDairyFeedEfficiencyLoss(inputs)).toThrow();
}

describe("dairy-feed-efficiency-loss", () => {
  test("exact default oracle", () => {
    const result = calculateDairyFeedEfficiencyLoss(defaultInputs);

    expect(result.feedCost).toBeCloseTo(15600, 2);
    expect(result.milkRevenueGap).toBeCloseTo(4032, 2);
    expect(result.totalExposure).toBeCloseTo(19632, 2);
    expect(result.summaryLevel).toBe("low");
    expect(result.primaryDriver).toBe("feedCost");
  });

  test("low threshold when milk yield is above 22 liters", () => {
    const result = calculateDairyFeedEfficiencyLoss(defaultInputs);

    expect(defaultInputs.milkLitersPerCowPerDay).toBeGreaterThan(22);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when milk yield is between 18 and 22 liters", () => {
    const result = calculateDairyFeedEfficiencyLoss({
      ...defaultInputs,
      milkLitersPerCowPerDay: 20,
    });

    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when milk yield is at or below 18 liters", () => {
    const result = calculateDairyFeedEfficiencyLoss({
      ...defaultInputs,
      milkLitersPerCowPerDay: 18,
    });

    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid zero cows fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, cows: 0 });
  });

  test("invalid negative feed cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, feedCostPerCowPerDay: -1 });
  });

  test("invalid zero days fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, days: 0 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, milkPricePerLiter: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, targetMilkLitersPerCowPerDay: Number.POSITIVE_INFINITY });
  });

  test("yield below target emits warning", () => {
    const result = calculateDairyFeedEfficiencyLoss(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Actual yield is below target")),
    ).toBe(true);
  });

  test("contract metadata matches dairy feed efficiency loss slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "cows",
        "feedCostPerCowPerDay",
        "milkLitersPerCowPerDay",
        "targetMilkLitersPerCowPerDay",
        "milkPricePerLiter",
        "days",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("feedCost");
    expect(assumptionText).toContain("milkRevenueGap");
    expect(assumptionText).toContain("22");
    expect(assumptionText).toContain("18");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateDairyFeedEfficiencyLoss(defaultInputs);

    const engineFeedCost = engineResult.outputs.find((output) => output.id === "feedCost")?.raw;
    const engineTotalExposure = engineResult.outputs.find(
      (output) => output.id === "totalExposure",
    )?.raw;

    expect(engineFeedCost).toBeCloseTo(calculatorResult.feedCost, 2);
    expect(engineTotalExposure).toBeCloseTo(calculatorResult.totalExposure, 2);
  });
});
