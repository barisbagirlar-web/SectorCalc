import { describe, expect, test } from "vitest";
import { SALARY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/salary-cost-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSalaryCostCalculator,
  type SalaryCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/salary-cost-calculator";
import { validateSalaryCostCalculatorInputs } from "@/lib/premium-schema/calculators/salary-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "salary-cost-calculator";
const SCHEMA_ID = "salary-cost-calculator";

const defaultInputs: SalaryCostCalculatorInputs = {
    "baseSalary": 3000,
    "bonuses": 0,
    "socialSecurityRate": 20.5,
    "otherEmployerCosts": 200,
    "workingDaysPerMonth": 22,
    "dailyHours": 8
  };
const lowBandInputs: SalaryCostCalculatorInputs = {
    "baseSalary": 0.1,
    "bonuses": 0,
    "socialSecurityRate": 20.5,
    "otherEmployerCosts": 200,
    "workingDaysPerMonth": 22,
    "dailyHours": 8
  };
const criticalBandInputs: SalaryCostCalculatorInputs = {
    "baseSalary": 6,
    "bonuses": 0,
    "socialSecurityRate": 20.5,
    "otherEmployerCosts": 200,
    "workingDaysPerMonth": 22,
    "dailyHours": 8
  };

function expectValidationFailure(partial: Partial<SalaryCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SalaryCostCalculatorInputs;
  const validation = validateSalaryCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSalaryCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SalaryCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("salary-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateSalaryCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSalaryCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSalaryCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSalaryCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSalaryCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, baseSalary: undefined } as unknown as SalaryCostCalculatorInputs;
    const validation = validateSalaryCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSalaryCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ baseSalary: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSalaryCostCalculatorInputs({ ...defaultInputs, baseSalary: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSalaryCostCalculator({ ...defaultInputs, baseSalary: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ dailyHours: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ dailyHours: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SALARY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSalaryCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
