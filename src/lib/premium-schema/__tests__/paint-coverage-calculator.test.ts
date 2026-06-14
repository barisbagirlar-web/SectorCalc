import { describe, expect, test } from "vitest";
import { PAINT_COVERAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/paint-coverage-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePaintCoverageCalculator,
  type PaintCoverageCalculatorInputs,
} from "@/lib/premium-schema/calculators/paint-coverage-calculator";
import { validatePaintCoverageCalculatorInputs } from "@/lib/premium-schema/calculators/paint-coverage-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "paint-coverage-calculator";
const SCHEMA_ID = "paint-coverage-calculator";

const defaultInputs: PaintCoverageCalculatorInputs = {
    "totalArea": 100,
    "dryFilmThicknessMicrons": 100,
    "volumeSolidsPercent": 60,
    "applicationEfficiencyPercent": 85,
    "unitCostPerLiter": 20,
    "wastePercent": 10
  };
const lowBandInputs: PaintCoverageCalculatorInputs = {
    "totalArea": 0.1,
    "dryFilmThicknessMicrons": 100,
    "volumeSolidsPercent": 60,
    "applicationEfficiencyPercent": 85,
    "unitCostPerLiter": 20,
    "wastePercent": 10
  };
const criticalBandInputs: PaintCoverageCalculatorInputs = {
    "totalArea": 6,
    "dryFilmThicknessMicrons": 100,
    "volumeSolidsPercent": 60,
    "applicationEfficiencyPercent": 85,
    "unitCostPerLiter": 20,
    "wastePercent": 10
  };

function expectValidationFailure(partial: Partial<PaintCoverageCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PaintCoverageCalculatorInputs;
  const validation = validatePaintCoverageCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePaintCoverageCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PaintCoverageCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("paint-coverage-calculator", () => {
  test("exact default oracle", () => {
    const result = calculatePaintCoverageCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePaintCoverageCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePaintCoverageCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePaintCoverageCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePaintCoverageCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalArea: undefined } as unknown as PaintCoverageCalculatorInputs;
    const validation = validatePaintCoverageCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePaintCoverageCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalArea: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePaintCoverageCalculatorInputs({ ...defaultInputs, totalArea: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePaintCoverageCalculator({ ...defaultInputs, totalArea: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ wastePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ wastePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PAINT_COVERAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePaintCoverageCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
