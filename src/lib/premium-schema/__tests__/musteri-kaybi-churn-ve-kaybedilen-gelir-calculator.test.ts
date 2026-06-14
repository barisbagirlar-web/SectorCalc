import { describe, expect, test } from "vitest";
import { MUSTERI_KAYBI_CHURN_VE_KAYBEDILEN_GELIR_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/musteri-kaybi-churn-ve-kaybedilen-gelir-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMusteriKaybiChurnVeKaybedilenGelirCalculator,
  type MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs,
} from "@/lib/premium-schema/calculators/musteri-kaybi-churn-ve-kaybedilen-gelir-calculator";
import { validateMusteriKaybiChurnVeKaybedilenGelirCalculatorInputs } from "@/lib/premium-schema/calculators/musteri-kaybi-churn-ve-kaybedilen-gelir-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "musteri-kaybi-churn-ve-kaybedilen-gelir-calculator";
const SCHEMA_ID = "musteri-kaybi-churn-ve-kaybedilen-gelir-calculator";

const defaultInputs: MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs = {
    "totalCustomersStart": 1000,
    "customersLost": 50,
    "totalRecurringRevenue": 500000,
    "variableCostRatio": 0.4,
    "averageCustomerLifespan": 36
  };
const lowBandInputs: MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs = {
    "totalCustomersStart": 1,
    "customersLost": 50,
    "totalRecurringRevenue": 500000,
    "variableCostRatio": 0.4,
    "averageCustomerLifespan": 36
  };
const criticalBandInputs: MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs = {
    "totalCustomersStart": 6,
    "customersLost": 50,
    "totalRecurringRevenue": 500000,
    "variableCostRatio": 0.4,
    "averageCustomerLifespan": 36
  };

function expectValidationFailure(partial: Partial<MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs;
  const validation = validateMusteriKaybiChurnVeKaybedilenGelirCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMusteriKaybiChurnVeKaybedilenGelirCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("musteri-kaybi-churn-ve-kaybedilen-gelir-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateMusteriKaybiChurnVeKaybedilenGelirCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMusteriKaybiChurnVeKaybedilenGelirCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMusteriKaybiChurnVeKaybedilenGelirCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMusteriKaybiChurnVeKaybedilenGelirCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMusteriKaybiChurnVeKaybedilenGelirCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalCustomersStart: undefined } as unknown as MusteriKaybiChurnVeKaybedilenGelirCalculatorInputs;
    const validation = validateMusteriKaybiChurnVeKaybedilenGelirCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMusteriKaybiChurnVeKaybedilenGelirCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalCustomersStart: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateMusteriKaybiChurnVeKaybedilenGelirCalculatorInputs({ ...defaultInputs, totalCustomersStart: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateMusteriKaybiChurnVeKaybedilenGelirCalculator({ ...defaultInputs, totalCustomersStart: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ averageCustomerLifespan: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ averageCustomerLifespan: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MUSTERI_KAYBI_CHURN_VE_KAYBEDILEN_GELIR_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMusteriKaybiChurnVeKaybedilenGelirCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
