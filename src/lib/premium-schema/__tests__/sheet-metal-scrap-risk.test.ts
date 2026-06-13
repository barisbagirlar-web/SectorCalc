import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSheetMetalScrapRisk,
  type SheetMetalScrapRiskInputs,
} from "@/lib/premium-schema/calculators/sheet-metal-scrap-risk";
import { validateSheetMetalScrapRiskInputs } from "@/lib/premium-schema/calculators/sheet-metal-scrap-risk-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "sheet-metal-scrap-risk";

const defaultInputs: SheetMetalScrapRiskInputs = {
  materialCost: 9500,
  scrapRate: 8,
  targetScrapRate: 3,
  reworkHours: 14,
  laborRate: 38,
  finishingCost: 1200,
};

function expectValidationFailure(inputs: SheetMetalScrapRiskInputs): void {
  const validation = validateSheetMetalScrapRiskInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSheetMetalScrapRisk(inputs)).toThrow();
}

describe("sheet-metal-scrap-risk", () => {
  test("exact default oracle", () => {
    const result = calculateSheetMetalScrapRisk(defaultInputs);

    expect(result.excessScrapCost).toBeCloseTo(475, 2);
    expect(result.reworkCost).toBeCloseTo(532, 2);
    expect(result.finishingCost).toBeCloseTo(1200, 2);
    expect(result.totalExposure).toBeCloseTo(2207, 2);
    expect(result.summaryLevel).toBe("warning");
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("low threshold when scrap rate is below 5 percent", () => {
    const result = calculateSheetMetalScrapRisk({
      ...defaultInputs,
      scrapRate: 3,
    });

    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when scrap rate is between 5 and 10 percent", () => {
    const result = calculateSheetMetalScrapRisk(defaultInputs);

    expect(defaultInputs.scrapRate).toBeGreaterThanOrEqual(5);
    expect(defaultInputs.scrapRate).toBeLessThan(10);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when scrap rate is at or above 10 percent", () => {
    const result = calculateSheetMetalScrapRisk({
      ...defaultInputs,
      scrapRate: 12,
    });

    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid scrap rate above 100 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, scrapRate: 101 });
  });

  test("invalid negative material cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, materialCost: -1 });
  });

  test("invalid negative rework hours fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, reworkHours: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, laborRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, finishingCost: Number.POSITIVE_INFINITY });
  });

  test("elevated scrap rate emits warning", () => {
    const result = calculateSheetMetalScrapRisk(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Scrap rate is above target")),
    ).toBe(true);
  });

  test("contract metadata matches sheet metal scrap risk slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "materialCost",
        "scrapRate",
        "targetScrapRate",
        "reworkHours",
        "laborRate",
        "finishingCost",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("totalExposure");
    expect(assumptionText).toContain("scrapRate");
    expect(assumptionText).toContain("5");
    expect(assumptionText).toContain("10");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateSheetMetalScrapRisk(defaultInputs);

    const engineTotalExposure = engineResult.outputs.find(
      (output) => output.id === "totalExposure",
    )?.raw;
    const engineExcessScrapCost = engineResult.outputs.find(
      (output) => output.id === "excessScrapCost",
    )?.raw;

    expect(engineTotalExposure).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineExcessScrapCost).toBeCloseTo(calculatorResult.excessScrapCost, 2);
  });
});
