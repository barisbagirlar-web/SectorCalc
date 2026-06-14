import { describe, expect, test } from "vitest";
import { WATER_OPTIMIZATION_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/water-optimization-verdict-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateWaterOptimizationVerdict,
  type WaterOptimizationVerdictInputs,
} from "@/lib/premium-schema/calculators/water-optimization-verdict";
import { validateWaterOptimizationVerdictInputs } from "@/lib/premium-schema/calculators/water-optimization-verdict-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "water-optimization-verdict";

const defaultInputs: WaterOptimizationVerdictInputs = {
    "averageInventory": 42000,
    "annualCOGS": 180000,
    "carryingCostPercent": 18,
    "markdownPercent": 12
  };
const lowBandInputs: WaterOptimizationVerdictInputs = {
    "averageInventory": 420,
    "annualCOGS": 180000,
    "carryingCostPercent": 18,
    "markdownPercent": 12
  };
const criticalBandInputs: WaterOptimizationVerdictInputs = {
    "averageInventory": 42000000,
    "annualCOGS": 180000,
    "carryingCostPercent": 18,
    "markdownPercent": 12
  };

function expectValidationFailure(partial: Partial<WaterOptimizationVerdictInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as WaterOptimizationVerdictInputs;
  const validation = validateWaterOptimizationVerdictInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateWaterOptimizationVerdict(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: WaterOptimizationVerdictInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("water-optimization-verdict", () => {
  test("exact default oracle", () => {
    const result = calculateWaterOptimizationVerdict(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.turnover).toBeCloseTo(engineNumeric(SLUG, "turnover", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateWaterOptimizationVerdict(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateWaterOptimizationVerdict(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateWaterOptimizationVerdict(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateWaterOptimizationVerdict(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, averageInventory: undefined } as unknown as WaterOptimizationVerdictInputs;
    const validation = validateWaterOptimizationVerdictInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateWaterOptimizationVerdict(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ averageInventory: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ markdownPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ markdownPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = WATER_OPTIMIZATION_VERDICT_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateWaterOptimizationVerdict(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "turnover")?.raw).toBeCloseTo(calculatorResult.turnover, 2);
  });
});
