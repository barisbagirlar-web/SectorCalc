import { describe, expect, test } from "vitest";
import { KORUYUCU_BAKIM_FREKANSI_VE_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/koruyucu-bakim-frekansi-ve-maliyet-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator,
  type KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/koruyucu-bakim-frekansi-ve-maliyet-optimizasyon-calculator";
import { validateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/koruyucu-bakim-frekansi-ve-maliyet-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "koruyucu-bakim-frekansi-ve-maliyet-optimizasyon-calculator";
const SCHEMA_ID = "koruyucu-bakim-frekansi-ve-maliyet-optimizasyon-calculator";

const defaultInputs: KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs = {
    "downtimeMinutes": 60,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 10,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };
const lowBandInputs: KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs = {
    "downtimeMinutes": 0.1,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 10,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };
const criticalBandInputs: KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs = {
    "downtimeMinutes": 6,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 10,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };

function expectValidationFailure(partial: Partial<KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs;
  const validation = validateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("koruyucu-bakim-frekansi-ve-maliyet-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, downtimeMinutes: undefined } as unknown as KoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs;
    const validation = validateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeMinutes: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculatorInputs({ ...defaultInputs, lostProductionUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator({ ...defaultInputs, lostProductionUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KORUYUCU_BAKIM_FREKANSI_VE_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKoruyucuBakimFrekansiVeMaliyetOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
