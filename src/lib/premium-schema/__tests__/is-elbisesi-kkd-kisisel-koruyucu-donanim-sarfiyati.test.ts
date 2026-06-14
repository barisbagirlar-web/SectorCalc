import { describe, expect, test } from "vitest";
import { IS_ELBISESI_KKD_KISISEL_KORUYUCU_DONANIM_SARFIYATI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati,
  type IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs,
} from "@/lib/premium-schema/calculators/is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati";
import { validateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs } from "@/lib/premium-schema/calculators/is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati";
const SCHEMA_ID = "is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati";

const defaultInputs: IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs = {
    "numberOfWorkers": 50,
    "usageRatePerPeriod": 2,
    "unitCost": 25,
    "wasteRatePercent": 5,
    "overheadRatePercent": 20,
    "productionQuantity": 1000
  };
const lowBandInputs: IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs = {
    "numberOfWorkers": 1,
    "usageRatePerPeriod": 2,
    "unitCost": 25,
    "wasteRatePercent": 5,
    "overheadRatePercent": 20,
    "productionQuantity": 1000
  };
const criticalBandInputs: IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs = {
    "numberOfWorkers": 6,
    "usageRatePerPeriod": 2,
    "unitCost": 25,
    "wasteRatePercent": 5,
    "overheadRatePercent": 20,
    "productionQuantity": 1000
  };

function expectValidationFailure(partial: Partial<IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs;
  const validation = validateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati", () => {
  test("exact default oracle", () => {
    const result = calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, numberOfWorkers: undefined } as unknown as IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs;
    const validation = validateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ numberOfWorkers: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputs({ ...defaultInputs, numberOfWorkers: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati({ ...defaultInputs, numberOfWorkers: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = IS_ELBISESI_KKD_KISISEL_KORUYUCU_DONANIM_SARFIYATI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
