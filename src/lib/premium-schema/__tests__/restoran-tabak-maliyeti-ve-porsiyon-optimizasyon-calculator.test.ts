import { describe, expect, test } from "vitest";
import { RESTORAN_TABAK_MALIYETI_VE_PORSIYON_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/restoran-tabak-maliyeti-ve-porsiyon-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator,
  type RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/restoran-tabak-maliyeti-ve-porsiyon-optimizasyon-calculator";
import { validateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/restoran-tabak-maliyeti-ve-porsiyon-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "restoran-tabak-maliyeti-ve-porsiyon-optimizasyon-calculator";
const SCHEMA_ID = "restoran-tabak-maliyeti-ve-porsiyon-optimizasyon-calculator";

const defaultInputs: RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs = {
    "ingredientCostPerPortion": 5,
    "yieldLossRate": 10,
    "laborCostPerHour": 20,
    "portionsPerHour": 30,
    "overheadRate": 15,
    "sellingPrice": 15
  };
const lowBandInputs: RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs = {
    "ingredientCostPerPortion": 0.1,
    "yieldLossRate": 10,
    "laborCostPerHour": 20,
    "portionsPerHour": 30,
    "overheadRate": 15,
    "sellingPrice": 15
  };
const criticalBandInputs: RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs = {
    "ingredientCostPerPortion": 6,
    "yieldLossRate": 10,
    "laborCostPerHour": 20,
    "portionsPerHour": 30,
    "overheadRate": 15,
    "sellingPrice": 15
  };

function expectValidationFailure(partial: Partial<RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs;
  const validation = validateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("restoran-tabak-maliyeti-ve-porsiyon-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, ingredientCostPerPortion: undefined } as unknown as RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs;
    const validation = validateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ ingredientCostPerPortion: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs({ ...defaultInputs, portionsPerHour: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator({ ...defaultInputs, portionsPerHour: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ sellingPrice: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ sellingPrice: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = RESTORAN_TABAK_MALIYETI_VE_PORSIYON_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
