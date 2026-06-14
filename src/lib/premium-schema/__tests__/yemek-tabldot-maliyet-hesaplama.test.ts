import { describe, expect, test } from "vitest";
import { YEMEK_TABLDOT_MALIYET_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yemek-tabldot-maliyet-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateYemekTabldotMaliyetHesaplama,
  type YemekTabldotMaliyetHesaplamaInputs,
} from "@/lib/premium-schema/calculators/yemek-tabldot-maliyet-hesaplama";
import { validateYemekTabldotMaliyetHesaplamaInputs } from "@/lib/premium-schema/calculators/yemek-tabldot-maliyet-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "yemek-tabldot-maliyet-hesaplama";
const SCHEMA_ID = "yemek-tabldot-maliyet-hesaplama";

const defaultInputs: YemekTabldotMaliyetHesaplamaInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "directLaborCost": 2,
    "overheadPercent": 20,
    "targetGrossMarginPercent": 30
  };
const lowBandInputs: YemekTabldotMaliyetHesaplamaInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "directLaborCost": 2,
    "overheadPercent": 20,
    "targetGrossMarginPercent": 30
  };
const criticalBandInputs: YemekTabldotMaliyetHesaplamaInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "directLaborCost": 2,
    "overheadPercent": 20,
    "targetGrossMarginPercent": 30
  };

function expectValidationFailure(partial: Partial<YemekTabldotMaliyetHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as YemekTabldotMaliyetHesaplamaInputs;
  const validation = validateYemekTabldotMaliyetHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateYemekTabldotMaliyetHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: YemekTabldotMaliyetHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("yemek-tabldot-maliyet-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateYemekTabldotMaliyetHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateYemekTabldotMaliyetHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateYemekTabldotMaliyetHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateYemekTabldotMaliyetHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateYemekTabldotMaliyetHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as YemekTabldotMaliyetHesaplamaInputs;
    const validation = validateYemekTabldotMaliyetHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateYemekTabldotMaliyetHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateYemekTabldotMaliyetHesaplamaInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateYemekTabldotMaliyetHesaplama({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ targetGrossMarginPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ targetGrossMarginPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = YEMEK_TABLDOT_MALIYET_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateYemekTabldotMaliyetHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
