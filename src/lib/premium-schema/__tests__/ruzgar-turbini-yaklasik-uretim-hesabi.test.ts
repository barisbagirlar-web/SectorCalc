import { describe, expect, test } from "vitest";
import { RUZGAR_TURBINI_YAKLASIK_URETIM_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ruzgar-turbini-yaklasik-uretim-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRuzgarTurbiniYaklasikUretimHesabi,
  type RuzgarTurbiniYaklasikUretimHesabiInputs,
} from "@/lib/premium-schema/calculators/ruzgar-turbini-yaklasik-uretim-hesabi";
import { validateRuzgarTurbiniYaklasikUretimHesabiInputs } from "@/lib/premium-schema/calculators/ruzgar-turbini-yaklasik-uretim-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "ruzgar-turbini-yaklasik-uretim-hesabi";
const SCHEMA_ID = "ruzgar-turbini-yaklasik-uretim-hesabi";

const defaultInputs: RuzgarTurbiniYaklasikUretimHesabiInputs = {
    "averageWindSpeed": 7,
    "weibullShapeParameter": 2,
    "rotorDiameter": 80,
    "ratedPower": 2000,
    "airDensity": 1.225,
    "availabilityFactor": 95
  };
const lowBandInputs: RuzgarTurbiniYaklasikUretimHesabiInputs = {
    "averageWindSpeed": 0.1,
    "weibullShapeParameter": 2,
    "rotorDiameter": 80,
    "ratedPower": 2000,
    "airDensity": 1.225,
    "availabilityFactor": 95
  };
const criticalBandInputs: RuzgarTurbiniYaklasikUretimHesabiInputs = {
    "averageWindSpeed": 6,
    "weibullShapeParameter": 2,
    "rotorDiameter": 80,
    "ratedPower": 2000,
    "airDensity": 1.225,
    "availabilityFactor": 95
  };

function expectValidationFailure(partial: Partial<RuzgarTurbiniYaklasikUretimHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RuzgarTurbiniYaklasikUretimHesabiInputs;
  const validation = validateRuzgarTurbiniYaklasikUretimHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRuzgarTurbiniYaklasikUretimHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RuzgarTurbiniYaklasikUretimHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("ruzgar-turbini-yaklasik-uretim-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateRuzgarTurbiniYaklasikUretimHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRuzgarTurbiniYaklasikUretimHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRuzgarTurbiniYaklasikUretimHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRuzgarTurbiniYaklasikUretimHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRuzgarTurbiniYaklasikUretimHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, averageWindSpeed: undefined } as unknown as RuzgarTurbiniYaklasikUretimHesabiInputs;
    const validation = validateRuzgarTurbiniYaklasikUretimHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRuzgarTurbiniYaklasikUretimHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ averageWindSpeed: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRuzgarTurbiniYaklasikUretimHesabiInputs({ ...defaultInputs, weibullShapeParameter: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRuzgarTurbiniYaklasikUretimHesabi({ ...defaultInputs, weibullShapeParameter: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ availabilityFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ availabilityFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = RUZGAR_TURBINI_YAKLASIK_URETIM_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRuzgarTurbiniYaklasikUretimHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
