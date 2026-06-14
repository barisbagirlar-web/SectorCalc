import { describe, expect, test } from "vitest";
import { KOMPRESOR_DEBISI_TANK_HACMI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kompresor-debisi-tank-hacmi-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKompresorDebisiTankHacmiHesabi,
  type KompresorDebisiTankHacmiHesabiInputs,
} from "@/lib/premium-schema/calculators/kompresor-debisi-tank-hacmi-hesabi";
import { validateKompresorDebisiTankHacmiHesabiInputs } from "@/lib/premium-schema/calculators/kompresor-debisi-tank-hacmi-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kompresor-debisi-tank-hacmi-hesabi";
const SCHEMA_ID = "kompresor-debisi-tank-hacmi-hesabi";

const defaultInputs: KompresorDebisiTankHacmiHesabiInputs = {
    "totalAirConsumption": 10,
    "diversityFactor": 80,
    "compressorFlowRate": 12,
    "pressureDifferential": 2,
    "dutyCycle": 60,
    "allowablePressureDrop": 0.5
  };
const lowBandInputs: KompresorDebisiTankHacmiHesabiInputs = {
    "totalAirConsumption": 0.1,
    "diversityFactor": 80,
    "compressorFlowRate": 12,
    "pressureDifferential": 2,
    "dutyCycle": 60,
    "allowablePressureDrop": 0.5
  };
const criticalBandInputs: KompresorDebisiTankHacmiHesabiInputs = {
    "totalAirConsumption": 6,
    "diversityFactor": 80,
    "compressorFlowRate": 12,
    "pressureDifferential": 2,
    "dutyCycle": 60,
    "allowablePressureDrop": 0.5
  };

function expectValidationFailure(partial: Partial<KompresorDebisiTankHacmiHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KompresorDebisiTankHacmiHesabiInputs;
  const validation = validateKompresorDebisiTankHacmiHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKompresorDebisiTankHacmiHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KompresorDebisiTankHacmiHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kompresor-debisi-tank-hacmi-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateKompresorDebisiTankHacmiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKompresorDebisiTankHacmiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKompresorDebisiTankHacmiHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKompresorDebisiTankHacmiHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKompresorDebisiTankHacmiHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalAirConsumption: undefined } as unknown as KompresorDebisiTankHacmiHesabiInputs;
    const validation = validateKompresorDebisiTankHacmiHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKompresorDebisiTankHacmiHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalAirConsumption: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKompresorDebisiTankHacmiHesabiInputs({ ...defaultInputs, totalAirConsumption: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKompresorDebisiTankHacmiHesabi({ ...defaultInputs, totalAirConsumption: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ allowablePressureDrop: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ allowablePressureDrop: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KOMPRESOR_DEBISI_TANK_HACMI_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKompresorDebisiTankHacmiHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
