import { describe, expect, test } from "vitest";
import { UPS_KESINTISIZ_GUC_KAYNAGI_SECIMI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ups-kesintisiz-guc-kaynagi-secimi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateUpsKesintisizGucKaynagiSecimi,
  type UpsKesintisizGucKaynagiSecimiInputs,
} from "@/lib/premium-schema/calculators/ups-kesintisiz-guc-kaynagi-secimi";
import { validateUpsKesintisizGucKaynagiSecimiInputs } from "@/lib/premium-schema/calculators/ups-kesintisiz-guc-kaynagi-secimi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "ups-kesintisiz-guc-kaynagi-secimi";
const SCHEMA_ID = "ups-kesintisiz-guc-kaynagi-secimi";

const defaultInputs: UpsKesintisizGucKaynagiSecimiInputs = {
    "totalLoadVA": 5000,
    "diversityFactorPercent": 80,
    "expansionMarginPercent": 20,
    "requiredAutonomyMinutes": 15,
    "dcBusVoltage": 48,
    "inverterEfficiencyPercent": 90
  };
const lowBandInputs: UpsKesintisizGucKaynagiSecimiInputs = {
    "totalLoadVA": 1,
    "diversityFactorPercent": 80,
    "expansionMarginPercent": 20,
    "requiredAutonomyMinutes": 15,
    "dcBusVoltage": 48,
    "inverterEfficiencyPercent": 90
  };
const criticalBandInputs: UpsKesintisizGucKaynagiSecimiInputs = {
    "totalLoadVA": 6,
    "diversityFactorPercent": 80,
    "expansionMarginPercent": 20,
    "requiredAutonomyMinutes": 15,
    "dcBusVoltage": 48,
    "inverterEfficiencyPercent": 90
  };

function expectValidationFailure(partial: Partial<UpsKesintisizGucKaynagiSecimiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as UpsKesintisizGucKaynagiSecimiInputs;
  const validation = validateUpsKesintisizGucKaynagiSecimiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateUpsKesintisizGucKaynagiSecimi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: UpsKesintisizGucKaynagiSecimiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("ups-kesintisiz-guc-kaynagi-secimi", () => {
  test("exact default oracle", () => {
    const result = calculateUpsKesintisizGucKaynagiSecimi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateUpsKesintisizGucKaynagiSecimi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateUpsKesintisizGucKaynagiSecimi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateUpsKesintisizGucKaynagiSecimi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateUpsKesintisizGucKaynagiSecimi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalLoadVA: undefined } as unknown as UpsKesintisizGucKaynagiSecimiInputs;
    const validation = validateUpsKesintisizGucKaynagiSecimiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateUpsKesintisizGucKaynagiSecimi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalLoadVA: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateUpsKesintisizGucKaynagiSecimiInputs({ ...defaultInputs, totalLoadVA: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateUpsKesintisizGucKaynagiSecimi({ ...defaultInputs, totalLoadVA: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ inverterEfficiencyPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ inverterEfficiencyPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = UPS_KESINTISIZ_GUC_KAYNAGI_SECIMI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateUpsKesintisizGucKaynagiSecimi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
