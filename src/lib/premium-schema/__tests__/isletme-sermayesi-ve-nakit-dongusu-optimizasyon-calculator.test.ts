import { describe, expect, test } from "vitest";
import { ISLETME_SERMAYESI_VE_NAKIT_DONGUSU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator,
  type IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator";
import { validateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator";
const SCHEMA_ID = "isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator";

const defaultInputs: IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs = {
    "averageInventory": 500000,
    "costOfGoodsSold": 2000000,
    "averageAccountsReceivable": 400000,
    "netCreditSales": 2500000,
    "averageAccountsPayable": 300000,
    "targetCCC": 30
  };
const lowBandInputs: IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs = {
    "averageInventory": 0.1,
    "costOfGoodsSold": 2000000,
    "averageAccountsReceivable": 400000,
    "netCreditSales": 2500000,
    "averageAccountsPayable": 300000,
    "targetCCC": 30
  };
const criticalBandInputs: IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs = {
    "averageInventory": 6,
    "costOfGoodsSold": 2000000,
    "averageAccountsReceivable": 400000,
    "netCreditSales": 2500000,
    "averageAccountsPayable": 300000,
    "targetCCC": 30
  };

function expectValidationFailure(partial: Partial<IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs;
  const validation = validateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, averageInventory: undefined } as unknown as IsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs;
    const validation = validateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ averageInventory: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculatorInputs({ ...defaultInputs, costOfGoodsSold: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator({ ...defaultInputs, costOfGoodsSold: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ targetCCC: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ targetCCC: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ISLETME_SERMAYESI_VE_NAKIT_DONGUSU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIsletmeSermayesiVeNakitDongusuOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
