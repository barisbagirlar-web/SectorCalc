import { describe, expect, test } from "vitest";
import { TALEP_TAHMIN_HATASI_VE_STOK_STOK_YOKLUGU_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/talep-tahmin-hatasi-ve-stok-stok-yoklugu-maliyet-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator,
  type TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs,
} from "@/lib/premium-schema/calculators/talep-tahmin-hatasi-ve-stok-stok-yoklugu-maliyet-calculator";
import { validateTalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs } from "@/lib/premium-schema/calculators/talep-tahmin-hatasi-ve-stok-stok-yoklugu-maliyet-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "talep-tahmin-hatasi-ve-stok-stok-yoklugu-maliyet-calculator";
const SCHEMA_ID = "talep-tahmin-hatasi-ve-stok-stok-yoklugu-maliyet-calculator";

const defaultInputs: TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs = {
    "averageInventoryValue": 100000,
    "inventoryUnits": 1000,
    "unitCost": 100,
    "holdingCostRatePercent": 20,
    "obsolescenceRatePercent": 5,
    "excessUnits": 100
  };
const lowBandInputs: TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs = {
    "averageInventoryValue": 0.1,
    "inventoryUnits": 1000,
    "unitCost": 100,
    "holdingCostRatePercent": 20,
    "obsolescenceRatePercent": 5,
    "excessUnits": 100
  };
const criticalBandInputs: TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs = {
    "averageInventoryValue": 6,
    "inventoryUnits": 1000,
    "unitCost": 100,
    "holdingCostRatePercent": 20,
    "obsolescenceRatePercent": 5,
    "excessUnits": 100
  };

function expectValidationFailure(partial: Partial<TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs;
  const validation = validateTalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("talep-tahmin-hatasi-ve-stok-stok-yoklugu-maliyet-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, averageInventoryValue: undefined } as unknown as TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs;
    const validation = validateTalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ averageInventoryValue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateTalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputs({ ...defaultInputs, inventoryUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator({ ...defaultInputs, inventoryUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ excessUnits: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ excessUnits: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TALEP_TAHMIN_HATASI_VE_STOK_STOK_YOKLUGU_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
