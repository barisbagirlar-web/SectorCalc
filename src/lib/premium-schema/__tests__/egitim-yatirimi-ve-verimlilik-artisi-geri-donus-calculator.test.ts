import { describe, expect, test } from "vitest";
import { EGITIM_YATIRIMI_VE_VERIMLILIK_ARTISI_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator,
  type EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs,
} from "@/lib/premium-schema/calculators/egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator";
import { validateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs } from "@/lib/premium-schema/calculators/egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator";
const SCHEMA_ID = "egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator";

const defaultInputs: EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs = {
    "numberOfEmployeesTrained": 50,
    "trainingCostPerEmployee": 500,
    "fixedTrainingCost": 2000,
    "baselineProductivityPerEmployee": 100,
    "productivityImprovementPercent": 10,
    "numberOfMonthsProductive": 12
  };
const lowBandInputs: EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs = {
    "numberOfEmployeesTrained": 1,
    "trainingCostPerEmployee": 500,
    "fixedTrainingCost": 2000,
    "baselineProductivityPerEmployee": 100,
    "productivityImprovementPercent": 10,
    "numberOfMonthsProductive": 12
  };
const criticalBandInputs: EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs = {
    "numberOfEmployeesTrained": 6,
    "trainingCostPerEmployee": 500,
    "fixedTrainingCost": 2000,
    "baselineProductivityPerEmployee": 100,
    "productivityImprovementPercent": 10,
    "numberOfMonthsProductive": 12
  };

function expectValidationFailure(partial: Partial<EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs;
  const validation = validateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, numberOfEmployeesTrained: undefined } as unknown as EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs;
    const validation = validateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ numberOfEmployeesTrained: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs({ ...defaultInputs, numberOfEmployeesTrained: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator({ ...defaultInputs, numberOfEmployeesTrained: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ numberOfMonthsProductive: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ numberOfMonthsProductive: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = EGITIM_YATIRIMI_VE_VERIMLILIK_ARTISI_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
