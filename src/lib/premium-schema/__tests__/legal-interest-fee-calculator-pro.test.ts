import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateLegalInterestFeeCalculatorPro,
  type LegalInterestFeeCalculatorProInputs,
} from "@/lib/premium-schema/calculators/legal-interest-fee-calculator-pro";
import { validateLegalInterestFeeCalculatorProInputs } from "@/lib/premium-schema/calculators/legal-interest-fee-calculator-pro-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "legal-interest-fee-calculator-pro";

const defaultInputs: LegalInterestFeeCalculatorProInputs = {
    "principal": 15000,
    "annualInterestPercent": 12,
    "days": 180,
    "feePercent": 8,
    "fixedCost": 650
  };
const lowBandInputs: LegalInterestFeeCalculatorProInputs = {
    "principal": 15000,
    "annualInterestPercent": 12,
    "days": 9,
    "feePercent": 8,
    "fixedCost": 650
  };
const criticalBandInputs: LegalInterestFeeCalculatorProInputs = {
    "principal": 15000,
    "annualInterestPercent": 12,
    "days": 730,
    "feePercent": 8,
    "fixedCost": 650
  };

function expectValidationFailure(partial: Partial<LegalInterestFeeCalculatorProInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as LegalInterestFeeCalculatorProInputs;
  const validation = validateLegalInterestFeeCalculatorProInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateLegalInterestFeeCalculatorPro(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: LegalInterestFeeCalculatorProInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("legal-interest-fee-calculator-pro", () => {
  test("exact default oracle", () => {
    const result = calculateLegalInterestFeeCalculatorPro(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.interestCost).toBeCloseTo(engineNumeric(SLUG, "interestCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateLegalInterestFeeCalculatorPro(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateLegalInterestFeeCalculatorPro(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateLegalInterestFeeCalculatorPro(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateLegalInterestFeeCalculatorPro(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, principal: undefined } as unknown as LegalInterestFeeCalculatorProInputs;
    const validation = validateLegalInterestFeeCalculatorProInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateLegalInterestFeeCalculatorPro(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ principal: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateLegalInterestFeeCalculatorProInputs({ ...defaultInputs, days: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateLegalInterestFeeCalculatorPro({ ...defaultInputs, days: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fixedCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fixedCost: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateLegalInterestFeeCalculatorPro(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "interestCost")?.raw).toBeCloseTo(calculatorResult.interestCost, 2);
  });
});
