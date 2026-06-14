import { describe, expect, test } from "vitest";
import { MUSTERI_YASAM_BOYU_DEGER_CLV_VE_EDINME_MALIYETI_CAC_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator,
  type MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs,
} from "@/lib/premium-schema/calculators/musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator";
import { validateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs } from "@/lib/premium-schema/calculators/musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator";
const SCHEMA_ID = "musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator";

const defaultInputs: MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs = {
    "totalRevenue": 100000,
    "customerCount": 1000,
    "grossMarginPercent": 40,
    "discountRate": 10,
    "retentionPeriods": 12,
    "totalAcquisitionCost": 50000
  };
const lowBandInputs: MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs = {
    "totalRevenue": 0.1,
    "customerCount": 1000,
    "grossMarginPercent": 40,
    "discountRate": 10,
    "retentionPeriods": 12,
    "totalAcquisitionCost": 50000
  };
const criticalBandInputs: MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs = {
    "totalRevenue": 6,
    "customerCount": 1000,
    "grossMarginPercent": 40,
    "discountRate": 10,
    "retentionPeriods": 12,
    "totalAcquisitionCost": 50000
  };

function expectValidationFailure(partial: Partial<MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs;
  const validation = validateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalRevenue: undefined } as unknown as MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs;
    const validation = validateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputs({ ...defaultInputs, totalRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator({ ...defaultInputs, totalRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ totalAcquisitionCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ totalAcquisitionCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MUSTERI_YASAM_BOYU_DEGER_CLV_VE_EDINME_MALIYETI_CAC_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
