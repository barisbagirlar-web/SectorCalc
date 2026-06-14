import { describe, expect, test } from "vitest";
import { IOT_SENSOR_VE_ONGORUCU_BAKIM_YATIRIM_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator,
  type IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs,
} from "@/lib/premium-schema/calculators/iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator";
import { validateIotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs } from "@/lib/premium-schema/calculators/iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator";
const SCHEMA_ID = "iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator";

const defaultInputs: IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs = {
    "downtimeMinutes": 5000,
    "machineHourlyRate": 150,
    "laborHourlyRate": 50,
    "lostProductionUnits": 1000,
    "contributionMarginPerUnit": 20,
    "repairCost": 5000
  };
const lowBandInputs: IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs = {
    "downtimeMinutes": 0.1,
    "machineHourlyRate": 150,
    "laborHourlyRate": 50,
    "lostProductionUnits": 1000,
    "contributionMarginPerUnit": 20,
    "repairCost": 5000
  };
const criticalBandInputs: IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs = {
    "downtimeMinutes": 6,
    "machineHourlyRate": 150,
    "laborHourlyRate": 50,
    "lostProductionUnits": 1000,
    "contributionMarginPerUnit": 20,
    "repairCost": 5000
  };

function expectValidationFailure(partial: Partial<IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs;
  const validation = validateIotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, downtimeMinutes: undefined } as unknown as IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs;
    const validation = validateIotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeMinutes: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputs({ ...defaultInputs, lostProductionUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator({ ...defaultInputs, lostProductionUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = IOT_SENSOR_VE_ONGORUCU_BAKIM_YATIRIM_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
