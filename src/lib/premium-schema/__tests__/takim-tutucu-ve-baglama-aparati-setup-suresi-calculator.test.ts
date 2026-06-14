import { describe, expect, test } from "vitest";
import { TAKIM_TUTUCU_VE_BAGLAMA_APARATI_SETUP_SURESI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/takim-tutucu-ve-baglama-aparati-setup-suresi-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator,
  type TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs,
} from "@/lib/premium-schema/calculators/takim-tutucu-ve-baglama-aparati-setup-suresi-calculator";
import { validateTakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs } from "@/lib/premium-schema/calculators/takim-tutucu-ve-baglama-aparati-setup-suresi-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "takim-tutucu-ve-baglama-aparati-setup-suresi-calculator";
const SCHEMA_ID = "takim-tutucu-ve-baglama-aparati-setup-suresi-calculator";

const defaultInputs: TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs = {
    "numberOfTools": 5,
    "numberOfFixtureChanges": 2,
    "baseTimePerTool": 5,
    "baseTimePerFixtureChange": 10,
    "complexityFactor": 1,
    "operatorSkillFactor": 1
  };
const lowBandInputs: TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs = {
    "numberOfTools": 1,
    "numberOfFixtureChanges": 2,
    "baseTimePerTool": 5,
    "baseTimePerFixtureChange": 10,
    "complexityFactor": 1,
    "operatorSkillFactor": 1
  };
const criticalBandInputs: TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs = {
    "numberOfTools": 6,
    "numberOfFixtureChanges": 2,
    "baseTimePerTool": 5,
    "baseTimePerFixtureChange": 10,
    "complexityFactor": 1,
    "operatorSkillFactor": 1
  };

function expectValidationFailure(partial: Partial<TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs;
  const validation = validateTakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("takim-tutucu-ve-baglama-aparati-setup-suresi-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, numberOfTools: undefined } as unknown as TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs;
    const validation = validateTakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ numberOfTools: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateTakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputs({ ...defaultInputs, numberOfTools: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator({ ...defaultInputs, numberOfTools: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ operatorSkillFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ operatorSkillFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TAKIM_TUTUCU_VE_BAGLAMA_APARATI_SETUP_SURESI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
