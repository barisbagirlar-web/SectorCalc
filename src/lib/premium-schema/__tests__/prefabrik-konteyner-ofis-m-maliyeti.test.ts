import { describe, expect, test } from "vitest";
import { PREFABRIK_KONTEYNER_OFIS_M_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/prefabrik-konteyner-ofis-m-maliyeti-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePrefabrikKonteynerOfisMMaliyeti,
  type PrefabrikKonteynerOfisMMaliyetiInputs,
} from "@/lib/premium-schema/calculators/prefabrik-konteyner-ofis-m-maliyeti";
import { validatePrefabrikKonteynerOfisMMaliyetiInputs } from "@/lib/premium-schema/calculators/prefabrik-konteyner-ofis-m-maliyeti-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "prefabrik-konteyner-ofis-m-maliyeti";
const SCHEMA_ID = "prefabrik-konteyner-ofis-m-maliyeti";

const defaultInputs: PrefabrikKonteynerOfisMMaliyetiInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "unitLaborCost": 20,
    "fixedOverhead": 500
  };
const lowBandInputs: PrefabrikKonteynerOfisMMaliyetiInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "unitLaborCost": 20,
    "fixedOverhead": 500
  };
const criticalBandInputs: PrefabrikKonteynerOfisMMaliyetiInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "unitLaborCost": 20,
    "fixedOverhead": 500
  };

function expectValidationFailure(partial: Partial<PrefabrikKonteynerOfisMMaliyetiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PrefabrikKonteynerOfisMMaliyetiInputs;
  const validation = validatePrefabrikKonteynerOfisMMaliyetiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePrefabrikKonteynerOfisMMaliyeti(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PrefabrikKonteynerOfisMMaliyetiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("prefabrik-konteyner-ofis-m-maliyeti", () => {
  test("exact default oracle", () => {
    const result = calculatePrefabrikKonteynerOfisMMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePrefabrikKonteynerOfisMMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePrefabrikKonteynerOfisMMaliyeti(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePrefabrikKonteynerOfisMMaliyeti(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePrefabrikKonteynerOfisMMaliyeti(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as PrefabrikKonteynerOfisMMaliyetiInputs;
    const validation = validatePrefabrikKonteynerOfisMMaliyetiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePrefabrikKonteynerOfisMMaliyeti(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePrefabrikKonteynerOfisMMaliyetiInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePrefabrikKonteynerOfisMMaliyeti({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fixedOverhead: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fixedOverhead: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PREFABRIK_KONTEYNER_OFIS_M_MALIYETI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePrefabrikKonteynerOfisMMaliyeti(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
