import { describe, expect, test } from "vitest";
import { CLEANING_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cleaning-cost-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCleaningCostCalculator,
  type CleaningCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/cleaning-cost-calculator";
import { validateCleaningCostCalculatorInputs } from "@/lib/premium-schema/calculators/cleaning-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cleaning-cost-calculator";
const SCHEMA_ID = "cleaning-cost-calculator";

const defaultInputs: CleaningCostCalculatorInputs = {
    "jobArea": 1000,
    "materialCost": 500,
    "laborHours": 40,
    "laborHourlyRate": 25,
    "equipmentCost": 100,
    "travelCost": 50
  };
const lowBandInputs: CleaningCostCalculatorInputs = {
    "jobArea": 0.1,
    "materialCost": 500,
    "laborHours": 40,
    "laborHourlyRate": 25,
    "equipmentCost": 100,
    "travelCost": 50
  };
const criticalBandInputs: CleaningCostCalculatorInputs = {
    "jobArea": 6,
    "materialCost": 500,
    "laborHours": 40,
    "laborHourlyRate": 25,
    "equipmentCost": 100,
    "travelCost": 50
  };

function expectValidationFailure(partial: Partial<CleaningCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CleaningCostCalculatorInputs;
  const validation = validateCleaningCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCleaningCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CleaningCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("cleaning-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateCleaningCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCleaningCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCleaningCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCleaningCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCleaningCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, jobArea: undefined } as unknown as CleaningCostCalculatorInputs;
    const validation = validateCleaningCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCleaningCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ jobArea: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ travelCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ travelCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CLEANING_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCleaningCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
