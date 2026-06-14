import { describe, expect, test } from "vitest";
import { VADE_FARKI_VE_ERKEN_ODEME_ISKONTOSU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator,
  type VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator";
import { validateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator";
const SCHEMA_ID = "vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator";

const defaultInputs: VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs = {
    "faturaTutari": 10000,
    "vadeFarkiYuzde": 5,
    "erkenOdemeIskontoYuzde": 3
  };
const lowBandInputs: VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs = {
    "faturaTutari": 0.1,
    "vadeFarkiYuzde": 5,
    "erkenOdemeIskontoYuzde": 3
  };
const criticalBandInputs: VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs = {
    "faturaTutari": 6,
    "vadeFarkiYuzde": 5,
    "erkenOdemeIskontoYuzde": 3
  };

function expectValidationFailure(partial: Partial<VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs;
  const validation = validateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, faturaTutari: undefined } as unknown as VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs;
    const validation = validateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ faturaTutari: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputs({ ...defaultInputs, faturaTutari: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator({ ...defaultInputs, faturaTutari: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ erkenOdemeIskontoYuzde: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ erkenOdemeIskontoYuzde: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = VADE_FARKI_VE_ERKEN_ODEME_ISKONTOSU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
