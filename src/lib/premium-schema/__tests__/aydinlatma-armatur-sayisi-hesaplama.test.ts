import { describe, expect, test } from "vitest";
import { AYDINLATMA_ARMATUR_SAYISI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/aydinlatma-armatur-sayisi-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAydinlatmaArmaturSayisiHesaplama,
  type AydinlatmaArmaturSayisiHesaplamaInputs,
} from "@/lib/premium-schema/calculators/aydinlatma-armatur-sayisi-hesaplama";
import { validateAydinlatmaArmaturSayisiHesaplamaInputs } from "@/lib/premium-schema/calculators/aydinlatma-armatur-sayisi-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "aydinlatma-armatur-sayisi-hesaplama";
const SCHEMA_ID = "aydinlatma-armatur-sayisi-hesaplama";

const defaultInputs: AydinlatmaArmaturSayisiHesaplamaInputs = {
    "illuminanceTarget": 500,
    "area": 100,
    "lampLumens": 3200,
    "numberLampsPerFixture": 2,
    "lightLossFactor": 0.8,
    "utilizationFactor": 0.7
  };
const lowBandInputs: AydinlatmaArmaturSayisiHesaplamaInputs = {
    "illuminanceTarget": 50,
    "area": 100,
    "lampLumens": 3200,
    "numberLampsPerFixture": 2,
    "lightLossFactor": 0.8,
    "utilizationFactor": 0.7
  };
const criticalBandInputs: AydinlatmaArmaturSayisiHesaplamaInputs = {
    "illuminanceTarget": 50,
    "area": 100,
    "lampLumens": 3200,
    "numberLampsPerFixture": 2,
    "lightLossFactor": 0.8,
    "utilizationFactor": 0.7
  };

function expectValidationFailure(partial: Partial<AydinlatmaArmaturSayisiHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AydinlatmaArmaturSayisiHesaplamaInputs;
  const validation = validateAydinlatmaArmaturSayisiHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAydinlatmaArmaturSayisiHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AydinlatmaArmaturSayisiHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("aydinlatma-armatur-sayisi-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateAydinlatmaArmaturSayisiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAydinlatmaArmaturSayisiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAydinlatmaArmaturSayisiHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAydinlatmaArmaturSayisiHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAydinlatmaArmaturSayisiHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, illuminanceTarget: undefined } as unknown as AydinlatmaArmaturSayisiHesaplamaInputs;
    const validation = validateAydinlatmaArmaturSayisiHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAydinlatmaArmaturSayisiHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ illuminanceTarget: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAydinlatmaArmaturSayisiHesaplamaInputs({ ...defaultInputs, illuminanceTarget: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAydinlatmaArmaturSayisiHesaplama({ ...defaultInputs, illuminanceTarget: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ utilizationFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ utilizationFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = AYDINLATMA_ARMATUR_SAYISI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAydinlatmaArmaturSayisiHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
