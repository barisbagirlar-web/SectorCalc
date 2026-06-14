import { describe, expect, test } from "vitest";
import { CIT_KORKULUK_MALZEME_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cit-korkuluk-malzeme-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCitKorkulukMalzemeHesabi,
  type CitKorkulukMalzemeHesabiInputs,
} from "@/lib/premium-schema/calculators/cit-korkuluk-malzeme-hesabi";
import { validateCitKorkulukMalzemeHesabiInputs } from "@/lib/premium-schema/calculators/cit-korkuluk-malzeme-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cit-korkuluk-malzeme-hesabi";
const SCHEMA_ID = "cit-korkuluk-malzeme-hesabi";

const defaultInputs: CitKorkulukMalzemeHesabiInputs = {
    "totalLength": 100,
    "postSpacing": 2.5,
    "numberOfRails": 2,
    "panelWidth": 0.1,
    "wasteFactorPercent": 5,
    "materialDensity": 7850
  };
const lowBandInputs: CitKorkulukMalzemeHesabiInputs = {
    "totalLength": 0.1,
    "postSpacing": 2.5,
    "numberOfRails": 2,
    "panelWidth": 0.1,
    "wasteFactorPercent": 5,
    "materialDensity": 7850
  };
const criticalBandInputs: CitKorkulukMalzemeHesabiInputs = {
    "totalLength": 6,
    "postSpacing": 2.5,
    "numberOfRails": 2,
    "panelWidth": 0.1,
    "wasteFactorPercent": 5,
    "materialDensity": 7850
  };

function expectValidationFailure(partial: Partial<CitKorkulukMalzemeHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CitKorkulukMalzemeHesabiInputs;
  const validation = validateCitKorkulukMalzemeHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCitKorkulukMalzemeHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CitKorkulukMalzemeHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("cit-korkuluk-malzeme-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateCitKorkulukMalzemeHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCitKorkulukMalzemeHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCitKorkulukMalzemeHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCitKorkulukMalzemeHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCitKorkulukMalzemeHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalLength: undefined } as unknown as CitKorkulukMalzemeHesabiInputs;
    const validation = validateCitKorkulukMalzemeHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCitKorkulukMalzemeHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCitKorkulukMalzemeHesabiInputs({ ...defaultInputs, totalLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCitKorkulukMalzemeHesabi({ ...defaultInputs, totalLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ materialDensity: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ materialDensity: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CIT_KORKULUK_MALZEME_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCitKorkulukMalzemeHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
