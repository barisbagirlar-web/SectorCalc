import { describe, expect, test } from "vitest";
import { SU_DEBISI_LITRE_DAKIKA_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/su-debisi-litre-dakika-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSuDebisiLitreDakikaHesaplama,
  type SuDebisiLitreDakikaHesaplamaInputs,
} from "@/lib/premium-schema/calculators/su-debisi-litre-dakika-hesaplama";
import { validateSuDebisiLitreDakikaHesaplamaInputs } from "@/lib/premium-schema/calculators/su-debisi-litre-dakika-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "su-debisi-litre-dakika-hesaplama";
const SCHEMA_ID = "su-debisi-litre-dakika-hesaplama";

const defaultInputs: SuDebisiLitreDakikaHesaplamaInputs = {
    "pipeDiameter": 0.1,
    "flowVelocity": 2,
    "correctionFactor": 1
  };
const lowBandInputs: SuDebisiLitreDakikaHesaplamaInputs = {
    "pipeDiameter": 0.1,
    "flowVelocity": 2,
    "correctionFactor": 1
  };
const criticalBandInputs: SuDebisiLitreDakikaHesaplamaInputs = {
    "pipeDiameter": 6,
    "flowVelocity": 2,
    "correctionFactor": 1
  };

function expectValidationFailure(partial: Partial<SuDebisiLitreDakikaHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SuDebisiLitreDakikaHesaplamaInputs;
  const validation = validateSuDebisiLitreDakikaHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSuDebisiLitreDakikaHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SuDebisiLitreDakikaHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("su-debisi-litre-dakika-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateSuDebisiLitreDakikaHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSuDebisiLitreDakikaHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSuDebisiLitreDakikaHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSuDebisiLitreDakikaHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSuDebisiLitreDakikaHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, pipeDiameter: undefined } as unknown as SuDebisiLitreDakikaHesaplamaInputs;
    const validation = validateSuDebisiLitreDakikaHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSuDebisiLitreDakikaHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ pipeDiameter: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSuDebisiLitreDakikaHesaplamaInputs({ ...defaultInputs, pipeDiameter: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSuDebisiLitreDakikaHesaplama({ ...defaultInputs, pipeDiameter: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ correctionFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ correctionFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SU_DEBISI_LITRE_DAKIKA_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSuDebisiLitreDakikaHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
