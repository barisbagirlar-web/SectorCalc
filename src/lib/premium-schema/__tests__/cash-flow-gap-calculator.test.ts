import { describe, expect, test } from "vitest";
import { CASH_FLOW_GAP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cash-flow-gap-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCashFlowGapCalculator,
  type CashFlowGapCalculatorInputs,
} from "@/lib/premium-schema/calculators/cash-flow-gap-calculator";
import { validateCashFlowGapCalculatorInputs } from "@/lib/premium-schema/calculators/cash-flow-gap-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cash-flow-gap-calculator";
const SCHEMA_ID = "cash-flow-gap-calculator";

const defaultInputs: CashFlowGapCalculatorInputs = {
    "totalSalesRevenue": 100000,
    "accountsReceivableIncrease": 20000,
    "totalOperatingCosts": 80000,
    "inventoryIncrease": 10000,
    "accountsPayableIncrease": 15000,
    "daysPayableOutstanding": 30
  };
const lowBandInputs: CashFlowGapCalculatorInputs = {
    "totalSalesRevenue": 0.1,
    "accountsReceivableIncrease": 20000,
    "totalOperatingCosts": 80000,
    "inventoryIncrease": 10000,
    "accountsPayableIncrease": 15000,
    "daysPayableOutstanding": 30
  };
const criticalBandInputs: CashFlowGapCalculatorInputs = {
    "totalSalesRevenue": 6,
    "accountsReceivableIncrease": 20000,
    "totalOperatingCosts": 80000,
    "inventoryIncrease": 10000,
    "accountsPayableIncrease": 15000,
    "daysPayableOutstanding": 30
  };

function expectValidationFailure(partial: Partial<CashFlowGapCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CashFlowGapCalculatorInputs;
  const validation = validateCashFlowGapCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCashFlowGapCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CashFlowGapCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("cash-flow-gap-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateCashFlowGapCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCashFlowGapCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCashFlowGapCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCashFlowGapCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCashFlowGapCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalSalesRevenue: undefined } as unknown as CashFlowGapCalculatorInputs;
    const validation = validateCashFlowGapCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCashFlowGapCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalSalesRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCashFlowGapCalculatorInputs({ ...defaultInputs, totalSalesRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCashFlowGapCalculator({ ...defaultInputs, totalSalesRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ daysPayableOutstanding: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ daysPayableOutstanding: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CASH_FLOW_GAP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCashFlowGapCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
