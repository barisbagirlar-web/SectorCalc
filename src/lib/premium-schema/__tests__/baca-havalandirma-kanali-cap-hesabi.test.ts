import { describe, expect, test } from "vitest";
import { BACA_HAVALANDIRMA_KANALI_CAP_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/baca-havalandirma-kanali-cap-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBacaHavalandirmaKanaliCapHesabi,
  type BacaHavalandirmaKanaliCapHesabiInputs,
} from "@/lib/premium-schema/calculators/baca-havalandirma-kanali-cap-hesabi";
import { validateBacaHavalandirmaKanaliCapHesabiInputs } from "@/lib/premium-schema/calculators/baca-havalandirma-kanali-cap-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "baca-havalandirma-kanali-cap-hesabi";
const SCHEMA_ID = "baca-havalandirma-kanali-cap-hesabi";

const defaultInputs: BacaHavalandirmaKanaliCapHesabiInputs = {
    "airflowRate": 1,
    "airVelocity": 8,
    "ductLength": 10,
    "frictionFactor": 0.02,
    "airDensity": 1.2,
    "localLossCoefficient": 2
  };
const lowBandInputs: BacaHavalandirmaKanaliCapHesabiInputs = {
    "airflowRate": 0.1,
    "airVelocity": 8,
    "ductLength": 10,
    "frictionFactor": 0.02,
    "airDensity": 1.2,
    "localLossCoefficient": 2
  };
const criticalBandInputs: BacaHavalandirmaKanaliCapHesabiInputs = {
    "airflowRate": 6,
    "airVelocity": 8,
    "ductLength": 10,
    "frictionFactor": 0.02,
    "airDensity": 1.2,
    "localLossCoefficient": 2
  };

function expectValidationFailure(partial: Partial<BacaHavalandirmaKanaliCapHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BacaHavalandirmaKanaliCapHesabiInputs;
  const validation = validateBacaHavalandirmaKanaliCapHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBacaHavalandirmaKanaliCapHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BacaHavalandirmaKanaliCapHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("baca-havalandirma-kanali-cap-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateBacaHavalandirmaKanaliCapHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBacaHavalandirmaKanaliCapHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBacaHavalandirmaKanaliCapHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBacaHavalandirmaKanaliCapHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBacaHavalandirmaKanaliCapHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, airflowRate: undefined } as unknown as BacaHavalandirmaKanaliCapHesabiInputs;
    const validation = validateBacaHavalandirmaKanaliCapHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBacaHavalandirmaKanaliCapHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ airflowRate: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBacaHavalandirmaKanaliCapHesabiInputs({ ...defaultInputs, airflowRate: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBacaHavalandirmaKanaliCapHesabi({ ...defaultInputs, airflowRate: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ localLossCoefficient: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ localLossCoefficient: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BACA_HAVALANDIRMA_KANALI_CAP_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBacaHavalandirmaKanaliCapHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
