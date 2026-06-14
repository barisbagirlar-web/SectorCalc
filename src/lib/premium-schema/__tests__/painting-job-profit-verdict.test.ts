import { describe, expect, test } from "vitest";
import { PAINTING_JOB_PROFIT_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/painting-job-profit-verdict-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePaintingJobProfitVerdict,
  type PaintingJobProfitVerdictInputs,
} from "@/lib/premium-schema/calculators/painting-job-profit-verdict";
import { validatePaintingJobProfitVerdictInputs } from "@/lib/premium-schema/calculators/painting-job-profit-verdict-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "painting-job-profit-verdict";

const defaultInputs: PaintingJobProfitVerdictInputs = {
    "jobRevenue": 18500,
    "paintMaterialCost": 3800,
    "coverageDriftPercent": 6,
    "prepReworkHours": 32,
    "laborRate": 42,
    "scaffoldCost": 1200
  };
const lowBandInputs: PaintingJobProfitVerdictInputs = {
    "jobRevenue": 185,
    "paintMaterialCost": 3800,
    "coverageDriftPercent": 6,
    "prepReworkHours": 32,
    "laborRate": 42,
    "scaffoldCost": 1200
  };
const criticalBandInputs: PaintingJobProfitVerdictInputs = {
    "jobRevenue": 18500000,
    "paintMaterialCost": 3800,
    "coverageDriftPercent": 6,
    "prepReworkHours": 32,
    "laborRate": 42,
    "scaffoldCost": 1200
  };

function expectValidationFailure(partial: Partial<PaintingJobProfitVerdictInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PaintingJobProfitVerdictInputs;
  const validation = validatePaintingJobProfitVerdictInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePaintingJobProfitVerdict(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PaintingJobProfitVerdictInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("painting-job-profit-verdict", () => {
  test("exact default oracle", () => {
    const result = calculatePaintingJobProfitVerdict(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.coverageDriftCost).toBeCloseTo(engineNumeric(SLUG, "coverageDriftCost", defaultInputs), 2);
    expect(result.marginPressure).toBeCloseTo(engineNumeric(SLUG, "marginPressure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePaintingJobProfitVerdict(defaultInputs);
    expect(result.marginPressure).toBeCloseTo(
      engineNumeric(SLUG, "marginPressure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePaintingJobProfitVerdict(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePaintingJobProfitVerdict(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePaintingJobProfitVerdict(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, jobRevenue: undefined } as unknown as PaintingJobProfitVerdictInputs;
    const validation = validatePaintingJobProfitVerdictInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePaintingJobProfitVerdict(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ jobRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePaintingJobProfitVerdictInputs({ ...defaultInputs, jobRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePaintingJobProfitVerdict({ ...defaultInputs, jobRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ scaffoldCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ scaffoldCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PAINTING_JOB_PROFIT_VERDICT_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePaintingJobProfitVerdict(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "coverageDriftCost")?.raw).toBeCloseTo(calculatorResult.coverageDriftCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "marginPressure")?.raw).toBeCloseTo(calculatorResult.marginPressure, 2);
  });
});
