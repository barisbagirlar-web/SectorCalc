import { describe, expect, test } from "vitest";
import { BORU_CAPI_AKIS_HIZI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boru-capi-akis-hizi-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBoruCapiAkisHiziHesaplama,
  type BoruCapiAkisHiziHesaplamaInputs,
} from "@/lib/premium-schema/calculators/boru-capi-akis-hizi-hesaplama";
import { validateBoruCapiAkisHiziHesaplamaInputs } from "@/lib/premium-schema/calculators/boru-capi-akis-hizi-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "boru-capi-akis-hizi-hesaplama";
const SCHEMA_ID = "boru-capi-akis-hizi-hesaplama";

const defaultInputs: BoruCapiAkisHiziHesaplamaInputs = {
    "pipeInnerDiameter": 100,
    "flowVelocity": 2,
    "fluidDensity": 1000,
    "dynamicViscosity": 0.001
  };
const lowBandInputs: BoruCapiAkisHiziHesaplamaInputs = {
    "pipeInnerDiameter": 1,
    "flowVelocity": 2,
    "fluidDensity": 1000,
    "dynamicViscosity": 0.001
  };
const criticalBandInputs: BoruCapiAkisHiziHesaplamaInputs = {
    "pipeInnerDiameter": 6,
    "flowVelocity": 2,
    "fluidDensity": 1000,
    "dynamicViscosity": 0.001
  };

function expectValidationFailure(partial: Partial<BoruCapiAkisHiziHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BoruCapiAkisHiziHesaplamaInputs;
  const validation = validateBoruCapiAkisHiziHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBoruCapiAkisHiziHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BoruCapiAkisHiziHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("boru-capi-akis-hizi-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateBoruCapiAkisHiziHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBoruCapiAkisHiziHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBoruCapiAkisHiziHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBoruCapiAkisHiziHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBoruCapiAkisHiziHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, pipeInnerDiameter: undefined } as unknown as BoruCapiAkisHiziHesaplamaInputs;
    const validation = validateBoruCapiAkisHiziHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBoruCapiAkisHiziHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ pipeInnerDiameter: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBoruCapiAkisHiziHesaplamaInputs({ ...defaultInputs, pipeInnerDiameter: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBoruCapiAkisHiziHesaplama({ ...defaultInputs, pipeInnerDiameter: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ dynamicViscosity: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ dynamicViscosity: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BORU_CAPI_AKIS_HIZI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBoruCapiAkisHiziHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
