import { describe, expect, test } from "vitest";
import { KOSEBENT_LAMA_AGIRLIK_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kosebent-lama-agirlik-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKosebentLamaAgirlikHesaplama,
  type KosebentLamaAgirlikHesaplamaInputs,
} from "@/lib/premium-schema/calculators/kosebent-lama-agirlik-hesaplama";
import { validateKosebentLamaAgirlikHesaplamaInputs } from "@/lib/premium-schema/calculators/kosebent-lama-agirlik-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kosebent-lama-agirlik-hesaplama";
const SCHEMA_ID = "kosebent-lama-agirlik-hesaplama";

const defaultInputs: KosebentLamaAgirlikHesaplamaInputs = {
    "leg1": 50,
    "leg2": 50,
    "thickness": 5,
    "length": 6,
    "tolerancePercent": 2.5
  };
const lowBandInputs: KosebentLamaAgirlikHesaplamaInputs = {
    "leg1": 1,
    "leg2": 50,
    "thickness": 5,
    "length": 6,
    "tolerancePercent": 2.5
  };
const criticalBandInputs: KosebentLamaAgirlikHesaplamaInputs = {
    "leg1": 6,
    "leg2": 50,
    "thickness": 5,
    "length": 6,
    "tolerancePercent": 2.5
  };

function expectValidationFailure(partial: Partial<KosebentLamaAgirlikHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KosebentLamaAgirlikHesaplamaInputs;
  const validation = validateKosebentLamaAgirlikHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKosebentLamaAgirlikHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KosebentLamaAgirlikHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kosebent-lama-agirlik-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateKosebentLamaAgirlikHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKosebentLamaAgirlikHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKosebentLamaAgirlikHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKosebentLamaAgirlikHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKosebentLamaAgirlikHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, leg1: undefined } as unknown as KosebentLamaAgirlikHesaplamaInputs;
    const validation = validateKosebentLamaAgirlikHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKosebentLamaAgirlikHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ leg1: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKosebentLamaAgirlikHesaplamaInputs({ ...defaultInputs, leg1: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKosebentLamaAgirlikHesaplama({ ...defaultInputs, leg1: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ tolerancePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ tolerancePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KOSEBENT_LAMA_AGIRLIK_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKosebentLamaAgirlikHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
