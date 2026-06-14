import { describe, expect, test } from "vitest";
import { RENOVATION_BUDGET_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/renovation-budget-optimizer-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRenovationBudgetOptimizer,
  type RenovationBudgetOptimizerInputs,
} from "@/lib/premium-schema/calculators/renovation-budget-optimizer";
import { validateRenovationBudgetOptimizerInputs } from "@/lib/premium-schema/calculators/renovation-budget-optimizer-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "renovation-budget-optimizer";
const SCHEMA_ID = "legal-interest-fee-calculator-pro";

const defaultInputs: RenovationBudgetOptimizerInputs = {
    "principal": 15000,
    "annualInterestPercent": 12,
    "days": 180,
    "feePercent": 8,
    "fixedCost": 650
  };
const lowBandInputs: RenovationBudgetOptimizerInputs = {
    "principal": 15000,
    "annualInterestPercent": 12,
    "days": 9,
    "feePercent": 8,
    "fixedCost": 650
  };
const criticalBandInputs: RenovationBudgetOptimizerInputs = {
    "principal": 15000,
    "annualInterestPercent": 12,
    "days": 730,
    "feePercent": 8,
    "fixedCost": 650
  };

function expectValidationFailure(partial: Partial<RenovationBudgetOptimizerInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RenovationBudgetOptimizerInputs;
  const validation = validateRenovationBudgetOptimizerInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRenovationBudgetOptimizer(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RenovationBudgetOptimizerInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("renovation-budget-optimizer", () => {
  test("exact default oracle", () => {
    const result = calculateRenovationBudgetOptimizer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.interestCost).toBeCloseTo(engineNumeric(SCHEMA_ID, "interestCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRenovationBudgetOptimizer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRenovationBudgetOptimizer(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRenovationBudgetOptimizer(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRenovationBudgetOptimizer(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, principal: undefined } as unknown as RenovationBudgetOptimizerInputs;
    const validation = validateRenovationBudgetOptimizerInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRenovationBudgetOptimizer(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ principal: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRenovationBudgetOptimizerInputs({ ...defaultInputs, days: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRenovationBudgetOptimizer({ ...defaultInputs, days: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fixedCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fixedCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = RENOVATION_BUDGET_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRenovationBudgetOptimizer(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "interestCost")?.raw).toBeCloseTo(calculatorResult.interestCost, 2);
  });
});
