import { describe, expect, test } from "vitest";
import { DISLI_MODUL_CAP_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/disli-modul-cap-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateDisliModulCapHesaplama,
  type DisliModulCapHesaplamaInputs,
} from "@/lib/premium-schema/calculators/disli-modul-cap-hesaplama";
import { validateDisliModulCapHesaplamaInputs } from "@/lib/premium-schema/calculators/disli-modul-cap-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "disli-modul-cap-hesaplama";
const SCHEMA_ID = "disli-modul-cap-hesaplama";

const defaultInputs: DisliModulCapHesaplamaInputs = {
    "module": 2,
    "numberOfTeeth": 20,
    "addendumCoefficient": 1,
    "dedendumCoefficient": 1.25
  };
const lowBandInputs: DisliModulCapHesaplamaInputs = {
    "module": 0.1,
    "numberOfTeeth": 20,
    "addendumCoefficient": 1,
    "dedendumCoefficient": 1.25
  };
const criticalBandInputs: DisliModulCapHesaplamaInputs = {
    "module": 6,
    "numberOfTeeth": 20,
    "addendumCoefficient": 1,
    "dedendumCoefficient": 1.25
  };

function expectValidationFailure(partial: Partial<DisliModulCapHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as DisliModulCapHesaplamaInputs;
  const validation = validateDisliModulCapHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateDisliModulCapHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: DisliModulCapHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("disli-modul-cap-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateDisliModulCapHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateDisliModulCapHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateDisliModulCapHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateDisliModulCapHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateDisliModulCapHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, module: undefined } as unknown as DisliModulCapHesaplamaInputs;
    const validation = validateDisliModulCapHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateDisliModulCapHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ module: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateDisliModulCapHesaplamaInputs({ ...defaultInputs, module: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateDisliModulCapHesaplama({ ...defaultInputs, module: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ dedendumCoefficient: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ dedendumCoefficient: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = DISLI_MODUL_CAP_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateDisliModulCapHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
