import { describe, expect, test } from "vitest";
import { BRICK_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/brick-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBrickCalculator,
  type BrickCalculatorInputs,
} from "@/lib/premium-schema/calculators/brick-calculator";
import { validateBrickCalculatorInputs } from "@/lib/premium-schema/calculators/brick-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "brick-calculator";
const SCHEMA_ID = "brick-calculator";

const defaultInputs: BrickCalculatorInputs = {
    "wallLength": 10,
    "wallHeight": 3,
    "wallThickness": 0.2,
    "brickLength": 0.2,
    "brickHeight": 0.1,
    "brickThickness": 0.1
  };
const lowBandInputs: BrickCalculatorInputs = {
    "wallLength": 0.1,
    "wallHeight": 3,
    "wallThickness": 0.2,
    "brickLength": 0.2,
    "brickHeight": 0.1,
    "brickThickness": 0.1
  };
const criticalBandInputs: BrickCalculatorInputs = {
    "wallLength": 6,
    "wallHeight": 3,
    "wallThickness": 0.2,
    "brickLength": 0.2,
    "brickHeight": 0.1,
    "brickThickness": 0.1
  };

function expectValidationFailure(partial: Partial<BrickCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BrickCalculatorInputs;
  const validation = validateBrickCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBrickCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BrickCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("brick-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateBrickCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBrickCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBrickCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBrickCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBrickCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, wallLength: undefined } as unknown as BrickCalculatorInputs;
    const validation = validateBrickCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBrickCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ wallLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBrickCalculatorInputs({ ...defaultInputs, wallLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBrickCalculator({ ...defaultInputs, wallLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ brickThickness: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ brickThickness: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BRICK_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBrickCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
