import { describe, expect, test } from "vitest";
import { RECETE_MALIYETI_VE_ALTERNATIF_HAMMADDE_ETKI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/recete-maliyeti-ve-alternatif-hammadde-etki-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator,
  type ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs,
} from "@/lib/premium-schema/calculators/recete-maliyeti-ve-alternatif-hammadde-etki-calculator";
import { validateReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs } from "@/lib/premium-schema/calculators/recete-maliyeti-ve-alternatif-hammadde-etki-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "recete-maliyeti-ve-alternatif-hammadde-etki-calculator";
const SCHEMA_ID = "recete-maliyeti-ve-alternatif-hammadde-etki-calculator";

const defaultInputs: ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs = {
    "productionQuantity": 100,
    "baseMaterialPrice": 10,
    "scrapRate": 5,
    "yieldFactor": 0.95,
    "altMaterialPrice": 12,
    "altScrapRate": 3
  };
const lowBandInputs: ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs = {
    "productionQuantity": 1,
    "baseMaterialPrice": 10,
    "scrapRate": 5,
    "yieldFactor": 0.95,
    "altMaterialPrice": 12,
    "altScrapRate": 3
  };
const criticalBandInputs: ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs = {
    "productionQuantity": 6,
    "baseMaterialPrice": 10,
    "scrapRate": 5,
    "yieldFactor": 0.95,
    "altMaterialPrice": 12,
    "altScrapRate": 3
  };

function expectValidationFailure(partial: Partial<ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs;
  const validation = validateReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("recete-maliyeti-ve-alternatif-hammadde-etki-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs;
    const validation = validateReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ altScrapRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ altScrapRate: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = RECETE_MALIYETI_VE_ALTERNATIF_HAMMADDE_ETKI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
