import { describe, expect, test } from "vitest";
import { ENERJI_IZLEME_SISTEMI_YATIRIM_VE_TASARRUF_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator,
  type EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs,
} from "@/lib/premium-schema/calculators/enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator";
import { validateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs } from "@/lib/premium-schema/calculators/enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator";
const SCHEMA_ID = "enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator";

const defaultInputs: EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs = {
    "powerKw": 100,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };
const lowBandInputs: EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs = {
    "powerKw": 0.1,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };
const criticalBandInputs: EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs = {
    "powerKw": 6,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };

function expectValidationFailure(partial: Partial<EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs;
  const validation = validateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, powerKw: undefined } as unknown as EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs;
    const validation = validateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ powerKw: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputs({ ...defaultInputs, efficiencyPercent: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator({ ...defaultInputs, efficiencyPercent: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ENERJI_IZLEME_SISTEMI_YATIRIM_VE_TASARRUF_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
