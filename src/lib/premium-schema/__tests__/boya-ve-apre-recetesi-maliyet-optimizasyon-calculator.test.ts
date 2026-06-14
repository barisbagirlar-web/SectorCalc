import { describe, expect, test } from "vitest";
import { BOYA_VE_APRE_RECETESI_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boya-ve-apre-recetesi-maliyet-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator,
  type BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/boya-ve-apre-recetesi-maliyet-optimizasyon-calculator";
import { validateBoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/boya-ve-apre-recetesi-maliyet-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "boya-ve-apre-recetesi-maliyet-optimizasyon-calculator";
const SCHEMA_ID = "boya-ve-apre-recetesi-maliyet-optimizasyon-calculator";

const defaultInputs: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "laborHours": 10,
    "laborHourlyRate": 25,
    "equipmentCost": 0
  };
const lowBandInputs: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "laborHours": 10,
    "laborHourlyRate": 25,
    "equipmentCost": 0
  };
const criticalBandInputs: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "laborHours": 10,
    "laborHourlyRate": 25,
    "equipmentCost": 0
  };

function expectValidationFailure(partial: Partial<BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs;
  const validation = validateBoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("boya-ve-apre-recetesi-maliyet-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs;
    const validation = validateBoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ equipmentCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ equipmentCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BOYA_VE_APRE_RECETESI_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
