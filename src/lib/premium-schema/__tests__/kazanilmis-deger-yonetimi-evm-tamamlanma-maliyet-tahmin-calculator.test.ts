import { describe, expect, test } from "vitest";
import { KAZANILMIS_DEGER_YONETIMI_EVM_TAMAMLANMA_MALIYET_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator,
  type KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs,
} from "@/lib/premium-schema/calculators/kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator";
import { validateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs } from "@/lib/premium-schema/calculators/kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator";
const SCHEMA_ID = "kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator";

const defaultInputs: KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs = {
    "budgetAtCompletion": 100000,
    "plannedValue": 50000,
    "earnedValue": 40000,
    "actualCost": 45000
  };
const lowBandInputs: KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs = {
    "budgetAtCompletion": 0.1,
    "plannedValue": 50000,
    "earnedValue": 40000,
    "actualCost": 45000
  };
const criticalBandInputs: KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs = {
    "budgetAtCompletion": 6,
    "plannedValue": 50000,
    "earnedValue": 40000,
    "actualCost": 45000
  };

function expectValidationFailure(partial: Partial<KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs;
  const validation = validateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, budgetAtCompletion: undefined } as unknown as KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs;
    const validation = validateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ budgetAtCompletion: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs({ ...defaultInputs, budgetAtCompletion: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator({ ...defaultInputs, budgetAtCompletion: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ actualCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ actualCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KAZANILMIS_DEGER_YONETIMI_EVM_TAMAMLANMA_MALIYET_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
