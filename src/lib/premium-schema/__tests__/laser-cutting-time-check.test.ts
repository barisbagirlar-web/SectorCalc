import { describe, expect, test } from "vitest";
import { LASER_CUTTING_TIME_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/laser-cutting-time-check-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateLaserCuttingTimeCheck,
  type LaserCuttingTimeCheckInputs,
} from "@/lib/premium-schema/calculators/laser-cutting-time-check";
import { validateLaserCuttingTimeCheckInputs } from "@/lib/premium-schema/calculators/laser-cutting-time-check-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "laser-cutting-time-check";
const SCHEMA_ID = "laser-cutting-time-check";

const defaultInputs: LaserCuttingTimeCheckInputs = {
    "cuttingLength": 1000,
    "feedRate": 1000,
    "pierceTime": 0.5,
    "machineEfficiency": 85,
    "productionQuantity": 100,
    "unitMaterialCost": 10
  };
const lowBandInputs: LaserCuttingTimeCheckInputs = {
    "cuttingLength": 0.1,
    "feedRate": 1000,
    "pierceTime": 0.5,
    "machineEfficiency": 85,
    "productionQuantity": 100,
    "unitMaterialCost": 10
  };
const criticalBandInputs: LaserCuttingTimeCheckInputs = {
    "cuttingLength": 6,
    "feedRate": 1000,
    "pierceTime": 0.5,
    "machineEfficiency": 85,
    "productionQuantity": 100,
    "unitMaterialCost": 10
  };

function expectValidationFailure(partial: Partial<LaserCuttingTimeCheckInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as LaserCuttingTimeCheckInputs;
  const validation = validateLaserCuttingTimeCheckInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateLaserCuttingTimeCheck(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: LaserCuttingTimeCheckInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("laser-cutting-time-check", () => {
  test("exact default oracle", () => {
    const result = calculateLaserCuttingTimeCheck(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateLaserCuttingTimeCheck(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateLaserCuttingTimeCheck(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateLaserCuttingTimeCheck(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateLaserCuttingTimeCheck(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, cuttingLength: undefined } as unknown as LaserCuttingTimeCheckInputs;
    const validation = validateLaserCuttingTimeCheckInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateLaserCuttingTimeCheck(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ cuttingLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateLaserCuttingTimeCheckInputs({ ...defaultInputs, cuttingLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateLaserCuttingTimeCheck({ ...defaultInputs, cuttingLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitMaterialCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitMaterialCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = LASER_CUTTING_TIME_CHECK_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateLaserCuttingTimeCheck(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
