import { describe, expect, test } from "vitest";
import { ENFLASYON_FIYAT_ESKALASYONU_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/enflasyon-fiyat-eskalasyonu-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEnflasyonFiyatEskalasyonuHesaplama,
  type EnflasyonFiyatEskalasyonuHesaplamaInputs,
} from "@/lib/premium-schema/calculators/enflasyon-fiyat-eskalasyonu-hesaplama";
import { validateEnflasyonFiyatEskalasyonuHesaplamaInputs } from "@/lib/premium-schema/calculators/enflasyon-fiyat-eskalasyonu-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "enflasyon-fiyat-eskalasyonu-hesaplama";
const SCHEMA_ID = "enflasyon-fiyat-eskalasyonu-hesaplama";

const defaultInputs: EnflasyonFiyatEskalasyonuHesaplamaInputs = {
    "basePrice": 100000,
    "baseIndex": 100,
    "currentIndex": 120
  };
const lowBandInputs: EnflasyonFiyatEskalasyonuHesaplamaInputs = {
    "basePrice": 0.1,
    "baseIndex": 100,
    "currentIndex": 120
  };
const criticalBandInputs: EnflasyonFiyatEskalasyonuHesaplamaInputs = {
    "basePrice": 6,
    "baseIndex": 100,
    "currentIndex": 120
  };

function expectValidationFailure(partial: Partial<EnflasyonFiyatEskalasyonuHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as EnflasyonFiyatEskalasyonuHesaplamaInputs;
  const validation = validateEnflasyonFiyatEskalasyonuHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEnflasyonFiyatEskalasyonuHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: EnflasyonFiyatEskalasyonuHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("enflasyon-fiyat-eskalasyonu-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateEnflasyonFiyatEskalasyonuHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateEnflasyonFiyatEskalasyonuHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateEnflasyonFiyatEskalasyonuHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateEnflasyonFiyatEskalasyonuHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateEnflasyonFiyatEskalasyonuHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, basePrice: undefined } as unknown as EnflasyonFiyatEskalasyonuHesaplamaInputs;
    const validation = validateEnflasyonFiyatEskalasyonuHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateEnflasyonFiyatEskalasyonuHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ basePrice: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateEnflasyonFiyatEskalasyonuHesaplamaInputs({ ...defaultInputs, basePrice: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateEnflasyonFiyatEskalasyonuHesaplama({ ...defaultInputs, basePrice: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ currentIndex: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ currentIndex: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ENFLASYON_FIYAT_ESKALASYONU_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateEnflasyonFiyatEskalasyonuHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
