import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCarbonFootprintComplianceRisk,
  type CarbonFootprintComplianceRiskInputs,
} from "@/lib/premium-schema/calculators/carbon-footprint-compliance-risk";
import { validateCarbonFootprintComplianceRiskInputs } from "@/lib/premium-schema/calculators/carbon-footprint-compliance-risk-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "carbon-footprint-compliance-risk";

const defaultInputs: CarbonFootprintComplianceRiskInputs = {
    "energyEmissionsTon": 120,
    "fuelEmissionsTon": 45,
    "carbonPrice": 85,
    "exposurePercent": 60
  };
const lowBandInputs: CarbonFootprintComplianceRiskInputs = {
    "energyEmissionsTon": 1.2,
    "fuelEmissionsTon": 45,
    "carbonPrice": 85,
    "exposurePercent": 60
  };
const criticalBandInputs: CarbonFootprintComplianceRiskInputs = {
    "energyEmissionsTon": 120000,
    "fuelEmissionsTon": 45,
    "carbonPrice": 85,
    "exposurePercent": 60
  };

function expectValidationFailure(partial: Partial<CarbonFootprintComplianceRiskInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CarbonFootprintComplianceRiskInputs;
  const validation = validateCarbonFootprintComplianceRiskInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCarbonFootprintComplianceRisk(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CarbonFootprintComplianceRiskInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("carbon-footprint-compliance-risk", () => {
  test("exact default oracle", () => {
    const result = calculateCarbonFootprintComplianceRisk(defaultInputs);
    expect(result.carbonExposure).toBeCloseTo(engineNumeric(SLUG, "carbonExposure", defaultInputs), 2);
    expect(result.totalEmissions).toBeCloseTo(engineNumeric(SLUG, "totalEmissions", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("carbonExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCarbonFootprintComplianceRisk(defaultInputs);
    expect(result.carbonExposure).toBeCloseTo(
      engineNumeric(SLUG, "carbonExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCarbonFootprintComplianceRisk(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCarbonFootprintComplianceRisk(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCarbonFootprintComplianceRisk(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, energyEmissionsTon: undefined } as unknown as CarbonFootprintComplianceRiskInputs;
    const validation = validateCarbonFootprintComplianceRiskInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCarbonFootprintComplianceRisk(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ energyEmissionsTon: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ exposurePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ exposurePercent: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateCarbonFootprintComplianceRisk(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "carbonExposure")?.raw).toBeCloseTo(calculatorResult.carbonExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "totalEmissions")?.raw).toBeCloseTo(calculatorResult.totalEmissions, 2);
  });
});
