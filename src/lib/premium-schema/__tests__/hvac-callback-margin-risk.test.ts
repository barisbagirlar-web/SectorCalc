import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateHvacCallbackMarginRisk,
  type HvacCallbackMarginRiskInputs,
} from "@/lib/premium-schema/calculators/hvac-callback-margin-risk";
import { validateHvacCallbackMarginRiskInputs } from "@/lib/premium-schema/calculators/hvac-callback-margin-risk-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "hvac-callback-margin-risk";
const PAID_ROUTE_SLUG = "hvac-project-margin-guard";

const defaultInputs: HvacCallbackMarginRiskInputs = {
  projectRevenue: 64000,
  ductworkVariance: 4200,
  commissioningHours: 28,
  laborRate: 55,
  callbackRiskPercent: 4,
};

function expectValidationFailure(inputs: HvacCallbackMarginRiskInputs): void {
  const validation = validateHvacCallbackMarginRiskInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateHvacCallbackMarginRisk(inputs)).toThrow();
}

describe("hvac-callback-margin-risk", () => {
  test("exact default oracle", () => {
    const result = calculateHvacCallbackMarginRisk(defaultInputs);

    expect(result.commissioningCost).toBeCloseTo(1540, 2);
    expect(result.callbackRiskCost).toBeCloseTo(2560, 2);
    expect(result.totalExposure).toBeCloseTo(8300, 2);
    expect(result.marginPressure).toBeCloseTo(12.96875, 2);
    expect(result.summaryLevel).toBe("critical");
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("low threshold when margin pressure is below 5 percent", () => {
    const result = calculateHvacCallbackMarginRisk({
      projectRevenue: 100000,
      ductworkVariance: 1000,
      commissioningHours: 5,
      laborRate: 55,
      callbackRiskPercent: 1,
    });

    expect(result.marginPressure).toBeLessThan(5);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when margin pressure is between 5 and 10 percent", () => {
    const result = calculateHvacCallbackMarginRisk({
      projectRevenue: 64000,
      ductworkVariance: 2000,
      commissioningHours: 15,
      laborRate: 55,
      callbackRiskPercent: 2,
    });

    expect(result.marginPressure).toBeGreaterThanOrEqual(5);
    expect(result.marginPressure).toBeLessThan(10);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when margin pressure is at or above 10 percent", () => {
    const result = calculateHvacCallbackMarginRisk(defaultInputs);

    expect(result.marginPressure).toBeGreaterThanOrEqual(10);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid zero project revenue fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, projectRevenue: 0 });
  });

  test("invalid callback risk above 100 fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, callbackRiskPercent: 101 });
  });

  test("invalid negative ductwork variance fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, ductworkVariance: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, laborRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, commissioningHours: Number.POSITIVE_INFINITY });
  });

  test("elevated callback risk emits warning", () => {
    const result = calculateHvacCallbackMarginRisk(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Callback risk is elevated")),
    ).toBe(true);
  });

  test("contract metadata matches hvac callback margin risk slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "projectRevenue",
        "ductworkVariance",
        "commissioningHours",
        "laborRate",
        "callbackRiskPercent",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("marginPressure");
    expect(assumptionText).toContain("totalExposure");
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
    const calculatorResult = calculateHvacCallbackMarginRisk(defaultInputs);

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
