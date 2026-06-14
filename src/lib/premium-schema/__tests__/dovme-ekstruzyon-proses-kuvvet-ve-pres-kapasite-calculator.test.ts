import { describe, expect, test } from "vitest";
import { DOVME_EKSTRUZYON_PROSES_KUVVET_VE_PRES_KAPASITE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator,
  type DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs,
} from "@/lib/premium-schema/calculators/dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator";
import { validateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs } from "@/lib/premium-schema/calculators/dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator";
const SCHEMA_ID = "dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator";

const defaultInputs: DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs = {
    "partLength": 100,
    "partWidth": 50,
    "flowStress": 200,
    "shapeComplexityFactor": 1.5,
    "safetyFactor": 1.2,
    "pressNominalCapacity": 5000
  };
const lowBandInputs: DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs = {
    "partLength": 1,
    "partWidth": 50,
    "flowStress": 200,
    "shapeComplexityFactor": 1.5,
    "safetyFactor": 1.2,
    "pressNominalCapacity": 5000
  };
const criticalBandInputs: DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs = {
    "partLength": 6,
    "partWidth": 50,
    "flowStress": 200,
    "shapeComplexityFactor": 1.5,
    "safetyFactor": 1.2,
    "pressNominalCapacity": 5000
  };

function expectValidationFailure(partial: Partial<DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs;
  const validation = validateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, partLength: undefined } as unknown as DovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs;
    const validation = validateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ partLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculatorInputs({ ...defaultInputs, partLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator({ ...defaultInputs, partLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ pressNominalCapacity: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ pressNominalCapacity: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = DOVME_EKSTRUZYON_PROSES_KUVVET_VE_PRES_KAPASITE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateDovmeEkstruzyonProsesKuvvetVePresKapasiteCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
