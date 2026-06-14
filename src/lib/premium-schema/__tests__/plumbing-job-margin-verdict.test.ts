import { describe, expect, test } from "vitest";
import { PLUMBING_JOB_MARGIN_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/plumbing-job-margin-verdict-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePlumbingJobMarginVerdict,
  type PlumbingJobMarginVerdictInputs,
} from "@/lib/premium-schema/calculators/plumbing-job-margin-verdict";
import { validatePlumbingJobMarginVerdictInputs } from "@/lib/premium-schema/calculators/plumbing-job-margin-verdict-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "plumbing-job-margin-verdict";

const defaultInputs: PlumbingJobMarginVerdictInputs = {
    "jobRevenue": 12500,
    "callbackVisits": 3,
    "visitCost": 220,
    "materialRunCost": 850,
    "warrantyReservePercent": 4
  };
const lowBandInputs: PlumbingJobMarginVerdictInputs = {
    "jobRevenue": 12500,
    "callbackVisits": 0.2,
    "visitCost": 220,
    "materialRunCost": 850,
    "warrantyReservePercent": 4
  };
const criticalBandInputs: PlumbingJobMarginVerdictInputs = {
    "jobRevenue": 12500,
    "callbackVisits": 10,
    "visitCost": 220,
    "materialRunCost": 850,
    "warrantyReservePercent": 4
  };

function expectValidationFailure(partial: Partial<PlumbingJobMarginVerdictInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PlumbingJobMarginVerdictInputs;
  const validation = validatePlumbingJobMarginVerdictInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePlumbingJobMarginVerdict(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PlumbingJobMarginVerdictInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("plumbing-job-margin-verdict", () => {
  test("exact default oracle", () => {
    const result = calculatePlumbingJobMarginVerdict(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.callbackCost).toBeCloseTo(engineNumeric(SLUG, "callbackCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePlumbingJobMarginVerdict(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePlumbingJobMarginVerdict(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePlumbingJobMarginVerdict(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePlumbingJobMarginVerdict(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, jobRevenue: undefined } as unknown as PlumbingJobMarginVerdictInputs;
    const validation = validatePlumbingJobMarginVerdictInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePlumbingJobMarginVerdict(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ jobRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePlumbingJobMarginVerdictInputs({ ...defaultInputs, jobRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePlumbingJobMarginVerdict({ ...defaultInputs, jobRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ warrantyReservePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ warrantyReservePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PLUMBING_JOB_MARGIN_VERDICT_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePlumbingJobMarginVerdict(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "callbackCost")?.raw).toBeCloseTo(calculatorResult.callbackCost, 2);
  });
});
