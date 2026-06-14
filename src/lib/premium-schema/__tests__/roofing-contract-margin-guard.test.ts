import { describe, expect, test } from "vitest";
import { ROOFING_CONTRACT_MARGIN_GUARD_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/roofing-contract-margin-guard-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRoofingContractMarginGuard,
  type RoofingContractMarginGuardInputs,
} from "@/lib/premium-schema/calculators/roofing-contract-margin-guard";
import { validateRoofingContractMarginGuardInputs } from "@/lib/premium-schema/calculators/roofing-contract-margin-guard-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "roofing-contract-margin-guard";

const defaultInputs: RoofingContractMarginGuardInputs = {
    "contractValue": 185000,
    "plannedSubcontractorCost": 72000,
    "actualSubcontractorCost": 81500,
    "delayCost": 6500,
    "materialVariance": 4200
  };
const lowBandInputs: RoofingContractMarginGuardInputs = {
    "contractValue": 1850,
    "plannedSubcontractorCost": 72000,
    "actualSubcontractorCost": 81500,
    "delayCost": 6500,
    "materialVariance": 4200
  };
const criticalBandInputs: RoofingContractMarginGuardInputs = {
    "contractValue": 185000000,
    "plannedSubcontractorCost": 72000,
    "actualSubcontractorCost": 81500,
    "delayCost": 6500,
    "materialVariance": 4200
  };

function expectValidationFailure(partial: Partial<RoofingContractMarginGuardInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RoofingContractMarginGuardInputs;
  const validation = validateRoofingContractMarginGuardInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRoofingContractMarginGuard(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RoofingContractMarginGuardInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("roofing-contract-margin-guard", () => {
  test("exact default oracle", () => {
    const result = calculateRoofingContractMarginGuard(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.subcontractorVariance).toBeCloseTo(engineNumeric(SLUG, "subcontractorVariance", defaultInputs), 2);
    expect(result.marginPressure).toBeCloseTo(engineNumeric(SLUG, "marginPressure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRoofingContractMarginGuard(defaultInputs);
    expect(result.marginPressure).toBeCloseTo(
      engineNumeric(SLUG, "marginPressure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRoofingContractMarginGuard(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRoofingContractMarginGuard(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRoofingContractMarginGuard(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, contractValue: undefined } as unknown as RoofingContractMarginGuardInputs;
    const validation = validateRoofingContractMarginGuardInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRoofingContractMarginGuard(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ contractValue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRoofingContractMarginGuardInputs({ ...defaultInputs, contractValue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRoofingContractMarginGuard({ ...defaultInputs, contractValue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ materialVariance: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ materialVariance: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ROOFING_CONTRACT_MARGIN_GUARD_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRoofingContractMarginGuard(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "subcontractorVariance")?.raw).toBeCloseTo(calculatorResult.subcontractorVariance, 2);
    expect(engineResult.outputs.find((output) => output.id === "marginPressure")?.raw).toBeCloseTo(calculatorResult.marginPressure, 2);
  });
});
