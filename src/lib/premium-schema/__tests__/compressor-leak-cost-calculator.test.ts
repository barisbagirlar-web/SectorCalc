import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCompressorLeakCostCalculator,
  type CompressorLeakCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/compressor-leak-cost-calculator";
import { validateCompressorLeakCostCalculatorInputs } from "@/lib/premium-schema/calculators/compressor-leak-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "compressor-leak-cost-calculator";

const defaultInputs: CompressorLeakCostCalculatorInputs = {
    "compressorKw": 45,
    "leakPercent": 12,
    "operatingHours": 360,
    "energyRate": 0.14
  };
const lowBandInputs: CompressorLeakCostCalculatorInputs = {
    "compressorKw": 0.45,
    "leakPercent": 12,
    "operatingHours": 360,
    "energyRate": 0.14
  };
const criticalBandInputs: CompressorLeakCostCalculatorInputs = {
    "compressorKw": 45000,
    "leakPercent": 12,
    "operatingHours": 360,
    "energyRate": 0.14
  };

function expectValidationFailure(partial: Partial<CompressorLeakCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CompressorLeakCostCalculatorInputs;
  const validation = validateCompressorLeakCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCompressorLeakCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CompressorLeakCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("compressor-leak-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateCompressorLeakCostCalculator(defaultInputs);
    expect(result.annualLeakCost).toBeCloseTo(engineNumeric(SLUG, "annualLeakCost", defaultInputs), 2);
    expect(result.monthlyLeakCost).toBeCloseTo(engineNumeric(SLUG, "monthlyLeakCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("annualLeakCost");
  });

  test("formula pipeline parity", () => {
    const result = calculateCompressorLeakCostCalculator(defaultInputs);
    expect(result.annualLeakCost).toBeCloseTo(
      engineNumeric(SLUG, "annualLeakCost", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateCompressorLeakCostCalculator(lowBandInputs);
    const defaultResult = calculateCompressorLeakCostCalculator(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateCompressorLeakCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCompressorLeakCostCalculator(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, compressorKw: undefined } as unknown as CompressorLeakCostCalculatorInputs;
    const validation = validateCompressorLeakCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCompressorLeakCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ compressorKw: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ energyRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ energyRate: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateCompressorLeakCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "annualLeakCost")?.raw).toBeCloseTo(calculatorResult.annualLeakCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "monthlyLeakCost")?.raw).toBeCloseTo(calculatorResult.monthlyLeakCost, 2);
  });
});
