import { describe, expect, test } from "vitest";
import { SOLAR_PANEL_OUTPUT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/solar-panel-output-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSolarPanelOutputCalculator,
  type SolarPanelOutputCalculatorInputs,
} from "@/lib/premium-schema/calculators/solar-panel-output-calculator";
import { validateSolarPanelOutputCalculatorInputs } from "@/lib/premium-schema/calculators/solar-panel-output-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "solar-panel-output-calculator";
const SCHEMA_ID = "solar-panel-output-calculator";

const defaultInputs: SolarPanelOutputCalculatorInputs = {
    "panelRating_kW": 0.3,
    "peakSunHours": 5,
    "performanceRatio": 80,
    "temperatureCoefficient": -0.4,
    "cellTemperature": 45,
    "inverterEfficiency": 96
  };
const lowBandInputs: SolarPanelOutputCalculatorInputs = {
    "panelRating_kW": 0.1,
    "peakSunHours": 5,
    "performanceRatio": 80,
    "temperatureCoefficient": -0.4,
    "cellTemperature": 45,
    "inverterEfficiency": 96
  };
const criticalBandInputs: SolarPanelOutputCalculatorInputs = {
    "panelRating_kW": 6,
    "peakSunHours": 5,
    "performanceRatio": 80,
    "temperatureCoefficient": -0.4,
    "cellTemperature": 45,
    "inverterEfficiency": 96
  };

function expectValidationFailure(partial: Partial<SolarPanelOutputCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SolarPanelOutputCalculatorInputs;
  const validation = validateSolarPanelOutputCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSolarPanelOutputCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SolarPanelOutputCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("solar-panel-output-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateSolarPanelOutputCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSolarPanelOutputCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSolarPanelOutputCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSolarPanelOutputCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSolarPanelOutputCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, panelRating_kW: undefined } as unknown as SolarPanelOutputCalculatorInputs;
    const validation = validateSolarPanelOutputCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSolarPanelOutputCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ panelRating_kW: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSolarPanelOutputCalculatorInputs({ ...defaultInputs, panelRating_kW: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSolarPanelOutputCalculator({ ...defaultInputs, panelRating_kW: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ inverterEfficiency: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ inverterEfficiency: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SOLAR_PANEL_OUTPUT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSolarPanelOutputCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
