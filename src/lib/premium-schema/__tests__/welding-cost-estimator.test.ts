import { describe, expect, test } from "vitest";
import { WELDING_COST_ESTIMATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/welding-cost-estimator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateWeldingCostEstimator,
  type WeldingCostEstimatorInputs,
} from "@/lib/premium-schema/calculators/welding-cost-estimator";
import { validateWeldingCostEstimatorInputs } from "@/lib/premium-schema/calculators/welding-cost-estimator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "welding-cost-estimator";
const SCHEMA_ID = "welding-cost-estimator";

const defaultInputs: WeldingCostEstimatorInputs = {
    "batchSize": 100,
    "machineTimeHours": 0.5,
    "setupTimeMinutes": 30,
    "laborTimeHours": 0.3,
    "machineHourlyRate": 50,
    "laborHourlyRate": 30
  };
const lowBandInputs: WeldingCostEstimatorInputs = {
    "batchSize": 1,
    "machineTimeHours": 0.5,
    "setupTimeMinutes": 30,
    "laborTimeHours": 0.3,
    "machineHourlyRate": 50,
    "laborHourlyRate": 30
  };
const criticalBandInputs: WeldingCostEstimatorInputs = {
    "batchSize": 6,
    "machineTimeHours": 0.5,
    "setupTimeMinutes": 30,
    "laborTimeHours": 0.3,
    "machineHourlyRate": 50,
    "laborHourlyRate": 30
  };

function expectValidationFailure(partial: Partial<WeldingCostEstimatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as WeldingCostEstimatorInputs;
  const validation = validateWeldingCostEstimatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateWeldingCostEstimator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: WeldingCostEstimatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("welding-cost-estimator", () => {
  test("exact default oracle", () => {
    const result = calculateWeldingCostEstimator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateWeldingCostEstimator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateWeldingCostEstimator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateWeldingCostEstimator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateWeldingCostEstimator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, batchSize: undefined } as unknown as WeldingCostEstimatorInputs;
    const validation = validateWeldingCostEstimatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateWeldingCostEstimator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ batchSize: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateWeldingCostEstimatorInputs({ ...defaultInputs, batchSize: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateWeldingCostEstimator({ ...defaultInputs, batchSize: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ laborHourlyRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ laborHourlyRate: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = WELDING_COST_ESTIMATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateWeldingCostEstimator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
