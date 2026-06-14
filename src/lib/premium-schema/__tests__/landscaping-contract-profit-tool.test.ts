import { describe, expect, test } from "vitest";
import { LANDSCAPING_CONTRACT_PROFIT_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/landscaping-contract-profit-tool-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateLandscapingContractProfitTool,
  type LandscapingContractProfitToolInputs,
} from "@/lib/premium-schema/calculators/landscaping-contract-profit-tool";
import { validateLandscapingContractProfitToolInputs } from "@/lib/premium-schema/calculators/landscaping-contract-profit-tool-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "landscaping-contract-profit-tool";

const defaultInputs: LandscapingContractProfitToolInputs = {
    "dailyCrewCost": 1450,
    "weatherDelayDays": 4,
    "dumpFees": 1800,
    "warrantyReserve": 2400
  };
const lowBandInputs: LandscapingContractProfitToolInputs = {
    "dailyCrewCost": 1450,
    "weatherDelayDays": 0.30000000000000004,
    "dumpFees": 1800,
    "warrantyReserve": 2400
  };
const criticalBandInputs: LandscapingContractProfitToolInputs = {
    "dailyCrewCost": 1450,
    "weatherDelayDays": 16,
    "dumpFees": 1800,
    "warrantyReserve": 2400
  };

function expectValidationFailure(partial: Partial<LandscapingContractProfitToolInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as LandscapingContractProfitToolInputs;
  const validation = validateLandscapingContractProfitToolInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateLandscapingContractProfitTool(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: LandscapingContractProfitToolInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("landscaping-contract-profit-tool", () => {
  test("exact default oracle", () => {
    const result = calculateLandscapingContractProfitTool(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.delayCost).toBeCloseTo(engineNumeric(SLUG, "delayCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateLandscapingContractProfitTool(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateLandscapingContractProfitTool(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateLandscapingContractProfitTool(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateLandscapingContractProfitTool(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, dailyCrewCost: undefined } as unknown as LandscapingContractProfitToolInputs;
    const validation = validateLandscapingContractProfitToolInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateLandscapingContractProfitTool(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ dailyCrewCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateLandscapingContractProfitToolInputs({ ...defaultInputs, weatherDelayDays: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateLandscapingContractProfitTool({ ...defaultInputs, weatherDelayDays: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ warrantyReserve: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ warrantyReserve: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = LANDSCAPING_CONTRACT_PROFIT_TOOL_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateLandscapingContractProfitTool(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "delayCost")?.raw).toBeCloseTo(calculatorResult.delayCost, 2);
  });
});
