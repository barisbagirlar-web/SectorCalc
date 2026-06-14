import { describe, expect, test } from "vitest";
import { SEED_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/seed-rate-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSeedRateCalculator,
  type SeedRateCalculatorInputs,
} from "@/lib/premium-schema/calculators/seed-rate-calculator";
import { validateSeedRateCalculatorInputs } from "@/lib/premium-schema/calculators/seed-rate-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "seed-rate-calculator";
const SCHEMA_ID = "seed-rate-calculator";

const defaultInputs: SeedRateCalculatorInputs = {
    "targetPlantPopulation": 50000,
    "germinationRate": 90,
    "emergenceFactor": 85,
    "thousandSeedWeight": 40,
    "fieldLossPercent": 5
  };
const lowBandInputs: SeedRateCalculatorInputs = {
    "targetPlantPopulation": 1,
    "germinationRate": 90,
    "emergenceFactor": 85,
    "thousandSeedWeight": 40,
    "fieldLossPercent": 5
  };
const criticalBandInputs: SeedRateCalculatorInputs = {
    "targetPlantPopulation": 6,
    "germinationRate": 90,
    "emergenceFactor": 85,
    "thousandSeedWeight": 40,
    "fieldLossPercent": 5
  };

function expectValidationFailure(partial: Partial<SeedRateCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SeedRateCalculatorInputs;
  const validation = validateSeedRateCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSeedRateCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SeedRateCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("seed-rate-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateSeedRateCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSeedRateCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSeedRateCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSeedRateCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSeedRateCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, targetPlantPopulation: undefined } as unknown as SeedRateCalculatorInputs;
    const validation = validateSeedRateCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSeedRateCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ targetPlantPopulation: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSeedRateCalculatorInputs({ ...defaultInputs, targetPlantPopulation: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSeedRateCalculator({ ...defaultInputs, targetPlantPopulation: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fieldLossPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fieldLossPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SEED_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSeedRateCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
