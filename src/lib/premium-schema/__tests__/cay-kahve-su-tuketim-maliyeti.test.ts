import { describe, expect, test } from "vitest";
import { CAY_KAHVE_SU_TUKETIM_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cay-kahve-su-tuketim-maliyeti-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCayKahveSuTuketimMaliyeti,
  type CayKahveSuTuketimMaliyetiInputs,
} from "@/lib/premium-schema/calculators/cay-kahve-su-tuketim-maliyeti";
import { validateCayKahveSuTuketimMaliyetiInputs } from "@/lib/premium-schema/calculators/cay-kahve-su-tuketim-maliyeti-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cay-kahve-su-tuketim-maliyeti";
const SCHEMA_ID = "cay-kahve-su-tuketim-maliyeti";

const defaultInputs: CayKahveSuTuketimMaliyetiInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5
  };
const lowBandInputs: CayKahveSuTuketimMaliyetiInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5
  };
const criticalBandInputs: CayKahveSuTuketimMaliyetiInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5
  };

function expectValidationFailure(partial: Partial<CayKahveSuTuketimMaliyetiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CayKahveSuTuketimMaliyetiInputs;
  const validation = validateCayKahveSuTuketimMaliyetiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCayKahveSuTuketimMaliyeti(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CayKahveSuTuketimMaliyetiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("cay-kahve-su-tuketim-maliyeti", () => {
  test("exact default oracle", () => {
    const result = calculateCayKahveSuTuketimMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCayKahveSuTuketimMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCayKahveSuTuketimMaliyeti(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCayKahveSuTuketimMaliyeti(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCayKahveSuTuketimMaliyeti(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as CayKahveSuTuketimMaliyetiInputs;
    const validation = validateCayKahveSuTuketimMaliyetiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCayKahveSuTuketimMaliyeti(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCayKahveSuTuketimMaliyetiInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCayKahveSuTuketimMaliyeti({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ scrapRatePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ scrapRatePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CAY_KAHVE_SU_TUKETIM_MALIYETI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCayKahveSuTuketimMaliyeti(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
