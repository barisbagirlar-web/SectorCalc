import { describe, expect, test } from "vitest";
import { HVAC_PROJECT_MARGIN_GUARD_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/hvac-project-margin-guard-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateHvacProjectMarginGuard,
  type HvacProjectMarginGuardInputs,
} from "@/lib/premium-schema/calculators/hvac-project-margin-guard";
import { validateHvacProjectMarginGuardInputs } from "@/lib/premium-schema/calculators/hvac-project-margin-guard-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "hvac-project-margin-guard";

const defaultInputs: HvacProjectMarginGuardInputs = {
    "projectRevenue": 64000,
    "ductworkVariance": 4200,
    "commissioningHours": 28,
    "laborRate": 55,
    "callbackRiskPercent": 4
  };
const lowBandInputs: HvacProjectMarginGuardInputs = {
    "projectRevenue": 640,
    "ductworkVariance": 4200,
    "commissioningHours": 28,
    "laborRate": 55,
    "callbackRiskPercent": 4
  };
const criticalBandInputs: HvacProjectMarginGuardInputs = {
    "projectRevenue": 64000000,
    "ductworkVariance": 4200,
    "commissioningHours": 28,
    "laborRate": 55,
    "callbackRiskPercent": 4
  };

function expectValidationFailure(partial: Partial<HvacProjectMarginGuardInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as HvacProjectMarginGuardInputs;
  const validation = validateHvacProjectMarginGuardInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateHvacProjectMarginGuard(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: HvacProjectMarginGuardInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("hvac-project-margin-guard", () => {
  test("exact default oracle", () => {
    const result = calculateHvacProjectMarginGuard(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.commissioningCost).toBeCloseTo(engineNumeric(SLUG, "commissioningCost", defaultInputs), 2);
    expect(result.marginPressure).toBeCloseTo(engineNumeric(SLUG, "marginPressure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("formula pipeline parity", () => {
    const result = calculateHvacProjectMarginGuard(defaultInputs);
    expect(result.marginPressure).toBeCloseTo(
      engineNumeric(SLUG, "marginPressure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateHvacProjectMarginGuard(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateHvacProjectMarginGuard(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateHvacProjectMarginGuard(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, projectRevenue: undefined } as unknown as HvacProjectMarginGuardInputs;
    const validation = validateHvacProjectMarginGuardInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateHvacProjectMarginGuard(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ projectRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateHvacProjectMarginGuardInputs({ ...defaultInputs, projectRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateHvacProjectMarginGuard({ ...defaultInputs, projectRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ callbackRiskPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ callbackRiskPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = HVAC_PROJECT_MARGIN_GUARD_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateHvacProjectMarginGuard(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "commissioningCost")?.raw).toBeCloseTo(calculatorResult.commissioningCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "marginPressure")?.raw).toBeCloseTo(calculatorResult.marginPressure, 2);
  });
});
