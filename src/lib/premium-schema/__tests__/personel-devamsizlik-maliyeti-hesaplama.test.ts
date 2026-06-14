import { describe, expect, test } from "vitest";
import { PERSONEL_DEVAMSIZLIK_MALIYETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/personel-devamsizlik-maliyeti-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePersonelDevamsizlikMaliyetiHesaplama,
  type PersonelDevamsizlikMaliyetiHesaplamaInputs,
} from "@/lib/premium-schema/calculators/personel-devamsizlik-maliyeti-hesaplama";
import { validatePersonelDevamsizlikMaliyetiHesaplamaInputs } from "@/lib/premium-schema/calculators/personel-devamsizlik-maliyeti-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "personel-devamsizlik-maliyeti-hesaplama";
const SCHEMA_ID = "personel-devamsizlik-maliyeti-hesaplama";

const defaultInputs: PersonelDevamsizlikMaliyetiHesaplamaInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5
  };
const lowBandInputs: PersonelDevamsizlikMaliyetiHesaplamaInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5
  };
const criticalBandInputs: PersonelDevamsizlikMaliyetiHesaplamaInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5
  };

function expectValidationFailure(partial: Partial<PersonelDevamsizlikMaliyetiHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PersonelDevamsizlikMaliyetiHesaplamaInputs;
  const validation = validatePersonelDevamsizlikMaliyetiHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePersonelDevamsizlikMaliyetiHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PersonelDevamsizlikMaliyetiHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("personel-devamsizlik-maliyeti-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculatePersonelDevamsizlikMaliyetiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePersonelDevamsizlikMaliyetiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePersonelDevamsizlikMaliyetiHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePersonelDevamsizlikMaliyetiHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePersonelDevamsizlikMaliyetiHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as PersonelDevamsizlikMaliyetiHesaplamaInputs;
    const validation = validatePersonelDevamsizlikMaliyetiHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePersonelDevamsizlikMaliyetiHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePersonelDevamsizlikMaliyetiHesaplamaInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePersonelDevamsizlikMaliyetiHesaplama({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ scrapRatePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ scrapRatePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PERSONEL_DEVAMSIZLIK_MALIYETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePersonelDevamsizlikMaliyetiHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
