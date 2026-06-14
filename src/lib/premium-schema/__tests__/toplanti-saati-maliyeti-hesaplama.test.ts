import { describe, expect, test } from "vitest";
import { TOPLANTI_SAATI_MALIYETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/toplanti-saati-maliyeti-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateToplantiSaatiMaliyetiHesaplama,
  type ToplantiSaatiMaliyetiHesaplamaInputs,
} from "@/lib/premium-schema/calculators/toplanti-saati-maliyeti-hesaplama";
import { validateToplantiSaatiMaliyetiHesaplamaInputs } from "@/lib/premium-schema/calculators/toplanti-saati-maliyeti-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "toplanti-saati-maliyeti-hesaplama";
const SCHEMA_ID = "toplanti-saati-maliyeti-hesaplama";

const defaultInputs: ToplantiSaatiMaliyetiHesaplamaInputs = {
    "totalAttendees": 10,
    "hourlyRate": 50,
    "meetingDurationHours": 1,
    "overheadRatePercent": 20,
    "opportunityFactor": 0.5
  };
const lowBandInputs: ToplantiSaatiMaliyetiHesaplamaInputs = {
    "totalAttendees": 1,
    "hourlyRate": 50,
    "meetingDurationHours": 1,
    "overheadRatePercent": 20,
    "opportunityFactor": 0.5
  };
const criticalBandInputs: ToplantiSaatiMaliyetiHesaplamaInputs = {
    "totalAttendees": 6,
    "hourlyRate": 50,
    "meetingDurationHours": 1,
    "overheadRatePercent": 20,
    "opportunityFactor": 0.5
  };

function expectValidationFailure(partial: Partial<ToplantiSaatiMaliyetiHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ToplantiSaatiMaliyetiHesaplamaInputs;
  const validation = validateToplantiSaatiMaliyetiHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateToplantiSaatiMaliyetiHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ToplantiSaatiMaliyetiHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("toplanti-saati-maliyeti-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateToplantiSaatiMaliyetiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateToplantiSaatiMaliyetiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateToplantiSaatiMaliyetiHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateToplantiSaatiMaliyetiHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateToplantiSaatiMaliyetiHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalAttendees: undefined } as unknown as ToplantiSaatiMaliyetiHesaplamaInputs;
    const validation = validateToplantiSaatiMaliyetiHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateToplantiSaatiMaliyetiHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalAttendees: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateToplantiSaatiMaliyetiHesaplamaInputs({ ...defaultInputs, totalAttendees: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateToplantiSaatiMaliyetiHesaplama({ ...defaultInputs, totalAttendees: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ opportunityFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ opportunityFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TOPLANTI_SAATI_MALIYETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateToplantiSaatiMaliyetiHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
