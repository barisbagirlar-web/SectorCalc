import { describe, expect, test } from "vitest";
import { ALTI_SIGMA_DPMO_SIGMA_SEVIYESI_CEVIRICI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/alti-sigma-dpmo-sigma-seviyesi-cevirici-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAltiSigmaDpmoSigmaSeviyesiCevirici,
  type AltiSigmaDpmoSigmaSeviyesiCeviriciInputs,
} from "@/lib/premium-schema/calculators/alti-sigma-dpmo-sigma-seviyesi-cevirici";
import { validateAltiSigmaDpmoSigmaSeviyesiCeviriciInputs } from "@/lib/premium-schema/calculators/alti-sigma-dpmo-sigma-seviyesi-cevirici-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "alti-sigma-dpmo-sigma-seviyesi-cevirici";
const SCHEMA_ID = "alti-sigma-dpmo-sigma-seviyesi-cevirici";

const defaultInputs: AltiSigmaDpmoSigmaSeviyesiCeviriciInputs = {
    "totalUnits": 1000,
    "totalDefects": 10,
    "opportunitiesPerUnit": 1
  };
const lowBandInputs: AltiSigmaDpmoSigmaSeviyesiCeviriciInputs = {
    "totalUnits": 1,
    "totalDefects": 10,
    "opportunitiesPerUnit": 1
  };
const criticalBandInputs: AltiSigmaDpmoSigmaSeviyesiCeviriciInputs = {
    "totalUnits": 6,
    "totalDefects": 10,
    "opportunitiesPerUnit": 1
  };

function expectValidationFailure(partial: Partial<AltiSigmaDpmoSigmaSeviyesiCeviriciInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AltiSigmaDpmoSigmaSeviyesiCeviriciInputs;
  const validation = validateAltiSigmaDpmoSigmaSeviyesiCeviriciInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAltiSigmaDpmoSigmaSeviyesiCevirici(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AltiSigmaDpmoSigmaSeviyesiCeviriciInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("alti-sigma-dpmo-sigma-seviyesi-cevirici", () => {
  test("exact default oracle", () => {
    const result = calculateAltiSigmaDpmoSigmaSeviyesiCevirici(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAltiSigmaDpmoSigmaSeviyesiCevirici(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAltiSigmaDpmoSigmaSeviyesiCevirici(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAltiSigmaDpmoSigmaSeviyesiCevirici(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAltiSigmaDpmoSigmaSeviyesiCevirici(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalUnits: undefined } as unknown as AltiSigmaDpmoSigmaSeviyesiCeviriciInputs;
    const validation = validateAltiSigmaDpmoSigmaSeviyesiCeviriciInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAltiSigmaDpmoSigmaSeviyesiCevirici(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalUnits: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAltiSigmaDpmoSigmaSeviyesiCeviriciInputs({ ...defaultInputs, totalUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAltiSigmaDpmoSigmaSeviyesiCevirici({ ...defaultInputs, totalUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ opportunitiesPerUnit: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ opportunitiesPerUnit: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ALTI_SIGMA_DPMO_SIGMA_SEVIYESI_CEVIRICI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAltiSigmaDpmoSigmaSeviyesiCevirici(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
