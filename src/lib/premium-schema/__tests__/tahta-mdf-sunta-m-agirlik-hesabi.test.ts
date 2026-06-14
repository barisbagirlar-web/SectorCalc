import { describe, expect, test } from "vitest";
import { TAHTA_MDF_SUNTA_M_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tahta-mdf-sunta-m-agirlik-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTahtaMdfSuntaMAgirlikHesabi,
  type TahtaMdfSuntaMAgirlikHesabiInputs,
} from "@/lib/premium-schema/calculators/tahta-mdf-sunta-m-agirlik-hesabi";
import { validateTahtaMdfSuntaMAgirlikHesabiInputs } from "@/lib/premium-schema/calculators/tahta-mdf-sunta-m-agirlik-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "tahta-mdf-sunta-m-agirlik-hesabi";
const SCHEMA_ID = "tahta-mdf-sunta-m-agirlik-hesabi";

const defaultInputs: TahtaMdfSuntaMAgirlikHesabiInputs = {
    "panelLength": 2.44,
    "panelWidth": 1.22,
    "panelThickness": 0.018,
    "materialDensity": 700,
    "moistureContent": 8
  };
const lowBandInputs: TahtaMdfSuntaMAgirlikHesabiInputs = {
    "panelLength": 0.1,
    "panelWidth": 1.22,
    "panelThickness": 0.018,
    "materialDensity": 700,
    "moistureContent": 8
  };
const criticalBandInputs: TahtaMdfSuntaMAgirlikHesabiInputs = {
    "panelLength": 6,
    "panelWidth": 1.22,
    "panelThickness": 0.018,
    "materialDensity": 700,
    "moistureContent": 8
  };

function expectValidationFailure(partial: Partial<TahtaMdfSuntaMAgirlikHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TahtaMdfSuntaMAgirlikHesabiInputs;
  const validation = validateTahtaMdfSuntaMAgirlikHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTahtaMdfSuntaMAgirlikHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TahtaMdfSuntaMAgirlikHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("tahta-mdf-sunta-m-agirlik-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateTahtaMdfSuntaMAgirlikHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTahtaMdfSuntaMAgirlikHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateTahtaMdfSuntaMAgirlikHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateTahtaMdfSuntaMAgirlikHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTahtaMdfSuntaMAgirlikHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, panelLength: undefined } as unknown as TahtaMdfSuntaMAgirlikHesabiInputs;
    const validation = validateTahtaMdfSuntaMAgirlikHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTahtaMdfSuntaMAgirlikHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ panelLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateTahtaMdfSuntaMAgirlikHesabiInputs({ ...defaultInputs, panelLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateTahtaMdfSuntaMAgirlikHesabi({ ...defaultInputs, panelLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ moistureContent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ moistureContent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TAHTA_MDF_SUNTA_M_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateTahtaMdfSuntaMAgirlikHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
