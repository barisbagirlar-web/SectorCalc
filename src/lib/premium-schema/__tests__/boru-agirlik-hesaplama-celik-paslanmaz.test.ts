import { describe, expect, test } from "vitest";
import { BORU_AGIRLIK_HESAPLAMA_CELIK_PASLANMAZ_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boru-agirlik-hesaplama-celik-paslanmaz-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBoruAgirlikHesaplamaCelikPaslanmaz,
  type BoruAgirlikHesaplamaCelikPaslanmazInputs,
} from "@/lib/premium-schema/calculators/boru-agirlik-hesaplama-celik-paslanmaz";
import { validateBoruAgirlikHesaplamaCelikPaslanmazInputs } from "@/lib/premium-schema/calculators/boru-agirlik-hesaplama-celik-paslanmaz-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "boru-agirlik-hesaplama-celik-paslanmaz";
const SCHEMA_ID = "boru-agirlik-hesaplama-celik-paslanmaz";

const defaultInputs: BoruAgirlikHesaplamaCelikPaslanmazInputs = {
    "outerDiameter": 100,
    "wallThickness": 5,
    "length": 6,
    "materialDensity": 7850
  };
const lowBandInputs: BoruAgirlikHesaplamaCelikPaslanmazInputs = {
    "outerDiameter": 1,
    "wallThickness": 5,
    "length": 6,
    "materialDensity": 7850
  };
const criticalBandInputs: BoruAgirlikHesaplamaCelikPaslanmazInputs = {
    "outerDiameter": 6,
    "wallThickness": 5,
    "length": 6,
    "materialDensity": 7850
  };

function expectValidationFailure(partial: Partial<BoruAgirlikHesaplamaCelikPaslanmazInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BoruAgirlikHesaplamaCelikPaslanmazInputs;
  const validation = validateBoruAgirlikHesaplamaCelikPaslanmazInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBoruAgirlikHesaplamaCelikPaslanmaz(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BoruAgirlikHesaplamaCelikPaslanmazInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("boru-agirlik-hesaplama-celik-paslanmaz", () => {
  test("exact default oracle", () => {
    const result = calculateBoruAgirlikHesaplamaCelikPaslanmaz(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBoruAgirlikHesaplamaCelikPaslanmaz(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBoruAgirlikHesaplamaCelikPaslanmaz(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBoruAgirlikHesaplamaCelikPaslanmaz(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBoruAgirlikHesaplamaCelikPaslanmaz(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, outerDiameter: undefined } as unknown as BoruAgirlikHesaplamaCelikPaslanmazInputs;
    const validation = validateBoruAgirlikHesaplamaCelikPaslanmazInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBoruAgirlikHesaplamaCelikPaslanmaz(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ outerDiameter: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBoruAgirlikHesaplamaCelikPaslanmazInputs({ ...defaultInputs, outerDiameter: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBoruAgirlikHesaplamaCelikPaslanmaz({ ...defaultInputs, outerDiameter: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ materialDensity: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ materialDensity: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BORU_AGIRLIK_HESAPLAMA_CELIK_PASLANMAZ_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBoruAgirlikHesaplamaCelikPaslanmaz(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
