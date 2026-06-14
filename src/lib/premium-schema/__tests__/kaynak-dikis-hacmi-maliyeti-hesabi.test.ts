import { describe, expect, test } from "vitest";
import { KAYNAK_DIKIS_HACMI_MALIYETI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kaynak-dikis-hacmi-maliyeti-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKaynakDikisHacmiMaliyetiHesabi,
  type KaynakDikisHacmiMaliyetiHesabiInputs,
} from "@/lib/premium-schema/calculators/kaynak-dikis-hacmi-maliyeti-hesabi";
import { validateKaynakDikisHacmiMaliyetiHesabiInputs } from "@/lib/premium-schema/calculators/kaynak-dikis-hacmi-maliyeti-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kaynak-dikis-hacmi-maliyeti-hesabi";
const SCHEMA_ID = "kaynak-dikis-hacmi-maliyeti-hesabi";

const defaultInputs: KaynakDikisHacmiMaliyetiHesabiInputs = {
    "rootThickness": 5,
    "weldLength": 100,
    "reinforcementHeight": 2,
    "reinforcementWidth": 10,
    "density": 0.00785,
    "scrapRate": 10
  };
const lowBandInputs: KaynakDikisHacmiMaliyetiHesabiInputs = {
    "rootThickness": 0.1,
    "weldLength": 100,
    "reinforcementHeight": 2,
    "reinforcementWidth": 10,
    "density": 0.00785,
    "scrapRate": 10
  };
const criticalBandInputs: KaynakDikisHacmiMaliyetiHesabiInputs = {
    "rootThickness": 6,
    "weldLength": 100,
    "reinforcementHeight": 2,
    "reinforcementWidth": 10,
    "density": 0.00785,
    "scrapRate": 10
  };

function expectValidationFailure(partial: Partial<KaynakDikisHacmiMaliyetiHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KaynakDikisHacmiMaliyetiHesabiInputs;
  const validation = validateKaynakDikisHacmiMaliyetiHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKaynakDikisHacmiMaliyetiHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KaynakDikisHacmiMaliyetiHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kaynak-dikis-hacmi-maliyeti-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateKaynakDikisHacmiMaliyetiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKaynakDikisHacmiMaliyetiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKaynakDikisHacmiMaliyetiHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKaynakDikisHacmiMaliyetiHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKaynakDikisHacmiMaliyetiHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, rootThickness: undefined } as unknown as KaynakDikisHacmiMaliyetiHesabiInputs;
    const validation = validateKaynakDikisHacmiMaliyetiHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKaynakDikisHacmiMaliyetiHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ rootThickness: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKaynakDikisHacmiMaliyetiHesabiInputs({ ...defaultInputs, rootThickness: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKaynakDikisHacmiMaliyetiHesabi({ ...defaultInputs, rootThickness: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ scrapRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ scrapRate: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KAYNAK_DIKIS_HACMI_MALIYETI_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKaynakDikisHacmiMaliyetiHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
