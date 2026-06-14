import { describe, expect, test } from "vitest";
import { FOTOKOPI_YAZICI_TONER_SAYFA_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fotokopi-yazici-toner-sayfa-maliyeti-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFotokopiYaziciTonerSayfaMaliyeti,
  type FotokopiYaziciTonerSayfaMaliyetiInputs,
} from "@/lib/premium-schema/calculators/fotokopi-yazici-toner-sayfa-maliyeti";
import { validateFotokopiYaziciTonerSayfaMaliyetiInputs } from "@/lib/premium-schema/calculators/fotokopi-yazici-toner-sayfa-maliyeti-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "fotokopi-yazici-toner-sayfa-maliyeti";
const SCHEMA_ID = "fotokopi-yazici-toner-sayfa-maliyeti";

const defaultInputs: FotokopiYaziciTonerSayfaMaliyetiInputs = {
    "tonerPrice": 80,
    "tonerYield": 3000,
    "drumPrice": 40,
    "drumYield": 20000,
    "paperCostPerSheet": 0.01,
    "wasteRate": 5
  };
const lowBandInputs: FotokopiYaziciTonerSayfaMaliyetiInputs = {
    "tonerPrice": 0.1,
    "tonerYield": 3000,
    "drumPrice": 40,
    "drumYield": 20000,
    "paperCostPerSheet": 0.01,
    "wasteRate": 5
  };
const criticalBandInputs: FotokopiYaziciTonerSayfaMaliyetiInputs = {
    "tonerPrice": 6,
    "tonerYield": 3000,
    "drumPrice": 40,
    "drumYield": 20000,
    "paperCostPerSheet": 0.01,
    "wasteRate": 5
  };

function expectValidationFailure(partial: Partial<FotokopiYaziciTonerSayfaMaliyetiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FotokopiYaziciTonerSayfaMaliyetiInputs;
  const validation = validateFotokopiYaziciTonerSayfaMaliyetiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFotokopiYaziciTonerSayfaMaliyeti(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FotokopiYaziciTonerSayfaMaliyetiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("fotokopi-yazici-toner-sayfa-maliyeti", () => {
  test("exact default oracle", () => {
    const result = calculateFotokopiYaziciTonerSayfaMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateFotokopiYaziciTonerSayfaMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFotokopiYaziciTonerSayfaMaliyeti(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFotokopiYaziciTonerSayfaMaliyeti(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFotokopiYaziciTonerSayfaMaliyeti(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, tonerPrice: undefined } as unknown as FotokopiYaziciTonerSayfaMaliyetiInputs;
    const validation = validateFotokopiYaziciTonerSayfaMaliyetiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFotokopiYaziciTonerSayfaMaliyeti(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ tonerPrice: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateFotokopiYaziciTonerSayfaMaliyetiInputs({ ...defaultInputs, tonerYield: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateFotokopiYaziciTonerSayfaMaliyeti({ ...defaultInputs, tonerYield: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ wasteRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ wasteRate: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FOTOKOPI_YAZICI_TONER_SAYFA_MALIYETI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateFotokopiYaziciTonerSayfaMaliyeti(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
