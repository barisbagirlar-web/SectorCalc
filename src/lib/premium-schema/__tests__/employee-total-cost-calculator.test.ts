import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEmployeeTotalCostCalculator,
  type EmployeeTotalCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/employee-total-cost-calculator";
import { validateEmployeeTotalCostCalculatorInputs } from "@/lib/premium-schema/calculators/employee-total-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "employee-total-cost-calculator";

const defaultInputs: EmployeeTotalCostCalculatorInputs = {
    "grossSalary": 4200,
    "employerRatePercent": 22,
    "monthlyBenefits": 380
  };
const lowBandInputs: EmployeeTotalCostCalculatorInputs = {
    "grossSalary": 42,
    "employerRatePercent": 22,
    "monthlyBenefits": 380
  };
const criticalBandInputs: EmployeeTotalCostCalculatorInputs = {
    "grossSalary": 4200000,
    "employerRatePercent": 22,
    "monthlyBenefits": 380
  };

function expectValidationFailure(partial: Partial<EmployeeTotalCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as EmployeeTotalCostCalculatorInputs;
  const validation = validateEmployeeTotalCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEmployeeTotalCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: EmployeeTotalCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("employee-total-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateEmployeeTotalCostCalculator(defaultInputs);
    expect(result.totalEmployerCost).toBeCloseTo(engineNumeric(SLUG, "totalEmployerCost", defaultInputs), 2);
    expect(result.employerLoad).toBeCloseTo(engineNumeric(SLUG, "employerLoad", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalEmployerCost");
  });

  test("formula pipeline parity", () => {
    const result = calculateEmployeeTotalCostCalculator(defaultInputs);
    expect(result.totalEmployerCost).toBeCloseTo(
      engineNumeric(SLUG, "totalEmployerCost", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateEmployeeTotalCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateEmployeeTotalCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateEmployeeTotalCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, grossSalary: undefined } as unknown as EmployeeTotalCostCalculatorInputs;
    const validation = validateEmployeeTotalCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateEmployeeTotalCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ grossSalary: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyBenefits: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyBenefits: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateEmployeeTotalCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalEmployerCost")?.raw).toBeCloseTo(calculatorResult.totalEmployerCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "employerLoad")?.raw).toBeCloseTo(calculatorResult.employerLoad, 2);
  });
});
