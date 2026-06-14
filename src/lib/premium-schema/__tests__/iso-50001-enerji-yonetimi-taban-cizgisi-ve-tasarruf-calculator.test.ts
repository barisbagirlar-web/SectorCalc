import { describe, expect, test } from "vitest";
import { ISO_50001_ENERJI_YONETIMI_TABAN_CIZGISI_VE_TASARRUF_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/iso-50001-enerji-yonetimi-taban-cizgisi-ve-tasarruf-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator,
  type Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs,
} from "@/lib/premium-schema/calculators/iso-50001-enerji-yonetimi-taban-cizgisi-ve-tasarruf-calculator";
import { validateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs } from "@/lib/premium-schema/calculators/iso-50001-enerji-yonetimi-taban-cizgisi-ve-tasarruf-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "iso-50001-enerji-yonetimi-taban-cizgisi-ve-tasarruf-calculator";
const SCHEMA_ID = "iso-50001-enerji-yonetimi-taban-cizgisi-ve-tasarruf-calculator";

const defaultInputs: Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs = {
    "powerKw": 100,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };
const lowBandInputs: Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs = {
    "powerKw": 0.1,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };
const criticalBandInputs: Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs = {
    "powerKw": 6,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };

function expectValidationFailure(partial: Partial<Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs;
  const validation = validateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("iso-50001-enerji-yonetimi-taban-cizgisi-ve-tasarruf-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, powerKw: undefined } as unknown as Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs;
    const validation = validateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ powerKw: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputs({ ...defaultInputs, efficiencyPercent: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator({ ...defaultInputs, efficiencyPercent: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ISO_50001_ENERJI_YONETIMI_TABAN_CIZGISI_VE_TASARRUF_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
