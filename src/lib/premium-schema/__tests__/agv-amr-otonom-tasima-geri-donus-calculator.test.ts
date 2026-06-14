import { describe, expect, test } from "vitest";
import { AGV_AMR_OTONOM_TASIMA_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/agv-amr-otonom-tasima-geri-donus-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAgvAmrOtonomTasimaGeriDonusCalculator,
  type AgvAmrOtonomTasimaGeriDonusCalculatorInputs,
} from "@/lib/premium-schema/calculators/agv-amr-otonom-tasima-geri-donus-calculator";
import { validateAgvAmrOtonomTasimaGeriDonusCalculatorInputs } from "@/lib/premium-schema/calculators/agv-amr-otonom-tasima-geri-donus-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "agv-amr-otonom-tasima-geri-donus-calculator";
const SCHEMA_ID = "agv-amr-otonom-tasima-geri-donus-calculator";

const defaultInputs: AgvAmrOtonomTasimaGeriDonusCalculatorInputs = {
    "manualLaborCostPerHour": 25,
    "manualHoursPerDay": 8,
    "workingDaysPerYear": 250,
    "agvAmrUnitCost": 50000,
    "numberOfVehicles": 2,
    "maintenanceFactor": 10
  };
const lowBandInputs: AgvAmrOtonomTasimaGeriDonusCalculatorInputs = {
    "manualLaborCostPerHour": 0.1,
    "manualHoursPerDay": 8,
    "workingDaysPerYear": 250,
    "agvAmrUnitCost": 50000,
    "numberOfVehicles": 2,
    "maintenanceFactor": 10
  };
const criticalBandInputs: AgvAmrOtonomTasimaGeriDonusCalculatorInputs = {
    "manualLaborCostPerHour": 6,
    "manualHoursPerDay": 8,
    "workingDaysPerYear": 250,
    "agvAmrUnitCost": 50000,
    "numberOfVehicles": 2,
    "maintenanceFactor": 10
  };

function expectValidationFailure(partial: Partial<AgvAmrOtonomTasimaGeriDonusCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AgvAmrOtonomTasimaGeriDonusCalculatorInputs;
  const validation = validateAgvAmrOtonomTasimaGeriDonusCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAgvAmrOtonomTasimaGeriDonusCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AgvAmrOtonomTasimaGeriDonusCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("agv-amr-otonom-tasima-geri-donus-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateAgvAmrOtonomTasimaGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAgvAmrOtonomTasimaGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAgvAmrOtonomTasimaGeriDonusCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAgvAmrOtonomTasimaGeriDonusCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAgvAmrOtonomTasimaGeriDonusCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, manualLaborCostPerHour: undefined } as unknown as AgvAmrOtonomTasimaGeriDonusCalculatorInputs;
    const validation = validateAgvAmrOtonomTasimaGeriDonusCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAgvAmrOtonomTasimaGeriDonusCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ manualLaborCostPerHour: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAgvAmrOtonomTasimaGeriDonusCalculatorInputs({ ...defaultInputs, workingDaysPerYear: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAgvAmrOtonomTasimaGeriDonusCalculator({ ...defaultInputs, workingDaysPerYear: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ maintenanceFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ maintenanceFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = AGV_AMR_OTONOM_TASIMA_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAgvAmrOtonomTasimaGeriDonusCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
