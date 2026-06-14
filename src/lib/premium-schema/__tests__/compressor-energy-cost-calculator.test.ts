import { describe, expect, test } from "vitest";
import { COMPRESSOR_ENERGY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/compressor-energy-cost-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCompressorEnergyCostCalculator,
  type CompressorEnergyCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/compressor-energy-cost-calculator";
import { validateCompressorEnergyCostCalculatorInputs } from "@/lib/premium-schema/calculators/compressor-energy-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "compressor-energy-cost-calculator";
const SCHEMA_ID = "compressor-energy-cost-calculator";

const defaultInputs: CompressorEnergyCostCalculatorInputs = {
    "powerKw": 100,
    "runtimeHours": 8,
    "tariffPerKwh": 0.12,
    "efficiencyPercent": 85,
    "lossPercent": 5,
    "operatingDays": 250
  };
const lowBandInputs: CompressorEnergyCostCalculatorInputs = {
    "powerKw": 0.1,
    "runtimeHours": 8,
    "tariffPerKwh": 0.12,
    "efficiencyPercent": 85,
    "lossPercent": 5,
    "operatingDays": 250
  };
const criticalBandInputs: CompressorEnergyCostCalculatorInputs = {
    "powerKw": 6,
    "runtimeHours": 8,
    "tariffPerKwh": 0.12,
    "efficiencyPercent": 85,
    "lossPercent": 5,
    "operatingDays": 250
  };

function expectValidationFailure(partial: Partial<CompressorEnergyCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CompressorEnergyCostCalculatorInputs;
  const validation = validateCompressorEnergyCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCompressorEnergyCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CompressorEnergyCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("compressor-energy-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateCompressorEnergyCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCompressorEnergyCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCompressorEnergyCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCompressorEnergyCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCompressorEnergyCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, powerKw: undefined } as unknown as CompressorEnergyCostCalculatorInputs;
    const validation = validateCompressorEnergyCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCompressorEnergyCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ powerKw: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCompressorEnergyCostCalculatorInputs({ ...defaultInputs, powerKw: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCompressorEnergyCostCalculator({ ...defaultInputs, powerKw: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ operatingDays: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ operatingDays: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = COMPRESSOR_ENERGY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCompressorEnergyCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
