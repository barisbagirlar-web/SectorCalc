import { describe, expect, test } from "vitest";
import {
  calculateSevenMudaEngineeringWasteCost,
  resolveHighestWasteCategoryIndex,
} from "@/lib/premium-schema/calculators/seven-muda-waste-cost";
import {
  validateSevenMudaEngineeringInputs,
  type SevenMudaEngineeringInputs,
} from "@/lib/premium-schema/calculators/seven-muda-waste-validation";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { runPremiumSchemaExtendedOracleComparisonAudit } from "@/lib/formula-governance/oracle/compare-premium-schema-extended-oracle";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";
import type { SchemaInputValues } from "@/lib/premium-schema/premium-calculator-schema";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import { resolveSevenMudaRev5Labels } from "@/lib/i18n/seven-muda-rev5-labels";

const SLUG = "7-israf-muda-avcisi-parasal-karsilik-calculator";

const baseContextInput: Record<keyof SevenMudaEngineeringInputs, unknown> = {
  analysisPeriodDays: 30,
  annualWorkingDays: 300,
  productionUnits: 1000,
  currency: "TRY",
  unitVariableCost: 50,
  unitSellingPrice: 100,
  grossMarginPercent: 30,
  overproductionUnits: 0,
  waitingHours: 0,
  waitingOpportunityCostMode: "manual",
  manualHourlyOpportunityCost: 0,
  unnecessaryTransportCost: 0,
  excessInventoryValue: 0,
  inventoryCarryingRatePercent: 20,
  unnecessaryMotionHours: 0,
  motionHourlyCost: 0,
  defectUnits: 0,
  reworkCostPerDefect: 0,
  overprocessingHours: 0,
  overprocessingHourlyCost: 0,
  dataConfidencePercent: 80,
  implementationDifficulty: 3,
};

function buildZeroWasteInput(): Record<keyof SevenMudaEngineeringInputs, unknown> {
  return { ...baseContextInput };
}

