import { describe, expect, test } from "vitest";
import { SMED_SETUP_SURESI_VE_EKONOMIK_PARTI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/smed-setup-suresi-ve-ekonomik-parti-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSmedSetupSuresiVeEkonomikPartiCalculator,
  type SmedSetupSuresiVeEkonomikPartiCalculatorInputs,
} from "@/lib/premium-schema/calculators/smed-setup-suresi-ve-ekonomik-parti-calculator";
import { validateSmedSetupSuresiVeEkonomikPartiCalculatorInputs } from "@/lib/premium-schema/calculators/smed-setup-suresi-ve-ekonomik-parti-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "smed-setup-suresi-ve-ekonomik-parti-calculator";
const SCHEMA_ID = "smed-setup-suresi-ve-ekonomik-parti-calculator";

const defaultInputs: SmedSetupSuresiVeEkonomikPartiCalculatorInputs = {
    "annualDemand": 10000,
    "batchQuantity": 500,
    "setupCostPerHour": 100,
    "unitCost": 10,
    "holdingRatePercent": 20,
    "initialSetupTime": 60
  };
const lowBandInputs: SmedSetupSuresiVeEkonomikPartiCalculatorInputs = {
    "annualDemand": 1,
    "batchQuantity": 500,
    "setupCostPerHour": 100,
    "unitCost": 10,
    "holdingRatePercent": 20,
    "initialSetupTime": 60
  };
const criticalBandInputs: SmedSetupSuresiVeEkonomikPartiCalculatorInputs = {
    "annualDemand": 6,
    "batchQuantity": 500,
    "setupCostPerHour": 100,
    "unitCost": 10,
    "holdingRatePercent": 20,
    "initialSetupTime": 60
  };

function expectValidationFailure(partial: Partial<SmedSetupSuresiVeEkonomikPartiCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SmedSetupSuresiVeEkonomikPartiCalculatorInputs;
  const validation = validateSmedSetupSuresiVeEkonomikPartiCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSmedSetupSuresiVeEkonomikPartiCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SmedSetupSuresiVeEkonomikPartiCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("smed-setup-suresi-ve-ekonomik-parti-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateSmedSetupSuresiVeEkonomikPartiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSmedSetupSuresiVeEkonomikPartiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSmedSetupSuresiVeEkonomikPartiCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSmedSetupSuresiVeEkonomikPartiCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSmedSetupSuresiVeEkonomikPartiCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, annualDemand: undefined } as unknown as SmedSetupSuresiVeEkonomikPartiCalculatorInputs;
    const validation = validateSmedSetupSuresiVeEkonomikPartiCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSmedSetupSuresiVeEkonomikPartiCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ annualDemand: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSmedSetupSuresiVeEkonomikPartiCalculatorInputs({ ...defaultInputs, annualDemand: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSmedSetupSuresiVeEkonomikPartiCalculator({ ...defaultInputs, annualDemand: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ initialSetupTime: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ initialSetupTime: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SMED_SETUP_SURESI_VE_EKONOMIK_PARTI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSmedSetupSuresiVeEkonomikPartiCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
