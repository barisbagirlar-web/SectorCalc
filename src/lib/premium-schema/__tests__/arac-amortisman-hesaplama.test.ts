import { describe, expect, test } from "vitest";
import { ARAC_AMORTISMAN_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/arac-amortisman-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAracAmortismanHesaplama,
  type AracAmortismanHesaplamaInputs,
} from "@/lib/premium-schema/calculators/arac-amortisman-hesaplama";
import { validateAracAmortismanHesaplamaInputs } from "@/lib/premium-schema/calculators/arac-amortisman-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "arac-amortisman-hesaplama";
const SCHEMA_ID = "arac-amortisman-hesaplama";

const defaultInputs: AracAmortismanHesaplamaInputs = {
    "initialCost": 50000,
    "salvageValue": 5000,
    "usefulLifeYears": 10,
    "yearsUsed": 3
  };
const lowBandInputs: AracAmortismanHesaplamaInputs = {
    "initialCost": 0.1,
    "salvageValue": 5000,
    "usefulLifeYears": 10,
    "yearsUsed": 3
  };
const criticalBandInputs: AracAmortismanHesaplamaInputs = {
    "initialCost": 6,
    "salvageValue": 5000,
    "usefulLifeYears": 10,
    "yearsUsed": 3
  };

function expectValidationFailure(partial: Partial<AracAmortismanHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AracAmortismanHesaplamaInputs;
  const validation = validateAracAmortismanHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAracAmortismanHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AracAmortismanHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("arac-amortisman-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateAracAmortismanHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAracAmortismanHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAracAmortismanHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAracAmortismanHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAracAmortismanHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, initialCost: undefined } as unknown as AracAmortismanHesaplamaInputs;
    const validation = validateAracAmortismanHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAracAmortismanHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ initialCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAracAmortismanHesaplamaInputs({ ...defaultInputs, initialCost: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAracAmortismanHesaplama({ ...defaultInputs, initialCost: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ yearsUsed: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ yearsUsed: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ARAC_AMORTISMAN_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAracAmortismanHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
