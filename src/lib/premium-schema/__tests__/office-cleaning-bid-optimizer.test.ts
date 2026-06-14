import { describe, expect, test } from "vitest";
import { OFFICE_CLEANING_BID_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/office-cleaning-bid-optimizer-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateOfficeCleaningBidOptimizer,
  type OfficeCleaningBidOptimizerInputs,
} from "@/lib/premium-schema/calculators/office-cleaning-bid-optimizer";
import { validateOfficeCleaningBidOptimizerInputs } from "@/lib/premium-schema/calculators/office-cleaning-bid-optimizer-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "office-cleaning-bid-optimizer";

const defaultInputs: OfficeCleaningBidOptimizerInputs = {
    "monthlyRent": 24000,
    "totalSqm": 2400,
    "unusedSpacePercent": 14,
    "handlingOverrunHours": 60,
    "hourlyCost": 24
  };
const lowBandInputs: OfficeCleaningBidOptimizerInputs = {
    "monthlyRent": 24000,
    "totalSqm": 2400,
    "unusedSpacePercent": 1,
    "handlingOverrunHours": 60,
    "hourlyCost": 24
  };
const criticalBandInputs: OfficeCleaningBidOptimizerInputs = {
    "monthlyRent": 24000,
    "totalSqm": 2400,
    "unusedSpacePercent": 40,
    "handlingOverrunHours": 60,
    "hourlyCost": 24
  };

function expectValidationFailure(partial: Partial<OfficeCleaningBidOptimizerInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as OfficeCleaningBidOptimizerInputs;
  const validation = validateOfficeCleaningBidOptimizerInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateOfficeCleaningBidOptimizer(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: OfficeCleaningBidOptimizerInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("office-cleaning-bid-optimizer", () => {
  test("exact default oracle", () => {
    const result = calculateOfficeCleaningBidOptimizer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.unusedSpaceCost).toBeCloseTo(engineNumeric(SLUG, "unusedSpaceCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateOfficeCleaningBidOptimizer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateOfficeCleaningBidOptimizer(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateOfficeCleaningBidOptimizer(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateOfficeCleaningBidOptimizer(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyRent: undefined } as unknown as OfficeCleaningBidOptimizerInputs;
    const validation = validateOfficeCleaningBidOptimizerInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateOfficeCleaningBidOptimizer(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyRent: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateOfficeCleaningBidOptimizerInputs({ ...defaultInputs, totalSqm: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateOfficeCleaningBidOptimizer({ ...defaultInputs, totalSqm: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ hourlyCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ hourlyCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = OFFICE_CLEANING_BID_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateOfficeCleaningBidOptimizer(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "unusedSpaceCost")?.raw).toBeCloseTo(calculatorResult.unusedSpaceCost, 2);
  });
});
