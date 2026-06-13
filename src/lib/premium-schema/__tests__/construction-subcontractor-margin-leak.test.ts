import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateConstructionSubcontractorMarginLeak,
  type ConstructionSubcontractorMarginLeakInputs,
} from "@/lib/premium-schema/calculators/construction-subcontractor-margin-leak";
import { validateConstructionSubcontractorMarginLeakInputs } from "@/lib/premium-schema/calculators/construction-subcontractor-margin-leak-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "construction-subcontractor-margin-leak";

const defaultInputs: ConstructionSubcontractorMarginLeakInputs = {
  contractValue: 185000,
  plannedSubcontractorCost: 72000,
  actualSubcontractorCost: 81500,
  delayCost: 6500,
  materialVariance: 4200,
};

function expectValidationFailure(inputs: ConstructionSubcontractorMarginLeakInputs): void {
  const validation = validateConstructionSubcontractorMarginLeakInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateConstructionSubcontractorMarginLeak(inputs)).toThrow();
}

describe("construction-subcontractor-margin-leak", () => {
  test("exact default oracle", () => {
    const result = calculateConstructionSubcontractorMarginLeak(defaultInputs);

    expect(result.subcontractorVariance).toBeCloseTo(9500, 2);
    expect(result.totalExposure).toBeCloseTo(20200, 2);
    expect(result.marginPressure).toBeCloseTo(10.9189, 2);
    expect(result.summaryLevel).toBe("critical");
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("low threshold when margin pressure is below 3 percent", () => {
    const result = calculateConstructionSubcontractorMarginLeak({
      contractValue: 500000,
      plannedSubcontractorCost: 72000,
      actualSubcontractorCost: 73000,
      delayCost: 1000,
      materialVariance: 500,
    });

    expect(result.marginPressure).toBeLessThan(3);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when margin pressure is between 3 and 7 percent", () => {
    const result = calculateConstructionSubcontractorMarginLeak({
      contractValue: 300000,
      plannedSubcontractorCost: 72000,
      actualSubcontractorCost: 78000,
      delayCost: 4000,
      materialVariance: 2000,
    });

    expect(result.marginPressure).toBeGreaterThanOrEqual(3);
    expect(result.marginPressure).toBeLessThan(7);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when margin pressure is at or above 7 percent", () => {
    const result = calculateConstructionSubcontractorMarginLeak(defaultInputs);

    expect(result.marginPressure).toBeGreaterThanOrEqual(7);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid zero contract value fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, contractValue: 0 });
  });

  test("invalid negative planned cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, plannedSubcontractorCost: -1 });
  });

  test("invalid negative delay cost fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, delayCost: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, actualSubcontractorCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, materialVariance: Number.POSITIVE_INFINITY });
  });

  test("elevated margin pressure emits warning", () => {
    const result = calculateConstructionSubcontractorMarginLeak(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("pressuring project margin")),
    ).toBe(true);
  });

  test("contract metadata matches construction subcontractor margin leak slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "contractValue",
        "plannedSubcontractorCost",
        "actualSubcontractorCost",
        "delayCost",
        "materialVariance",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("marginPressure");
    expect(assumptionText).toContain("totalExposure");
    expect(assumptionText).toContain("3");
    expect(assumptionText).toContain("7");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateConstructionSubcontractorMarginLeak(defaultInputs);

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
