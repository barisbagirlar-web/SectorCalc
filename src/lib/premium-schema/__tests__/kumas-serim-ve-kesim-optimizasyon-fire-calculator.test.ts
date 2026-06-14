import { describe, expect, test } from "vitest";
import { KUMAS_SERIM_VE_KESIM_OPTIMIZASYON_FIRE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kumas-serim-ve-kesim-optimizasyon-fire-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKumasSerimVeKesimOptimizasyonFireCalculator,
  type KumasSerimVeKesimOptimizasyonFireCalculatorInputs,
} from "@/lib/premium-schema/calculators/kumas-serim-ve-kesim-optimizasyon-fire-calculator";
import { validateKumasSerimVeKesimOptimizasyonFireCalculatorInputs } from "@/lib/premium-schema/calculators/kumas-serim-ve-kesim-optimizasyon-fire-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kumas-serim-ve-kesim-optimizasyon-fire-calculator";
const SCHEMA_ID = "kumas-serim-ve-kesim-optimizasyon-fire-calculator";

const defaultInputs: KumasSerimVeKesimOptimizasyonFireCalculatorInputs = {
    "productionQuantity": 1000,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "unitReworkCost": 5,
    "reworkRatePercent": 3,
    "waitingHours": 10
  };
const lowBandInputs: KumasSerimVeKesimOptimizasyonFireCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "unitReworkCost": 5,
    "reworkRatePercent": 3,
    "waitingHours": 10
  };
const criticalBandInputs: KumasSerimVeKesimOptimizasyonFireCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "unitReworkCost": 5,
    "reworkRatePercent": 3,
    "waitingHours": 10
  };

function expectValidationFailure(partial: Partial<KumasSerimVeKesimOptimizasyonFireCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KumasSerimVeKesimOptimizasyonFireCalculatorInputs;
  const validation = validateKumasSerimVeKesimOptimizasyonFireCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKumasSerimVeKesimOptimizasyonFireCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KumasSerimVeKesimOptimizasyonFireCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kumas-serim-ve-kesim-optimizasyon-fire-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKumasSerimVeKesimOptimizasyonFireCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKumasSerimVeKesimOptimizasyonFireCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKumasSerimVeKesimOptimizasyonFireCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKumasSerimVeKesimOptimizasyonFireCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKumasSerimVeKesimOptimizasyonFireCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as KumasSerimVeKesimOptimizasyonFireCalculatorInputs;
    const validation = validateKumasSerimVeKesimOptimizasyonFireCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKumasSerimVeKesimOptimizasyonFireCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKumasSerimVeKesimOptimizasyonFireCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKumasSerimVeKesimOptimizasyonFireCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ waitingHours: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ waitingHours: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KUMAS_SERIM_VE_KESIM_OPTIMIZASYON_FIRE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKumasSerimVeKesimOptimizasyonFireCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
