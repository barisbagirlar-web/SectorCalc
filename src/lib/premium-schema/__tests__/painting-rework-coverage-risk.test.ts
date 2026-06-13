import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePaintingReworkCoverageRisk,
  type PaintingReworkCoverageRiskInputs,
} from "@/lib/premium-schema/calculators/painting-rework-coverage-risk";
import { validatePaintingReworkCoverageRiskInputs } from "@/lib/premium-schema/calculators/painting-rework-coverage-risk-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "painting-rework-coverage-risk";

const defaultInputs: PaintingReworkCoverageRiskInputs = {
  jobRevenue: 18500,
  paintMaterialCost: 3800,
  coverageDriftPercent: 6,
  prepReworkHours: 32,
  laborRate: 42,
  scaffoldCost: 1200,
};

function expectValidationFailure(inputs: PaintingReworkCoverageRiskInputs): void {
  const validation = validatePaintingReworkCoverageRiskInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePaintingReworkCoverageRisk(inputs)).toThrow();
}

describe("painting-rework-coverage-risk", () => {
  test("exact default oracle", () => {
    const result = calculatePaintingReworkCoverageRisk(defaultInputs);

    expect(result.coverageDriftCost).toBeCloseTo(228, 2);
    expect(result.prepReworkCost).toBeCloseTo(1344, 2);
    expect(result.totalExposure).toBeCloseTo(2772, 2);
    expect(result.marginPressure).toBeCloseTo(14.9838, 2);
    expect(result.summaryLevel).toBe("critical");
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("low threshold when margin pressure is below 5 percent", () => {
    const result = calculatePaintingReworkCoverageRisk({
      jobRevenue: 50000,
      paintMaterialCost: 3800,
      coverageDriftPercent: 3,
      prepReworkHours: 8,
      laborRate: 42,
      scaffoldCost: 500,
    });

    expect(result.marginPressure).toBeLessThan(5);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when margin pressure is between 5 and 12 percent", () => {
    const result = calculatePaintingReworkCoverageRisk({
      jobRevenue: 30000,
      paintMaterialCost: 3800,
      coverageDriftPercent: 6,
      prepReworkHours: 20,
      laborRate: 42,
      scaffoldCost: 800,
    });

    expect(result.marginPressure).toBeGreaterThanOrEqual(5);
    expect(result.marginPressure).toBeLessThan(12);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when margin pressure is at or above 12 percent", () => {
    const result = calculatePaintingReworkCoverageRisk(defaultInputs);

    expect(result.marginPressure).toBeGreaterThanOrEqual(12);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid zero job revenue fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, jobRevenue: 0 });
  });

  test("invalid coverage drift above 100 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, coverageDriftPercent: 101 });
  });

  test("invalid negative prep rework hours fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, prepReworkHours: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, laborRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, scaffoldCost: Number.POSITIVE_INFINITY });
  });

  test("elevated coverage drift emits warning", () => {
    const result = calculatePaintingReworkCoverageRisk(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Coverage drift is elevated")),
    ).toBe(true);
  });

  test("contract metadata matches painting rework coverage risk slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "jobRevenue",
        "paintMaterialCost",
        "coverageDriftPercent",
        "prepReworkHours",
        "laborRate",
        "scaffoldCost",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("marginPressure");
    expect(assumptionText).toContain("totalExposure");
    expect(assumptionText).toContain("5");
    expect(assumptionText).toContain("12");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculatePaintingReworkCoverageRisk(defaultInputs);

    const engineMarginPressure = engineResult.outputs.find(
      (output) => output.id === "marginPressure",
    )?.raw;
    const engineTotalExposure = engineResult.outputs.find(
      (output) => output.id === "totalExposure",
    )?.raw;

    expect(engineMarginPressure).toBeCloseTo(calculatorResult.marginPressure, 2);
    expect(engineTotalExposure).toBeCloseTo(calculatorResult.totalExposure, 2);
  });
});
