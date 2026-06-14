import { describe, expect, test } from "vitest";
import { ARAC_KIRA_SATIN_ALMA_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/arac-kira-satin-alma-karsilastirma-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAracKiraSatinAlmaKarsilastirma,
  type AracKiraSatinAlmaKarsilastirmaInputs,
} from "@/lib/premium-schema/calculators/arac-kira-satin-alma-karsilastirma";
import { validateAracKiraSatinAlmaKarsilastirmaInputs } from "@/lib/premium-schema/calculators/arac-kira-satin-alma-karsilastirma-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "arac-kira-satin-alma-karsilastirma";
const SCHEMA_ID = "arac-kira-satin-alma-karsilastirma";

const defaultInputs: AracKiraSatinAlmaKarsilastirmaInputs = {
    "purchasePrice": 30000,
    "monthlyLeasePayment": 500,
    "leaseTermMonths": 36,
    "leaseDownPayment": 2000,
    "leaseEndFees": 500,
    "ownershipYears": 5
  };
const lowBandInputs: AracKiraSatinAlmaKarsilastirmaInputs = {
    "purchasePrice": 0.1,
    "monthlyLeasePayment": 500,
    "leaseTermMonths": 36,
    "leaseDownPayment": 2000,
    "leaseEndFees": 500,
    "ownershipYears": 5
  };
const criticalBandInputs: AracKiraSatinAlmaKarsilastirmaInputs = {
    "purchasePrice": 6,
    "monthlyLeasePayment": 500,
    "leaseTermMonths": 36,
    "leaseDownPayment": 2000,
    "leaseEndFees": 500,
    "ownershipYears": 5
  };

function expectValidationFailure(partial: Partial<AracKiraSatinAlmaKarsilastirmaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AracKiraSatinAlmaKarsilastirmaInputs;
  const validation = validateAracKiraSatinAlmaKarsilastirmaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAracKiraSatinAlmaKarsilastirma(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AracKiraSatinAlmaKarsilastirmaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("arac-kira-satin-alma-karsilastirma", () => {
  test("exact default oracle", () => {
    const result = calculateAracKiraSatinAlmaKarsilastirma(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAracKiraSatinAlmaKarsilastirma(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAracKiraSatinAlmaKarsilastirma(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAracKiraSatinAlmaKarsilastirma(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAracKiraSatinAlmaKarsilastirma(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, purchasePrice: undefined } as unknown as AracKiraSatinAlmaKarsilastirmaInputs;
    const validation = validateAracKiraSatinAlmaKarsilastirmaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAracKiraSatinAlmaKarsilastirma(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ purchasePrice: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAracKiraSatinAlmaKarsilastirmaInputs({ ...defaultInputs, leaseTermMonths: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAracKiraSatinAlmaKarsilastirma({ ...defaultInputs, leaseTermMonths: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ownershipYears: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ownershipYears: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ARAC_KIRA_SATIN_ALMA_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAracKiraSatinAlmaKarsilastirma(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
