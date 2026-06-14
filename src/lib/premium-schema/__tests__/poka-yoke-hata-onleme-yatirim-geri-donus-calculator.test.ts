import { describe, expect, test } from "vitest";
import { POKA_YOKE_HATA_ONLEME_YATIRIM_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/poka-yoke-hata-onleme-yatirim-geri-donus-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator,
  type PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs,
} from "@/lib/premium-schema/calculators/poka-yoke-hata-onleme-yatirim-geri-donus-calculator";
import { validatePokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs } from "@/lib/premium-schema/calculators/poka-yoke-hata-onleme-yatirim-geri-donus-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "poka-yoke-hata-onleme-yatirim-geri-donus-calculator";
const SCHEMA_ID = "poka-yoke-hata-onleme-yatirim-geri-donus-calculator";

const defaultInputs: PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs = {
    "productionVolume": 100000,
    "defectRateBefore": 5,
    "defectRateAfter": 0.5,
    "unitCostOfDefect": 50,
    "investmentCost": 50000,
    "usefulLifeYears": 5
  };
const lowBandInputs: PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs = {
    "productionVolume": 1,
    "defectRateBefore": 5,
    "defectRateAfter": 0.5,
    "unitCostOfDefect": 50,
    "investmentCost": 50000,
    "usefulLifeYears": 5
  };
const criticalBandInputs: PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs = {
    "productionVolume": 6,
    "defectRateBefore": 5,
    "defectRateAfter": 0.5,
    "unitCostOfDefect": 50,
    "investmentCost": 50000,
    "usefulLifeYears": 5
  };

function expectValidationFailure(partial: Partial<PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs;
  const validation = validatePokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("poka-yoke-hata-onleme-yatirim-geri-donus-calculator", () => {
  test("exact default oracle", () => {
    const result = calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionVolume: undefined } as unknown as PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs;
    const validation = validatePokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionVolume: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs({ ...defaultInputs, productionVolume: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator({ ...defaultInputs, productionVolume: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ usefulLifeYears: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ usefulLifeYears: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = POKA_YOKE_HATA_ONLEME_YATIRIM_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
