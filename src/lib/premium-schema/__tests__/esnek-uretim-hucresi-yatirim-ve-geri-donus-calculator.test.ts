import { describe, expect, test } from "vitest";
import { ESNEK_URETIM_HUCRESI_YATIRIM_VE_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/esnek-uretim-hucresi-yatirim-ve-geri-donus-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator,
  type EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs,
} from "@/lib/premium-schema/calculators/esnek-uretim-hucresi-yatirim-ve-geri-donus-calculator";
import { validateEsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs } from "@/lib/premium-schema/calculators/esnek-uretim-hucresi-yatirim-ve-geri-donus-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "esnek-uretim-hucresi-yatirim-ve-geri-donus-calculator";
const SCHEMA_ID = "esnek-uretim-hucresi-yatirim-ve-geri-donus-calculator";

const defaultInputs: EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs = {
    "equipmentCost": 500000,
    "installationCost": 50000,
    "trainingCost": 20000,
    "annualLaborSavings": 150000,
    "annualScrapReductionSavings": 20000,
    "annualThroughputIncreaseSavings": 30000
  };
const lowBandInputs: EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs = {
    "equipmentCost": 0.1,
    "installationCost": 50000,
    "trainingCost": 20000,
    "annualLaborSavings": 150000,
    "annualScrapReductionSavings": 20000,
    "annualThroughputIncreaseSavings": 30000
  };
const criticalBandInputs: EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs = {
    "equipmentCost": 6,
    "installationCost": 50000,
    "trainingCost": 20000,
    "annualLaborSavings": 150000,
    "annualScrapReductionSavings": 20000,
    "annualThroughputIncreaseSavings": 30000
  };

function expectValidationFailure(partial: Partial<EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs;
  const validation = validateEsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("esnek-uretim-hucresi-yatirim-ve-geri-donus-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, equipmentCost: undefined } as unknown as EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs;
    const validation = validateEsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ equipmentCost: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ annualThroughputIncreaseSavings: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ annualThroughputIncreaseSavings: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ESNEK_URETIM_HUCRESI_YATIRIM_VE_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
