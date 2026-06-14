import { describe, expect, test } from "vitest";
import { SQUARE_METER_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/square-meter-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSquareMeterCalculator,
  type SquareMeterCalculatorInputs,
} from "@/lib/premium-schema/calculators/square-meter-calculator";
import { validateSquareMeterCalculatorInputs } from "@/lib/premium-schema/calculators/square-meter-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "square-meter-calculator";
const SCHEMA_ID = "square-meter-calculator";

const defaultInputs: SquareMeterCalculatorInputs = {
    "length": 10,
    "width": 5,
    "wastePercent": 5,
    "unitCost": 50
  };
const lowBandInputs: SquareMeterCalculatorInputs = {
    "length": 0.1,
    "width": 5,
    "wastePercent": 5,
    "unitCost": 50
  };
const criticalBandInputs: SquareMeterCalculatorInputs = {
    "length": 6,
    "width": 5,
    "wastePercent": 5,
    "unitCost": 50
  };

function expectValidationFailure(partial: Partial<SquareMeterCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SquareMeterCalculatorInputs;
  const validation = validateSquareMeterCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSquareMeterCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SquareMeterCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("square-meter-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateSquareMeterCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSquareMeterCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSquareMeterCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSquareMeterCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSquareMeterCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, length: undefined } as unknown as SquareMeterCalculatorInputs;
    const validation = validateSquareMeterCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSquareMeterCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ length: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSquareMeterCalculatorInputs({ ...defaultInputs, length: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSquareMeterCalculator({ ...defaultInputs, length: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SQUARE_METER_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSquareMeterCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
