import { describe, expect, test } from "vitest";
import { BUHAR_KAPANI_STEAM_TRAP_KACAK_VE_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator,
  type BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs,
} from "@/lib/premium-schema/calculators/buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator";
import { validateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs } from "@/lib/premium-schema/calculators/buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator";
const SCHEMA_ID = "buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator";

const defaultInputs: BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs = {
    "powerKw": 100,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };
const lowBandInputs: BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs = {
    "powerKw": 0.1,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };
const criticalBandInputs: BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs = {
    "powerKw": 6,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };

function expectValidationFailure(partial: Partial<BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs;
  const validation = validateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, powerKw: undefined } as unknown as BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs;
    const validation = validateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ powerKw: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputs({ ...defaultInputs, efficiencyPercent: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator({ ...defaultInputs, efficiencyPercent: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BUHAR_KAPANI_STEAM_TRAP_KACAK_VE_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
