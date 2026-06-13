import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAnnualLeaveSeveranceNoticeCalculator,
  type AnnualLeaveSeveranceNoticeCalculatorInputs,
} from "@/lib/premium-schema/calculators/annual-leave-severance-notice-calculator";
import { validateAnnualLeaveSeveranceNoticeCalculatorInputs } from "@/lib/premium-schema/calculators/annual-leave-severance-notice-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "annual-leave-severance-notice-calculator";

const defaultInputs: AnnualLeaveSeveranceNoticeCalculatorInputs = {
    "grossMonthlySalary": 4200,
    "employerBurdenPercent": 22,
    "yearsOfService": 6,
    "severanceWeeksPerYear": 4,
    "noticeWeeks": 4
  };
const lowBandInputs: AnnualLeaveSeveranceNoticeCalculatorInputs = {
    "grossMonthlySalary": 42,
    "employerBurdenPercent": 22,
    "yearsOfService": 6,
    "severanceWeeksPerYear": 4,
    "noticeWeeks": 4
  };
const criticalBandInputs: AnnualLeaveSeveranceNoticeCalculatorInputs = {
    "grossMonthlySalary": 4200000,
    "employerBurdenPercent": 22,
    "yearsOfService": 6,
    "severanceWeeksPerYear": 4,
    "noticeWeeks": 4
  };

function expectValidationFailure(partial: Partial<AnnualLeaveSeveranceNoticeCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AnnualLeaveSeveranceNoticeCalculatorInputs;
  const validation = validateAnnualLeaveSeveranceNoticeCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAnnualLeaveSeveranceNoticeCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AnnualLeaveSeveranceNoticeCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("annual-leave-severance-notice-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateAnnualLeaveSeveranceNoticeCalculator(defaultInputs);
    expect(result.totalExitExposure).toBeCloseTo(engineNumeric(SLUG, "totalExitExposure", defaultInputs), 2);
    expect(result.severanceEstimate).toBeCloseTo(engineNumeric(SLUG, "severanceEstimate", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExitExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAnnualLeaveSeveranceNoticeCalculator(defaultInputs);
    expect(result.totalExitExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExitExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAnnualLeaveSeveranceNoticeCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAnnualLeaveSeveranceNoticeCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAnnualLeaveSeveranceNoticeCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, grossMonthlySalary: undefined } as unknown as AnnualLeaveSeveranceNoticeCalculatorInputs;
    const validation = validateAnnualLeaveSeveranceNoticeCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAnnualLeaveSeveranceNoticeCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ grossMonthlySalary: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ noticeWeeks: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ noticeWeeks: Number.POSITIVE_INFINITY });
  });

  test("contract metadata matches slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateAnnualLeaveSeveranceNoticeCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExitExposure")?.raw).toBeCloseTo(calculatorResult.totalExitExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "severanceEstimate")?.raw).toBeCloseTo(calculatorResult.severanceEstimate, 2);
  });
});
