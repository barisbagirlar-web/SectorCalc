import { describe, expect, test } from "vitest";
import { ATIK_YONETIMI_VE_BERTARAF_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator,
  type AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator";
import { validateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator";
const SCHEMA_ID = "atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator";

const defaultInputs: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs = {
    "wasteVolume": 100,
    "disposalUnitCost": 50,
    "transportCostPerTon": 10,
    "recyclingRatePercent": 20,
    "recyclingRevenuePerTon": 5,
    "complianceCostPerTon": 2
  };
const lowBandInputs: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs = {
    "wasteVolume": 0.1,
    "disposalUnitCost": 50,
    "transportCostPerTon": 10,
    "recyclingRatePercent": 20,
    "recyclingRevenuePerTon": 5,
    "complianceCostPerTon": 2
  };
const criticalBandInputs: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs = {
    "wasteVolume": 6,
    "disposalUnitCost": 50,
    "transportCostPerTon": 10,
    "recyclingRatePercent": 20,
    "recyclingRevenuePerTon": 5,
    "complianceCostPerTon": 2
  };

function expectValidationFailure(partial: Partial<AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs;
  const validation = validateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, wasteVolume: undefined } as unknown as AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs;
    const validation = validateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ wasteVolume: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs({ ...defaultInputs, wasteVolume: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator({ ...defaultInputs, wasteVolume: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ complianceCostPerTon: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ complianceCostPerTon: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ATIK_YONETIMI_VE_BERTARAF_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
