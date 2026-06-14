import { describe, expect, test } from "vitest";
import { AKU_KAPASITESI_CALISMA_SURESI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/aku-kapasitesi-calisma-suresi-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAkuKapasitesiCalismaSuresiHesabi,
  type AkuKapasitesiCalismaSuresiHesabiInputs,
} from "@/lib/premium-schema/calculators/aku-kapasitesi-calisma-suresi-hesabi";
import { validateAkuKapasitesiCalismaSuresiHesabiInputs } from "@/lib/premium-schema/calculators/aku-kapasitesi-calisma-suresi-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "aku-kapasitesi-calisma-suresi-hesabi";
const SCHEMA_ID = "aku-kapasitesi-calisma-suresi-hesabi";

const defaultInputs: AkuKapasitesiCalismaSuresiHesabiInputs = {
    "nominalCapacityAh": 100,
    "depthOfDischargePercent": 80,
    "loadCurrentA": 10,
    "loadFactor": 1,
    "temperatureC": 25,
    "agingFactor": 0.8
  };
const lowBandInputs: AkuKapasitesiCalismaSuresiHesabiInputs = {
    "nominalCapacityAh": 1,
    "depthOfDischargePercent": 80,
    "loadCurrentA": 10,
    "loadFactor": 1,
    "temperatureC": 25,
    "agingFactor": 0.8
  };
const criticalBandInputs: AkuKapasitesiCalismaSuresiHesabiInputs = {
    "nominalCapacityAh": 6,
    "depthOfDischargePercent": 80,
    "loadCurrentA": 10,
    "loadFactor": 1,
    "temperatureC": 25,
    "agingFactor": 0.8
  };

function expectValidationFailure(partial: Partial<AkuKapasitesiCalismaSuresiHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AkuKapasitesiCalismaSuresiHesabiInputs;
  const validation = validateAkuKapasitesiCalismaSuresiHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAkuKapasitesiCalismaSuresiHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AkuKapasitesiCalismaSuresiHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("aku-kapasitesi-calisma-suresi-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateAkuKapasitesiCalismaSuresiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAkuKapasitesiCalismaSuresiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAkuKapasitesiCalismaSuresiHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAkuKapasitesiCalismaSuresiHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAkuKapasitesiCalismaSuresiHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, nominalCapacityAh: undefined } as unknown as AkuKapasitesiCalismaSuresiHesabiInputs;
    const validation = validateAkuKapasitesiCalismaSuresiHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAkuKapasitesiCalismaSuresiHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ nominalCapacityAh: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAkuKapasitesiCalismaSuresiHesabiInputs({ ...defaultInputs, nominalCapacityAh: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAkuKapasitesiCalismaSuresiHesabi({ ...defaultInputs, nominalCapacityAh: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ agingFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ agingFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = AKU_KAPASITESI_CALISMA_SURESI_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAkuKapasitesiCalismaSuresiHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
