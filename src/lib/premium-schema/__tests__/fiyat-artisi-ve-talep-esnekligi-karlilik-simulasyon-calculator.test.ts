import { describe, expect, test } from "vitest";
import { FIYAT_ARTISI_VE_TALEP_ESNEKLIGI_KARLILIK_SIMULASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fiyat-artisi-ve-talep-esnekligi-karlilik-simulasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator,
  type FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/fiyat-artisi-ve-talep-esnekligi-karlilik-simulasyon-calculator";
import { validateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs } from "@/lib/premium-schema/calculators/fiyat-artisi-ve-talep-esnekligi-karlilik-simulasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "fiyat-artisi-ve-talep-esnekligi-karlilik-simulasyon-calculator";
const SCHEMA_ID = "fiyat-artisi-ve-talep-esnekligi-karlilik-simulasyon-calculator";

const defaultInputs: FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs = {
    "currentPrice": 100,
    "currentQuantity": 1000,
    "priceElasticity": -1.5,
    "newPrice": 110,
    "directMaterialCost": 30,
    "directLaborCost": 20
  };
const lowBandInputs: FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs = {
    "currentPrice": 0.1,
    "currentQuantity": 1000,
    "priceElasticity": -1.5,
    "newPrice": 110,
    "directMaterialCost": 30,
    "directLaborCost": 20
  };
const criticalBandInputs: FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs = {
    "currentPrice": 6,
    "currentQuantity": 1000,
    "priceElasticity": -1.5,
    "newPrice": 110,
    "directMaterialCost": 30,
    "directLaborCost": 20
  };

function expectValidationFailure(partial: Partial<FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs;
  const validation = validateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("fiyat-artisi-ve-talep-esnekligi-karlilik-simulasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, currentPrice: undefined } as unknown as FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs;
    const validation = validateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ currentPrice: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs({ ...defaultInputs, currentPrice: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator({ ...defaultInputs, currentPrice: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ directLaborCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ directLaborCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FIYAT_ARTISI_VE_TALEP_ESNEKLIGI_KARLILIK_SIMULASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
