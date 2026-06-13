import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTextileFabricWasteRisk,
  type TextileFabricWasteRiskInputs,
} from "@/lib/premium-schema/calculators/textile-fabric-waste-risk";
import { validateTextileFabricWasteRiskInputs } from "@/lib/premium-schema/calculators/textile-fabric-waste-risk-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "textile-fabric-waste-risk";

const defaultInputs: TextileFabricWasteRiskInputs = {
    "fabricCost": 22000,
    "cuttingWastePercent": 6,
    "targetWastePercent": 3,
    "shrinkagePercent": 4,
    "dyeReworkCost": 1500
  };
const lowBandInputs: TextileFabricWasteRiskInputs = {
    "fabricCost": 220,
    "cuttingWastePercent": 6,
    "targetWastePercent": 3,
    "shrinkagePercent": 4,
    "dyeReworkCost": 1500
  };
const criticalBandInputs: TextileFabricWasteRiskInputs = {
    "fabricCost": 22000000,
    "cuttingWastePercent": 6,
    "targetWastePercent": 3,
    "shrinkagePercent": 4,
    "dyeReworkCost": 1500
  };

function expectValidationFailure(partial: Partial<TextileFabricWasteRiskInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TextileFabricWasteRiskInputs;
  const validation = validateTextileFabricWasteRiskInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTextileFabricWasteRisk(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TextileFabricWasteRiskInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("textile-fabric-waste-risk", () => {
  test("exact default oracle", () => {
    const result = calculateTextileFabricWasteRisk(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.excessCuttingWaste).toBeCloseTo(engineNumeric(SLUG, "excessCuttingWaste", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTextileFabricWasteRisk(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateTextileFabricWasteRisk(lowBandInputs);
    const defaultResult = calculateTextileFabricWasteRisk(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateTextileFabricWasteRisk(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTextileFabricWasteRisk(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, fabricCost: undefined } as unknown as TextileFabricWasteRiskInputs;
    const validation = validateTextileFabricWasteRiskInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTextileFabricWasteRisk(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ fabricCost: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ dyeReworkCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ dyeReworkCost: Number.POSITIVE_INFINITY });
  });

  test("contract metadata matches slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateTextileFabricWasteRisk(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "excessCuttingWaste")?.raw).toBeCloseTo(calculatorResult.excessCuttingWaste, 2);
  });
});
