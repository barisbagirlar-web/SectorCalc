import { describe, expect, test } from "vitest";
import { YEDEK_PARCA_STOK_SEVIYESI_VE_DURUS_RISKI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator,
  type YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator";
import { validateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator";
const SCHEMA_ID = "yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator";

const defaultInputs: YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs = {
    "averageInventoryValue": 500000,
    "inventoryUnits": 10000,
    "unitCost": 50,
    "holdingCostRatePercent": 20,
    "obsolescenceRatePercent": 5,
    "excessUnits": 500
  };
const lowBandInputs: YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs = {
    "averageInventoryValue": 0.1,
    "inventoryUnits": 10000,
    "unitCost": 50,
    "holdingCostRatePercent": 20,
    "obsolescenceRatePercent": 5,
    "excessUnits": 500
  };
const criticalBandInputs: YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs = {
    "averageInventoryValue": 6,
    "inventoryUnits": 10000,
    "unitCost": 50,
    "holdingCostRatePercent": 20,
    "obsolescenceRatePercent": 5,
    "excessUnits": 500
  };

function expectValidationFailure(partial: Partial<YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs;
  const validation = validateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, averageInventoryValue: undefined } as unknown as YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs;
    const validation = validateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ averageInventoryValue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs({ ...defaultInputs, inventoryUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator({ ...defaultInputs, inventoryUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ excessUnits: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ excessUnits: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = YEDEK_PARCA_STOK_SEVIYESI_VE_DURUS_RISKI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
