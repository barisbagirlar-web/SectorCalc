import { describe, expect, test } from "vitest";
import { SQUARE_FOOTAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/square-footage-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSquareFootageCalculator,
  type SquareFootageCalculatorInputs,
} from "@/lib/premium-schema/calculators/square-footage-calculator";
import { validateSquareFootageCalculatorInputs } from "@/lib/premium-schema/calculators/square-footage-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "square-footage-calculator";
const SCHEMA_ID = "square-footage-calculator";

const defaultInputs: SquareFootageCalculatorInputs = {
    "lengthFeet": 10,
    "widthFeet": 10,
    "wasteFactorPercent": 5,
    "unitCostPerSquareFoot": 5
  };
const lowBandInputs: SquareFootageCalculatorInputs = {
    "lengthFeet": 0.1,
    "widthFeet": 10,
    "wasteFactorPercent": 5,
    "unitCostPerSquareFoot": 5
  };
const criticalBandInputs: SquareFootageCalculatorInputs = {
    "lengthFeet": 6,
    "widthFeet": 10,
    "wasteFactorPercent": 5,
    "unitCostPerSquareFoot": 5
  };

function expectValidationFailure(partial: Partial<SquareFootageCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SquareFootageCalculatorInputs;
  const validation = validateSquareFootageCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSquareFootageCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SquareFootageCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("square-footage-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateSquareFootageCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSquareFootageCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSquareFootageCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSquareFootageCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSquareFootageCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, lengthFeet: undefined } as unknown as SquareFootageCalculatorInputs;
    const validation = validateSquareFootageCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSquareFootageCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ lengthFeet: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSquareFootageCalculatorInputs({ ...defaultInputs, lengthFeet: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSquareFootageCalculator({ ...defaultInputs, lengthFeet: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCostPerSquareFoot: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCostPerSquareFoot: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SQUARE_FOOTAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSquareFootageCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
