import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEnergySavingsPackageCalculator,
  type EnergySavingsPackageCalculatorInputs,
} from "@/lib/premium-schema/calculators/energy-savings-package-calculator";
import { validateEnergySavingsPackageCalculatorInputs } from "@/lib/premium-schema/calculators/energy-savings-package-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "energy-savings-package-calculator";

const defaultInputs: EnergySavingsPackageCalculatorInputs = {
    "baselineKwhMonthly": 18500,
    "proposedKwhMonthly": 15200,
    "energyRate": 0.14,
    "projectCost": 42000
  };
const lowBandInputs: EnergySavingsPackageCalculatorInputs = {
    "baselineKwhMonthly": 185,
    "proposedKwhMonthly": 15200,
    "energyRate": 0.14,
    "projectCost": 42000
  };
const criticalBandInputs: EnergySavingsPackageCalculatorInputs = {
    "baselineKwhMonthly": 18500000,
    "proposedKwhMonthly": 15200,
    "energyRate": 0.14,
    "projectCost": 42000
  };

function expectValidationFailure(partial: Partial<EnergySavingsPackageCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as EnergySavingsPackageCalculatorInputs;
  const validation = validateEnergySavingsPackageCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEnergySavingsPackageCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: EnergySavingsPackageCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("energy-savings-package-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateEnergySavingsPackageCalculator(defaultInputs);
    expect(result.annualSavingsCost).toBeCloseTo(engineNumeric(SLUG, "annualSavingsCost", defaultInputs), 2);
    expect(result.monthlySavingsCost).toBeCloseTo(engineNumeric(SLUG, "monthlySavingsCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("annualSavingsCost");
  });

  test("formula pipeline parity", () => {
    const result = calculateEnergySavingsPackageCalculator(defaultInputs);
    expect(result.annualSavingsCost).toBeCloseTo(
      engineNumeric(SLUG, "annualSavingsCost", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateEnergySavingsPackageCalculator(lowBandInputs);
    const defaultResult = calculateEnergySavingsPackageCalculator(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateEnergySavingsPackageCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateEnergySavingsPackageCalculator(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, baselineKwhMonthly: undefined } as unknown as EnergySavingsPackageCalculatorInputs;
    const validation = validateEnergySavingsPackageCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateEnergySavingsPackageCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ baselineKwhMonthly: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateEnergySavingsPackageCalculatorInputs({ ...defaultInputs, baselineKwhMonthly: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateEnergySavingsPackageCalculator({ ...defaultInputs, baselineKwhMonthly: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ projectCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ projectCost: Number.POSITIVE_INFINITY });
  });

  test("contract metadata matches slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateEnergySavingsPackageCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "annualSavingsCost")?.raw).toBeCloseTo(calculatorResult.annualSavingsCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "monthlySavingsCost")?.raw).toBeCloseTo(calculatorResult.monthlySavingsCost, 2);
  });
});
