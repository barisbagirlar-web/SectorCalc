import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCalibrationDriftRisk,
  type CalibrationDriftRiskInputs,
} from "@/lib/premium-schema/calculators/calibration-drift-risk";
import { validateCalibrationDriftRiskInputs } from "@/lib/premium-schema/calculators/calibration-drift-risk-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "calibration-drift-risk";

const defaultInputs: CalibrationDriftRiskInputs = {
  targetValue: 100,
  actualValue: 101.8,
  tolerance: 2,
  batchValue: 18000,
  rejectionRiskPercent: 12,
};

function expectValidationFailure(inputs: CalibrationDriftRiskInputs): void {
  const validation = validateCalibrationDriftRiskInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) {
    return;
  }
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCalibrationDriftRisk(inputs)).toThrow();
}

describe("calibration-drift-risk", () => {
  test("exact default oracle", () => {
    const result = calculateCalibrationDriftRisk(defaultInputs);

    expect(result.toleranceUsage).toBeCloseTo(90, 2);
    expect(result.rejectionExposure).toBeCloseTo(2160, 2);
    expect(result.summaryLevel).toBe("warning");
    expect(result.primaryDriver).toBe("rejectionExposure");
  });

  test("low threshold when tolerance usage is below 70", () => {
    const result = calculateCalibrationDriftRisk({
      targetValue: 100,
      actualValue: 100.5,
      tolerance: 2,
      batchValue: 10000,
      rejectionRiskPercent: 5,
    });

    expect(result.toleranceUsage).toBeLessThan(70);
    expect(result.summaryLevel).toBe("low");
  });

  test("warning threshold when tolerance usage is between 70 and 100", () => {
    const result = calculateCalibrationDriftRisk(defaultInputs);

    expect(result.toleranceUsage).toBeGreaterThanOrEqual(70);
    expect(result.toleranceUsage).toBeLessThan(100);
    expect(result.summaryLevel).toBe("warning");
  });

  test("critical threshold when tolerance usage is at or above 100", () => {
    const result = calculateCalibrationDriftRisk({
      targetValue: 100,
      actualValue: 102,
      tolerance: 2,
      batchValue: 18000,
      rejectionRiskPercent: 12,
    });

    expect(result.toleranceUsage).toBeGreaterThanOrEqual(100);
    expect(result.summaryLevel).toBe("critical");
  });

  test("invalid missing tolerance fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, tolerance: 0 });
  });

  test("invalid negative batch value fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, batchValue: -1 });
  });

  test("invalid negative rejection risk fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, rejectionRiskPercent: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, actualValue: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ...defaultInputs, targetValue: Number.POSITIVE_INFINITY });
  });

  test("elevated tolerance usage emits warning", () => {
    const result = calculateCalibrationDriftRisk(defaultInputs);

    expect(
      result.warnings.some((warning) => warning.includes("Tolerance band usage is elevated")),
    ).toBe(true);
  });

  test("contract metadata matches calibration drift risk slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) {
      return;
    }

    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs).toEqual(
      expect.arrayContaining([
        "targetValue",
        "actualValue",
        "tolerance",
        "batchValue",
        "rejectionRiskPercent",
      ]),
    );

    const assumptionText = contract.assumptions.join(" ");
    expect(assumptionText).toContain("toleranceUsage");
    expect(assumptionText).toContain("rejectionExposure");
    expect(assumptionText).toContain("70");
    expect(assumptionText).toContain("100");
  });

  test("engine parity matches dedicated calculator for default schema inputs", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateCalibrationDriftRisk(defaultInputs);

    const engineToleranceUsage = engineResult.outputs.find(
      (output) => output.id === "toleranceUsage",
    )?.raw;
    const engineRejectionExposure = engineResult.outputs.find(
      (output) => output.id === "rejectionExposure",
    )?.raw;

    expect(engineToleranceUsage).toBeCloseTo(calculatorResult.toleranceUsage, 2);
    expect(engineRejectionExposure).toBeCloseTo(calculatorResult.rejectionExposure, 2);
  });
});
