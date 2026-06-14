import { describe, expect, test } from "vitest";
import { ISKELE_VE_KALIP_KULLANIM_SURESI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator,
  type IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator";
import { validateIskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator";
const SCHEMA_ID = "iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator";

const defaultInputs: IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs = {
    "dailyRentalRate": 50,
    "totalRentalDays": 30,
    "setupCostPerCycle": 500,
    "numberOfCycles": 1,
    "maintenanceCostPerDay": 10,
    "totalDemand": 1000
  };
const lowBandInputs: IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs = {
    "dailyRentalRate": 0.1,
    "totalRentalDays": 30,
    "setupCostPerCycle": 500,
    "numberOfCycles": 1,
    "maintenanceCostPerDay": 10,
    "totalDemand": 1000
  };
const criticalBandInputs: IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs = {
    "dailyRentalRate": 6,
    "totalRentalDays": 30,
    "setupCostPerCycle": 500,
    "numberOfCycles": 1,
    "maintenanceCostPerDay": 10,
    "totalDemand": 1000
  };

function expectValidationFailure(partial: Partial<IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs;
  const validation = validateIskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, dailyRentalRate: undefined } as unknown as IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs;
    const validation = validateIskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ dailyRentalRate: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs({ ...defaultInputs, dailyRentalRate: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator({ ...defaultInputs, dailyRentalRate: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ totalDemand: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ totalDemand: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ISKELE_VE_KALIP_KULLANIM_SURESI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