describe("seven-muda-waste-cost-calculator hotfix", () => {
  test("schema exposes all seven waste driver inputs in quick mode", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const wasteDriverIds = [
      "overproductionUnits",
      "waitingHours",
      "unnecessaryTransportCost",
      "excessInventoryValue",
      "unnecessaryMotionHours",
      "defectUnits",
      "overprocessingHours",
    ];

    for (const id of wasteDriverIds) {
      const field = schema.inputs.find((input) => input.id === id);
      expect(field).toBeDefined();
      expect(field?.required).toBe(true);
    }
  });

  test("1 — all zero waste drivers → totalWasteCost = 0 and Veri girilmedi", () => {
    const result = calculateSevenMudaEngineeringWasteCost(buildZeroWasteInput());
    const labels = resolveSevenMudaRev5Labels("tr");

    expect(result.totalWasteCost).toBe(0);
    expect(result.highestWasteCategory).toBe("none");
    expect(result.decisionVerdict.firstActionCategory).toBe("none");
    expect(result.decisionVerdict.biggestCostCategory).toBe("none");
    expect(labels.categoryName("none")).toBe("Veri girilmedi");
    expect(labels.summaryLevelText("no_detected_waste")).toBe(
      "Hesaplama için israf sürücüsü girilmeli",
    );
    expect(resolveHighestWasteCategoryIndex({
      overproductionCost: 0,
      waitingCost: 0,
      transportCost: 0,
      inventoryCost: 0,
      motionCost: 0,
      overprocessingCost: 0,
      defectCost: 0,
    })).toBe(0);
  });

  test("2 — overproductionUnits=10, unitVariableCost=50 → overproductionCost=500", () => {
    const result = calculateSevenMudaEngineeringWasteCost({
      ...baseContextInput,
      overproductionUnits: 10,
      unitVariableCost: 50,
    });

    expect(result.overproductionCost).toBe(500);
    expect(result.totalWasteCost).toBe(500);
  });

  test("3 — waitingHours=5, manualHourlyOpportunityCost=100 → waitingCost=500", () => {
    const result = calculateSevenMudaEngineeringWasteCost({
      ...baseContextInput,
      waitingHours: 5,
      manualHourlyOpportunityCost: 100,
      waitingOpportunityCostMode: "manual",
    });

    expect(result.waitingCost).toBe(500);
  });

  test("4 — inventory carrying proration → inventoryCost=200", () => {
    const result = calculateSevenMudaEngineeringWasteCost({
      ...baseContextInput,
      excessInventoryValue: 10000,
      inventoryCarryingRatePercent: 20,
      analysisPeriodDays: 30,
      annualWorkingDays: 300,
    });

    expect(result.inventoryCost).toBe(200);
  });

  test("5 — defectUnits=4, unitVariableCost=50, reworkCostPerDefect=20 → defectCost=280", () => {
    const result = calculateSevenMudaEngineeringWasteCost({
      ...baseContextInput,
      defectUnits: 4,
      unitVariableCost: 50,
      reworkCostPerDefect: 20,
    });

    expect(result.defectCost).toBe(280);
  });

  test("6 — mixed inputs pick largest waste category by cost", () => {
    const result = calculateSevenMudaEngineeringWasteCost({
      ...baseContextInput,
      overproductionUnits: 10,
      waitingHours: 20,
      manualHourlyOpportunityCost: 100,
      unnecessaryTransportCost: 500,
      excessInventoryValue: 10000,
      inventoryCarryingRatePercent: 20,
      unnecessaryMotionHours: 2,
      motionHourlyCost: 50,
      defectUnits: 1,
      reworkCostPerDefect: 10,
      overprocessingHours: 1,
      overprocessingHourlyCost: 100,
    });

    expect(result.highestWasteCategory).toBe("waiting");
    expect(result.waitingCost).toBeGreaterThan(result.overproductionCost);
    expect(result.waitingCost).toBeGreaterThan(result.transportCost);
  });

  test("premium schema engine matches direct calculator", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const mixedInput = {
      ...baseContextInput,
      overproductionUnits: 10,
      waitingHours: 5,
      manualHourlyOpportunityCost: 100,
    };

    const inputs: SchemaInputValues = {
      ...buildDefaultSchemaInputs(schema),
      ...(mixedInput as SchemaInputValues),
    };

    const engineResult = runPremiumSchemaEngine(schema, inputs);
    const directResult = calculateSevenMudaEngineeringWasteCost(mixedInput);

    const totalOutput = engineResult.outputs.find((output) => output.id === "totalWasteCost");
    expect(totalOutput?.raw).toBeCloseTo(directResult.totalWasteCost, 2);

    const rankOutput = engineResult.outputs.find(
      (output) => output.id === "highestWasteCategoryIndex",
    );
    expect(rankOutput?.raw).toBe(
      resolveHighestWasteCategoryIndex({
        overproductionCost: directResult.overproductionCost,
        waitingCost: directResult.waitingCost,
        transportCost: directResult.transportCost,
        inventoryCost: directResult.inventoryCost,
        motionCost: directResult.motionCost,
        overprocessingCost: directResult.overprocessingCost,
        defectCost: directResult.defectCost,
      }),
    );
  });

  test("FormulaContract is registered with REV5 outputs", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract?.slug).toBe(SLUG);
    expect(contract?.outputs).toContain("totalWasteCost");
    expect(contract?.outputs).toContain("highestWasteCategory");
    expect(contract?.outputs).toContain("recoveryScenarios");
    expect(contract?.outputs).toContain("decisionVerdict");
  });

  test("invalid inventoryCarryingRatePercent fails validation", () => {
    const invalid = { ...baseContextInput, inventoryCarryingRatePercent: 120 };
    const validation = validateSevenMudaEngineeringInputs(invalid);

    expect(validation.ok).toBe(false);
    expect(() => calculateSevenMudaEngineeringWasteCost(invalid)).toThrow();
  });

  test("extended oracle comparison passes for wired premium schema outputs", () => {
    const summary = runPremiumSchemaExtendedOracleComparisonAudit(SLUG);
    expect(summary.status).toBe("PASS");
    expect(summary.failCount).toBe(0);
  });
});
