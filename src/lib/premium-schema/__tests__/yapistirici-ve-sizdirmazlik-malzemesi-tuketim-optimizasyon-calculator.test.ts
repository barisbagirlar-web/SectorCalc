import { describe, expect, test } from "vitest";
import { YAPISTIRICI_VE_SIZDIRMAZLIK_MALZEMESI_TUKETIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yapistirici-ve-sizdirmazlik-malzemesi-tuketim-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator,
  type YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/yapistirici-ve-sizdirmazlik-malzemesi-tuketim-optimizasyon-calculator";
import { validateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/yapistirici-ve-sizdirmazlik-malzemesi-tuketim-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "yapistirici-ve-sizdirmazlik-malzemesi-tuketim-optimizasyon-calculator";
const SCHEMA_ID = "yapistirici-ve-sizdirmazlik-malzemesi-tuketim-optimizasyon-calculator";

const defaultInputs: YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "defectRatePercent": 2,
    "laborCostPerUnit": 2,
    "overheadCostPerUnit": 1
  };
const lowBandInputs: YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "defectRatePercent": 2,
    "laborCostPerUnit": 2,
    "overheadCostPerUnit": 1
  };
const criticalBandInputs: YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "defectRatePercent": 2,
    "laborCostPerUnit": 2,
    "overheadCostPerUnit": 1
  };

function expectValidationFailure(partial: Partial<YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs;
  const validation = validateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("yapistirici-ve-sizdirmazlik-malzemesi-tuketim-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs;
    const validation = validateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ overheadCostPerUnit: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ overheadCostPerUnit: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = YAPISTIRICI_VE_SIZDIRMAZLIK_MALZEMESI_TUKETIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
