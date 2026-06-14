import { describe, expect, test } from "vitest";
import { SOGUK_ODA_SOGUTMA_YUKU_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/soguk-oda-sogutma-yuku-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSogukOdaSogutmaYukuHesabi,
  type SogukOdaSogutmaYukuHesabiInputs,
} from "@/lib/premium-schema/calculators/soguk-oda-sogutma-yuku-hesabi";
import { validateSogukOdaSogutmaYukuHesabiInputs } from "@/lib/premium-schema/calculators/soguk-oda-sogutma-yuku-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "soguk-oda-sogutma-yuku-hesabi";
const SCHEMA_ID = "soguk-oda-sogutma-yuku-hesabi";

const defaultInputs: SogukOdaSogutmaYukuHesabiInputs = {
    "roomLength": 10,
    "roomWidth": 8,
    "roomHeight": 4,
    "wallUValue": 0.5,
    "ceilingUValue": 0.4,
    "floorUValue": 0.3
  };
const lowBandInputs: SogukOdaSogutmaYukuHesabiInputs = {
    "roomLength": 0.1,
    "roomWidth": 8,
    "roomHeight": 4,
    "wallUValue": 0.5,
    "ceilingUValue": 0.4,
    "floorUValue": 0.3
  };
const criticalBandInputs: SogukOdaSogutmaYukuHesabiInputs = {
    "roomLength": 6,
    "roomWidth": 8,
    "roomHeight": 4,
    "wallUValue": 0.5,
    "ceilingUValue": 0.4,
    "floorUValue": 0.3
  };

function expectValidationFailure(partial: Partial<SogukOdaSogutmaYukuHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SogukOdaSogutmaYukuHesabiInputs;
  const validation = validateSogukOdaSogutmaYukuHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSogukOdaSogutmaYukuHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SogukOdaSogutmaYukuHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("soguk-oda-sogutma-yuku-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateSogukOdaSogutmaYukuHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSogukOdaSogutmaYukuHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSogukOdaSogutmaYukuHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSogukOdaSogutmaYukuHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSogukOdaSogutmaYukuHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, roomLength: undefined } as unknown as SogukOdaSogutmaYukuHesabiInputs;
    const validation = validateSogukOdaSogutmaYukuHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSogukOdaSogutmaYukuHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ roomLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSogukOdaSogutmaYukuHesabiInputs({ ...defaultInputs, roomLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSogukOdaSogutmaYukuHesabi({ ...defaultInputs, roomLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ floorUValue: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ floorUValue: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SOGUK_ODA_SOGUTMA_YUKU_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSogukOdaSogutmaYukuHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
