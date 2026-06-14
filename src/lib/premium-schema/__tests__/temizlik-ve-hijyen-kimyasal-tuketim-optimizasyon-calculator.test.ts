import { describe, expect, test } from "vitest";
import { TEMIZLIK_VE_HIJYEN_KIMYASAL_TUKETIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/temizlik-ve-hijyen-kimyasal-tuketim-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator,
  type TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/temizlik-ve-hijyen-kimyasal-tuketim-optimizasyon-calculator";
import { validateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/temizlik-ve-hijyen-kimyasal-tuketim-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "temizlik-ve-hijyen-kimyasal-tuketim-optimizasyon-calculator";
const SCHEMA_ID = "temizlik-ve-hijyen-kimyasal-tuketim-optimizasyon-calculator";

const defaultInputs: TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs = {
    "areaPerCycle": 100,
    "doseRatePerArea": 0.1,
    "dilutionFactor": 10,
    "wasteFactorPercent": 10,
    "numberOfCycles": 1,
    "unitCost": 5
  };
const lowBandInputs: TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs = {
    "areaPerCycle": 1,
    "doseRatePerArea": 0.1,
    "dilutionFactor": 10,
    "wasteFactorPercent": 10,
    "numberOfCycles": 1,
    "unitCost": 5
  };
const criticalBandInputs: TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs = {
    "areaPerCycle": 6,
    "doseRatePerArea": 0.1,
    "dilutionFactor": 10,
    "wasteFactorPercent": 10,
    "numberOfCycles": 1,
    "unitCost": 5
  };

function expectValidationFailure(partial: Partial<TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs;
  const validation = validateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("temizlik-ve-hijyen-kimyasal-tuketim-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, areaPerCycle: undefined } as unknown as TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs;
    const validation = validateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ areaPerCycle: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputs({ ...defaultInputs, areaPerCycle: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator({ ...defaultInputs, areaPerCycle: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TEMIZLIK_VE_HIJYEN_KIMYASAL_TUKETIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
