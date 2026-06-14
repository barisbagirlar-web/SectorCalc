import { describe, expect, test } from "vitest";
import { ENJEKSIYON_DOKUM_CEKME_PAYI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/enjeksiyon-dokum-cekme-payi-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEnjeksiyonDokumCekmePayiHesabi,
  type EnjeksiyonDokumCekmePayiHesabiInputs,
} from "@/lib/premium-schema/calculators/enjeksiyon-dokum-cekme-payi-hesabi";
import { validateEnjeksiyonDokumCekmePayiHesabiInputs } from "@/lib/premium-schema/calculators/enjeksiyon-dokum-cekme-payi-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "enjeksiyon-dokum-cekme-payi-hesabi";
const SCHEMA_ID = "enjeksiyon-dokum-cekme-payi-hesabi";

const defaultInputs: EnjeksiyonDokumCekmePayiHesabiInputs = {
    "nominalPartDimension": 100,
    "shrinkageRatePercent": 1.5,
    "materialCorrectionFactor": 1
  };
const lowBandInputs: EnjeksiyonDokumCekmePayiHesabiInputs = {
    "nominalPartDimension": 0.1,
    "shrinkageRatePercent": 1.5,
    "materialCorrectionFactor": 1
  };
const criticalBandInputs: EnjeksiyonDokumCekmePayiHesabiInputs = {
    "nominalPartDimension": 6,
    "shrinkageRatePercent": 1.5,
    "materialCorrectionFactor": 1
  };

function expectValidationFailure(partial: Partial<EnjeksiyonDokumCekmePayiHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as EnjeksiyonDokumCekmePayiHesabiInputs;
  const validation = validateEnjeksiyonDokumCekmePayiHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEnjeksiyonDokumCekmePayiHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: EnjeksiyonDokumCekmePayiHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("enjeksiyon-dokum-cekme-payi-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateEnjeksiyonDokumCekmePayiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateEnjeksiyonDokumCekmePayiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateEnjeksiyonDokumCekmePayiHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateEnjeksiyonDokumCekmePayiHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateEnjeksiyonDokumCekmePayiHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, nominalPartDimension: undefined } as unknown as EnjeksiyonDokumCekmePayiHesabiInputs;
    const validation = validateEnjeksiyonDokumCekmePayiHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateEnjeksiyonDokumCekmePayiHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ nominalPartDimension: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateEnjeksiyonDokumCekmePayiHesabiInputs({ ...defaultInputs, nominalPartDimension: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateEnjeksiyonDokumCekmePayiHesabi({ ...defaultInputs, nominalPartDimension: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ materialCorrectionFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ materialCorrectionFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ENJEKSIYON_DOKUM_CEKME_PAYI_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateEnjeksiyonDokumCekmePayiHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
