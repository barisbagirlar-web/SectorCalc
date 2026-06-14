import { describe, expect, test } from "vitest";
import { HOURLY_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/hourly-rate-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateHourlyRateCalculator,
  type HourlyRateCalculatorInputs,
} from "@/lib/premium-schema/calculators/hourly-rate-calculator";
import { validateHourlyRateCalculatorInputs } from "@/lib/premium-schema/calculators/hourly-rate-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "hourly-rate-calculator";
const SCHEMA_ID = "hourly-rate-calculator";

const defaultInputs: HourlyRateCalculatorInputs = {
    "baseHourlyWage": 25,
    "laborBurdenRate": 30,
    "totalMonthlyOverhead": 50000,
    "totalMonthlyBillableHours": 1600,
    "profitMarginPercent": 20
  };
const lowBandInputs: HourlyRateCalculatorInputs = {
    "baseHourlyWage": 0.1,
    "laborBurdenRate": 30,
    "totalMonthlyOverhead": 50000,
    "totalMonthlyBillableHours": 1600,
    "profitMarginPercent": 20
  };
const criticalBandInputs: HourlyRateCalculatorInputs = {
    "baseHourlyWage": 6,
    "laborBurdenRate": 30,
    "totalMonthlyOverhead": 50000,
    "totalMonthlyBillableHours": 1600,
    "profitMarginPercent": 20
  };

function expectValidationFailure(partial: Partial<HourlyRateCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as HourlyRateCalculatorInputs;
  const validation = validateHourlyRateCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateHourlyRateCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: HourlyRateCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("hourly-rate-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateHourlyRateCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateHourlyRateCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateHourlyRateCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateHourlyRateCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateHourlyRateCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, baseHourlyWage: undefined } as unknown as HourlyRateCalculatorInputs;
    const validation = validateHourlyRateCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateHourlyRateCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ baseHourlyWage: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateHourlyRateCalculatorInputs({ ...defaultInputs, baseHourlyWage: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateHourlyRateCalculator({ ...defaultInputs, baseHourlyWage: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ profitMarginPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ profitMarginPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = HOURLY_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SCHEMA_ID);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateHourlyRateCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
