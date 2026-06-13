import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateInvestmentPaybackNpvCalculator,
  type InvestmentPaybackNpvCalculatorInputs,
} from "@/lib/premium-schema/calculators/investment-payback-npv-calculator";
import { validateInvestmentPaybackNpvCalculatorInputs } from "@/lib/premium-schema/calculators/investment-payback-npv-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "investment-payback-npv-calculator";

const defaultInputs: InvestmentPaybackNpvCalculatorInputs = {
    "initialInvestment": 120000,
    "annualCashFlow": 28000,
    "discountRatePercent": 10,
    "horizonYears": 5
  };
const lowBandInputs: InvestmentPaybackNpvCalculatorInputs = {
    "initialInvestment": 1200,
    "annualCashFlow": 28000,
    "discountRatePercent": 10,
    "horizonYears": 5
  };
const criticalBandInputs: InvestmentPaybackNpvCalculatorInputs = {
    "initialInvestment": 120000000,
    "annualCashFlow": 28000,
    "discountRatePercent": 10,
    "horizonYears": 5
  };

function expectValidationFailure(partial: Partial<InvestmentPaybackNpvCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as InvestmentPaybackNpvCalculatorInputs;
  const validation = validateInvestmentPaybackNpvCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateInvestmentPaybackNpvCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: InvestmentPaybackNpvCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("investment-payback-npv-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateInvestmentPaybackNpvCalculator(defaultInputs);
    expect(result.npv).toBeCloseTo(engineNumeric(SLUG, "npv", defaultInputs), 2);
    expect(result.paybackYears).toBeCloseTo(engineNumeric(SLUG, "paybackYears", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("npv");
  });

  test("formula pipeline parity", () => {
    const result = calculateInvestmentPaybackNpvCalculator(defaultInputs);
    expect(result.npv).toBeCloseTo(
      engineNumeric(SLUG, "npv", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateInvestmentPaybackNpvCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateInvestmentPaybackNpvCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateInvestmentPaybackNpvCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, initialInvestment: undefined } as unknown as InvestmentPaybackNpvCalculatorInputs;
    const validation = validateInvestmentPaybackNpvCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateInvestmentPaybackNpvCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ initialInvestment: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateInvestmentPaybackNpvCalculatorInputs({ ...defaultInputs, discountRatePercent: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateInvestmentPaybackNpvCalculator({ ...defaultInputs, discountRatePercent: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ horizonYears: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ horizonYears: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateInvestmentPaybackNpvCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "npv")?.raw).toBeCloseTo(calculatorResult.npv, 2);
    expect(engineResult.outputs.find((output) => output.id === "paybackYears")?.raw).toBeCloseTo(calculatorResult.paybackYears, 2);
  });
});
