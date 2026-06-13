import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRoofingWeatherDelayRisk,
  type RoofingWeatherDelayRiskInputs,
} from "@/lib/premium-schema/calculators/roofing-weather-delay-risk";
import { validateRoofingWeatherDelayRiskInputs } from "@/lib/premium-schema/calculators/roofing-weather-delay-risk-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "roofing-weather-delay-risk";
const PAID_ROUTE_SLUG = "landscaping-contract-profit-tool";

const defaultInputs: RoofingWeatherDelayRiskInputs = {
    "dailyCrewCost": 1450,
    "weatherDelayDays": 4,
    "dumpFees": 1800,
    "warrantyReserve": 2400
  };
const lowBandInputs: RoofingWeatherDelayRiskInputs = {
    "dailyCrewCost": 14.5,
    "weatherDelayDays": 4,
    "dumpFees": 1800,
    "warrantyReserve": 2400
  };
const criticalBandInputs: RoofingWeatherDelayRiskInputs = {
    "dailyCrewCost": 1450000,
    "weatherDelayDays": 4,
    "dumpFees": 1800,
    "warrantyReserve": 2400
  };

function expectValidationFailure(partial: Partial<RoofingWeatherDelayRiskInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RoofingWeatherDelayRiskInputs;
  const validation = validateRoofingWeatherDelayRiskInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRoofingWeatherDelayRisk(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RoofingWeatherDelayRiskInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("roofing-weather-delay-risk", () => {
  test("exact default oracle", () => {
    const result = calculateRoofingWeatherDelayRisk(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.delayCost).toBeCloseTo(engineNumeric(SLUG, "delayCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRoofingWeatherDelayRisk(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateRoofingWeatherDelayRisk(lowBandInputs);
    const defaultResult = calculateRoofingWeatherDelayRisk(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateRoofingWeatherDelayRisk(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRoofingWeatherDelayRisk(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, dailyCrewCost: undefined } as unknown as RoofingWeatherDelayRiskInputs;
    const validation = validateRoofingWeatherDelayRiskInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRoofingWeatherDelayRisk(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ dailyCrewCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRoofingWeatherDelayRiskInputs({ ...defaultInputs, weatherDelayDays: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRoofingWeatherDelayRisk({ ...defaultInputs, weatherDelayDays: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ warrantyReserve: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ warrantyReserve: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateRoofingWeatherDelayRisk(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "delayCost")?.raw).toBeCloseTo(calculatorResult.delayCost, 2);
  });
});
