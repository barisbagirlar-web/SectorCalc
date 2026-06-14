import { describe, expect, test } from "vitest";
import { KONTEYNER_YUKLEME_KAPASITESI_TEU_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/konteyner-yukleme-kapasitesi-teu-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKonteynerYuklemeKapasitesiTeuHesabi,
  type KonteynerYuklemeKapasitesiTeuHesabiInputs,
} from "@/lib/premium-schema/calculators/konteyner-yukleme-kapasitesi-teu-hesabi";
import { validateKonteynerYuklemeKapasitesiTeuHesabiInputs } from "@/lib/premium-schema/calculators/konteyner-yukleme-kapasitesi-teu-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "konteyner-yukleme-kapasitesi-teu-hesabi";
const SCHEMA_ID = "konteyner-yukleme-kapasitesi-teu-hesabi";

const defaultInputs: KonteynerYuklemeKapasitesiTeuHesabiInputs = {
    "totalContainerVolume": 33.2,
    "standardTEUVolume": 33.2,
    "stowageFactor": 85,
    "weightCapacity": 28,
    "averageCargoWeightPerTEU": 14,
    "safetyReductionFactor": 95
  };
const lowBandInputs: KonteynerYuklemeKapasitesiTeuHesabiInputs = {
    "totalContainerVolume": 1,
    "standardTEUVolume": 33.2,
    "stowageFactor": 85,
    "weightCapacity": 28,
    "averageCargoWeightPerTEU": 14,
    "safetyReductionFactor": 95
  };
const criticalBandInputs: KonteynerYuklemeKapasitesiTeuHesabiInputs = {
    "totalContainerVolume": 6,
    "standardTEUVolume": 33.2,
    "stowageFactor": 85,
    "weightCapacity": 28,
    "averageCargoWeightPerTEU": 14,
    "safetyReductionFactor": 95
  };

function expectValidationFailure(partial: Partial<KonteynerYuklemeKapasitesiTeuHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KonteynerYuklemeKapasitesiTeuHesabiInputs;
  const validation = validateKonteynerYuklemeKapasitesiTeuHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKonteynerYuklemeKapasitesiTeuHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KonteynerYuklemeKapasitesiTeuHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("konteyner-yukleme-kapasitesi-teu-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateKonteynerYuklemeKapasitesiTeuHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKonteynerYuklemeKapasitesiTeuHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKonteynerYuklemeKapasitesiTeuHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKonteynerYuklemeKapasitesiTeuHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKonteynerYuklemeKapasitesiTeuHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalContainerVolume: undefined } as unknown as KonteynerYuklemeKapasitesiTeuHesabiInputs;
    const validation = validateKonteynerYuklemeKapasitesiTeuHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKonteynerYuklemeKapasitesiTeuHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalContainerVolume: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKonteynerYuklemeKapasitesiTeuHesabiInputs({ ...defaultInputs, totalContainerVolume: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKonteynerYuklemeKapasitesiTeuHesabi({ ...defaultInputs, totalContainerVolume: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ safetyReductionFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ safetyReductionFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KONTEYNER_YUKLEME_KAPASITESI_TEU_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKonteynerYuklemeKapasitesiTeuHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
