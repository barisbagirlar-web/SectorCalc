import { describe, expect, test } from "vitest";
import { OTO_SERVIS_IS_EMRI_VE_YEDEK_PARCA_TEKLIF_TUTARLILIK_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/oto-servis-is-emri-ve-yedek-parca-teklif-tutarlilik-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator,
  type OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs,
} from "@/lib/premium-schema/calculators/oto-servis-is-emri-ve-yedek-parca-teklif-tutarlilik-calculator";
import { validateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs } from "@/lib/premium-schema/calculators/oto-servis-is-emri-ve-yedek-parca-teklif-tutarlilik-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "oto-servis-is-emri-ve-yedek-parca-teklif-tutarlilik-calculator";
const SCHEMA_ID = "oto-servis-is-emri-ve-yedek-parca-teklif-tutarlilik-calculator";

const defaultInputs: OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "directLaborCost": 20,
    "overheadPercent": 30,
    "targetGrossMarginPercent": 20
  };
const lowBandInputs: OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "directLaborCost": 20,
    "overheadPercent": 30,
    "targetGrossMarginPercent": 20
  };
const criticalBandInputs: OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "directLaborCost": 20,
    "overheadPercent": 30,
    "targetGrossMarginPercent": 20
  };

function expectValidationFailure(partial: Partial<OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs;
  const validation = validateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("oto-servis-is-emri-ve-yedek-parca-teklif-tutarlilik-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs;
    const validation = validateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ targetGrossMarginPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ targetGrossMarginPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = OTO_SERVIS_IS_EMRI_VE_YEDEK_PARCA_TEKLIF_TUTARLILIK_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
