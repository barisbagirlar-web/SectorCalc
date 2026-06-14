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

const SLUG = "7-israf-muda-avcisi-parasal-karsilik-calculator";
const TOLERANCE = 0.01;

const baseRev5Input: Record<keyof SevenMudaEngineeringInputs, unknown> = {
  analysisPeriodDays: 30,
  workingDaysPerYear: 250,
  productionUnitsInPeriod: 10000,

  currencyCode: "TRY",
  unitVariableCost: 50,
  unitSellingPrice: 100,
  grossMarginPct: 30,

  excessUnits: 100,
  excessInventoryHoldingDays: 45,
  excessWriteDownCostPerUnit: 5,

  waitingMinutes: 120,
  affectedOperators: 2,
  hourlyLaborCost: 360,
  affectedMachines: 1,
  hourlyMachineCost: 600,
  waitingOpportunityMode: "derivedThroughput",
  hourlyOpportunityCost: 0,
  plannedUnitsPerHour: 100,

  transportDistanceKm: 30,
  transportTrips: 4,
  transportCostPerKm: 12,
  handlingMinutesPerTrip: 15,
  handlingHourlyLaborCost: 360,
  transportDamageRatePct: 1,
  averageLoadValue: 20000,

  averageExcessInventoryValue: 20000,
  inventoryHoldingRatePct: 10,
  inventoryObsolescenceValue: 500,
  inventoryShrinkageRatePct: 1,

  unnecessaryMotionMinutes: 90,
  motionAffectedOperators: 2,
  motionHourlyLaborCost: 360,

  overprocessingMinutes: 60,
  overprocessingHourlyResourceCost: 480,
  extraMaterialCost: 750,
  extraEnergyCost: 100,
  extraInspectionCost: 100,

  scrapUnits: 20,
  scrapDisposalCostPerUnit: 2,
  reworkMinutes: 80,
  reworkHourlyLaborCost: 360,
  reworkHourlyMachineCost: 480,
  customerReturnCost: 0,
  warrantyCost: 0,
  expediteCost: 0,

  dataConfidencePct: 80,
  implementationDifficultyScore: 3,
};

const EXPECTED_BASE = {
  overproductionCost: 5561.6438356164,
  waitingCost: 8640,
  transportCost: 2600,
  inventoryCost: 864.3835616438,
  motionCost: 1080,
  overprocessingCost: 1430,
  defectCost: 2160,
  totalWasteCost: 22336.0273972602,
  annualizedWasteCost: 22336.0273972602 * (250 / 30),
  periodRevenue: 1_000_000,
  periodGrossMarginValue: 300_000,
  wasteToRevenueRatioPct: (22336.0273972602 / 1_000_000) * 100,
  wasteToGrossMarginRatioPct: (22336.0273972602 / 300_000) * 100,
};

function buildZeroRev5Input(): Record<keyof SevenMudaEngineeringInputs, unknown> {
  return {
    ...baseRev5Input,
    excessUnits: 0,
    excessInventoryHoldingDays: 0,
    excessWriteDownCostPerUnit: 0,
    waitingMinutes: 0,
    affectedOperators: 0,
    hourlyLaborCost: 0,
    affectedMachines: 0,
    hourlyMachineCost: 0,
    waitingOpportunityMode: "none",
    hourlyOpportunityCost: 0,
    plannedUnitsPerHour: 0,
    transportDistanceKm: 0,
    transportTrips: 0,
    transportCostPerKm: 0,
    handlingMinutesPerTrip: 0,
    handlingHourlyLaborCost: 0,
    transportDamageRatePct: 0,
    averageLoadValue: 0,
    averageExcessInventoryValue: 0,
    inventoryHoldingRatePct: 0,
    inventoryObsolescenceValue: 0,
    inventoryShrinkageRatePct: 0,
    unnecessaryMotionMinutes: 0,
    motionAffectedOperators: 0,
    motionHourlyLaborCost: 0,
    overprocessingMinutes: 0,
    overprocessingHourlyResourceCost: 0,
    extraMaterialCost: 0,
    extraEnergyCost: 0,
    extraInspectionCost: 0,
    scrapUnits: 0,
    scrapDisposalCostPerUnit: 0,
    reworkMinutes: 0,
    reworkHourlyLaborCost: 0,
    reworkHourlyMachineCost: 0,
    customerReturnCost: 0,
    warrantyCost: 0,
    expediteCost: 0,
  };
}

describe("seven-muda-waste-cost-calculator REV5", () => {
  test("FormulaContract is registered with REV5 outputs", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract?.slug).toBe(SLUG);
    expect(contract?.outputs).toContain("totalWasteCost");
    expect(contract?.outputs).toContain("highestWasteCategory");
    expect(contract?.outputs).toContain("recoveryScenarios");
    expect(contract?.outputs).toContain("decisionVerdict");
  });

  test("1 — all zero waste returns no_detected_waste shape", () => {
    const result = calculateSevenMudaEngineeringWasteCost(buildZeroRev5Input());

    expect(result.totalWasteCost).toBe(0);
    expect(result.annualizedWasteCost).toBe(0);
    expect(result.highestWasteCategory).toBe("none");
    expect(result.highestWasteCost).toBe(0);
    expect(result.wasteBreakdown).toHaveLength(7);
    expect(result.recommendedActionOrder).toHaveLength(7);
    expect(result.decisionVerdict.summaryLevel).toBe("no_detected_waste");
  });

  test("2 — realistic mixed waste exact oracle", () => {
    const result = calculateSevenMudaEngineeringWasteCost(baseRev5Input);

    expect(result.overproductionCost).toBeCloseTo(EXPECTED_BASE.overproductionCost, 2);
    expect(result.waitingCost).toBeCloseTo(EXPECTED_BASE.waitingCost, 2);
    expect(result.transportCost).toBeCloseTo(EXPECTED_BASE.transportCost, 2);
    expect(result.inventoryCost).toBeCloseTo(EXPECTED_BASE.inventoryCost, 2);
    expect(result.motionCost).toBeCloseTo(EXPECTED_BASE.motionCost, 2);
    expect(result.overprocessingCost).toBeCloseTo(EXPECTED_BASE.overprocessingCost, 2);
    expect(result.defectCost).toBeCloseTo(EXPECTED_BASE.defectCost, 2);
    expect(result.totalWasteCost).toBeCloseTo(EXPECTED_BASE.totalWasteCost, 2);
    expect(result.annualizedWasteCost).toBeCloseTo(EXPECTED_BASE.annualizedWasteCost, 2);
    expect(result.periodRevenue).toBeCloseTo(EXPECTED_BASE.periodRevenue, 2);
    expect(result.periodGrossMarginValue).toBeCloseTo(EXPECTED_BASE.periodGrossMarginValue, 2);
    expect(result.wasteToRevenueRatioPct).toBeCloseTo(EXPECTED_BASE.wasteToRevenueRatioPct, 2);
    expect(result.wasteToGrossMarginRatioPct).toBeCloseTo(EXPECTED_BASE.wasteToGrossMarginRatioPct, 2);
    expect(result.highestWasteCategory).toBe("waiting");
  });

  test("3 — defects dominate total waste", () => {
    const result = calculateSevenMudaEngineeringWasteCost({
      ...baseRev5Input,
      excessUnits: 0,
      excessInventoryHoldingDays: 0,
      excessWriteDownCostPerUnit: 0,
      waitingMinutes: 0,
      affectedOperators: 0,
      affectedMachines: 0,
      hourlyMachineCost: 0,
      waitingOpportunityMode: "none",
      transportDistanceKm: 0,
      transportTrips: 0,
      averageExcessInventoryValue: 0,
      inventoryObsolescenceValue: 0,
      unnecessaryMotionMinutes: 0,
      overprocessingMinutes: 0,
      extraMaterialCost: 0,
      extraEnergyCost: 0,
      extraInspectionCost: 0,
      scrapUnits: 500,
      scrapDisposalCostPerUnit: 10,
      reworkMinutes: 400,
      customerReturnCost: 5000,
      warrantyCost: 3000,
      expediteCost: 2000,
    });

    expect(result.highestWasteCategory).toBe("defects");
    expect(result.defectCost).toBeGreaterThan(result.overproductionCost);
    expect(result.defectCost).toBeGreaterThan(result.waitingCost);
    expect(result.defectCost).toBeGreaterThan(result.transportCost);
  });

  test("4 — invalid percentage fails validation and calculation", () => {
    const invalid = { ...baseRev5Input, inventoryHoldingRatePct: 120 };
    const validation = validateSevenMudaEngineeringInputs(invalid);

    expect(validation.ok).toBe(false);
    expect(() => calculateSevenMudaEngineeringWasteCost(invalid)).toThrow();
  });

  test("5 — invalid currencyCode fails; TRY passes", () => {
    for (const currencyCode of ["usd", "", "TL"]) {
      const validation = validateSevenMudaEngineeringInputs({ ...baseRev5Input, currencyCode });
      expect(validation.ok).toBe(false);
      expect(() => calculateSevenMudaEngineeringWasteCost({ ...baseRev5Input, currencyCode })).toThrow();
    }

    const valid = validateSevenMudaEngineeringInputs({ ...baseRev5Input, currencyCode: "TRY" });
    expect(valid.ok).toBe(true);
  });

  test("6 — waiting double-count warning when direct and opportunity costs overlap", () => {
    const result = calculateSevenMudaEngineeringWasteCost({
      ...baseRev5Input,
      waitingOpportunityMode: "manualHourly",
      hourlyOpportunityCost: 500,
    });

    expect(result.doubleCountWarnings.length).toBeGreaterThan(0);
    expect(
      result.doubleCountWarnings.some((warning) =>
        warning.includes("direct labor/machine cost and opportunity cost"),
      ),
    ).toBe(true);
  });

  test("7 — recommendedActionOrder follows descending actionPriorityScore", () => {
    const result = calculateSevenMudaEngineeringWasteCost(baseRev5Input);
    const scoreByKey = new Map(
      result.wasteBreakdown.map((item) => [item.key, item.actionPriorityScore]),
    );

    for (let index = 1; index < result.recommendedActionOrder.length; index += 1) {
      const previousKey = result.recommendedActionOrder[index - 1];
      const currentKey = result.recommendedActionOrder[index];
      const previousScore = scoreByKey.get(previousKey) ?? 0;
      const currentScore = scoreByKey.get(currentKey) ?? 0;
      expect(previousScore).toBeGreaterThanOrEqual(currentScore);
    }
  });

  test("8 — transport damage cost scales with trips and damage rate", () => {
    const withoutDamage = calculateSevenMudaEngineeringWasteCost({
      ...baseRev5Input,
      transportDamageRatePct: 0,
    });
    const withDamage = calculateSevenMudaEngineeringWasteCost(baseRev5Input);
    const expectedDamageCost =
      Number(baseRev5Input.averageLoadValue) *
      (Number(baseRev5Input.transportDamageRatePct) / 100) *
      Number(baseRev5Input.transportTrips);

    expect(withDamage.transportCost - withoutDamage.transportCost).toBeCloseTo(
      expectedDamageCost,
      2,
    );
    expect(expectedDamageCost).toBeCloseTo(800, 2);
  });

  test("9 — hourly to minute conversion drives waiting cost", () => {
    const laborMinuteCost = Number(baseRev5Input.hourlyLaborCost) / 60;
    const machineMinuteCost = Number(baseRev5Input.hourlyMachineCost) / 60;

    expect(laborMinuteCost).toBe(6);
    expect(machineMinuteCost).toBe(10);

    const result = calculateSevenMudaEngineeringWasteCost(baseRev5Input);
    const expectedWaitingLabor =
      Number(baseRev5Input.waitingMinutes) *
      Number(baseRev5Input.affectedOperators) *
      laborMinuteCost;
    const expectedWaitingMachine =
      Number(baseRev5Input.waitingMinutes) *
      Number(baseRev5Input.affectedMachines) *
      machineMinuteCost;
    const unitGrossMargin =
      Number(baseRev5Input.unitSellingPrice) * (Number(baseRev5Input.grossMarginPct) / 100);
    const expectedOpportunity =
      (Number(baseRev5Input.waitingMinutes) / 60) *
      Number(baseRev5Input.plannedUnitsPerHour) *
      unitGrossMargin;

    expect(expectedWaitingLabor).toBeCloseTo(1440, 2);
    expect(expectedWaitingMachine).toBeCloseTo(1200, 2);
    expect(expectedOpportunity).toBeCloseTo(6000, 2);
    expect(result.waitingCost).toBeCloseTo(
      expectedWaitingLabor + expectedWaitingMachine + expectedOpportunity,
      2,
    );
  });

  test("10 — excess write-down per unit adds 500 to overproductionCost", () => {
    const withoutWriteDown = calculateSevenMudaEngineeringWasteCost({
      ...baseRev5Input,
      excessWriteDownCostPerUnit: 0,
    });
    const withWriteDown = calculateSevenMudaEngineeringWasteCost(baseRev5Input);

    expect(withWriteDown.overproductionCost - withoutWriteDown.overproductionCost).toBeCloseTo(
      Number(baseRev5Input.excessUnits) * Number(baseRev5Input.excessWriteDownCostPerUnit),
      2,
    );
    expect(
      Number(baseRev5Input.excessUnits) * Number(baseRev5Input.excessWriteDownCostPerUnit),
    ).toBe(500);
  });

  test("11 — derivedThroughput opportunity cost is zero when mode is none", () => {
    const derived = calculateSevenMudaEngineeringWasteCost(baseRev5Input);
    const excluded = calculateSevenMudaEngineeringWasteCost({
      ...baseRev5Input,
      waitingOpportunityMode: "none",
      hourlyOpportunityCost: 0,
      plannedUnitsPerHour: 0,
    });

    expect(derived.waitingCost - excluded.waitingCost).toBeCloseTo(6000, 2);
  });

  test("12 — recoveryScenarios match 10/25/50 reductions", () => {
    const result = calculateSevenMudaEngineeringWasteCost(baseRev5Input);

    expect(result.recoveryScenarios).toHaveLength(3);
    expect(result.recoveryScenarios[0]?.reductionPct).toBe(10);
    expect(result.recoveryScenarios[0]?.periodSavings).toBeCloseTo(
      result.totalWasteCost * 0.1,
      2,
    );
    expect(result.recoveryScenarios[0]?.annualSavings).toBeCloseTo(
      result.annualizedWasteCost * 0.1,
      2,
    );
    expect(result.recoveryScenarios[1]?.reductionPct).toBe(25);
    expect(result.recoveryScenarios[2]?.reductionPct).toBe(50);
  });

  test("13 — decisionVerdict summaryLevel follows gross-margin ratio thresholds", () => {
    const result = calculateSevenMudaEngineeringWasteCost(baseRev5Input);

    expect(result.decisionVerdict.summaryLevel).toBe("low");
    expect(result.decisionVerdict.biggestCostCategory).toBe("waiting");
    expect(result.decisionVerdict.firstActionCategory).toBe(result.recommendedActionOrder[0]);
    expect(result.decisionVerdict.dataConfidence).toBe("high");
  });

  test("14 — wasteBreakdown contains exactly seven categories", () => {
    const result = calculateSevenMudaEngineeringWasteCost(baseRev5Input);
    const keys = result.wasteBreakdown.map((item) => item.key);

    expect(keys).toEqual([
      "overproduction",
      "waiting",
      "transport",
      "inventory",
      "motion",
      "overprocessing",
      "defects",
    ]);
  });

  test("15 — totalWasteCost equals sum of category costs", () => {
    const result = calculateSevenMudaEngineeringWasteCost(baseRev5Input);
    const summed =
      result.overproductionCost +
      result.waitingCost +
      result.transportCost +
      result.inventoryCost +
      result.motionCost +
      result.overprocessingCost +
      result.defectCost;

    expect(result.totalWasteCost).toBeCloseTo(summed, 2);
    expect(result.totalWasteCost).toBeCloseTo(EXPECTED_BASE.totalWasteCost, 2);
  });

  test("16 — premium schema engine totalWasteCost matches direct REV5 calculator", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const inputs: SchemaInputValues = {
      ...buildDefaultSchemaInputs(schema),
      ...(baseRev5Input as SchemaInputValues),
    };

    const engineResult = runPremiumSchemaEngine(schema, inputs);
    const directResult = calculateSevenMudaEngineeringWasteCost(baseRev5Input);

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
    expect(directResult.highestWasteCategory).toBe("waiting");
  });

  test("oracle — low waste scenario", () => {
    const result = calculateSevenMudaEngineeringWasteCost(buildZeroRev5Input());

    expect(result.totalWasteCost).toBe(0);
    expect(result.wasteCostPerUnit).toBe(0);
    expect(result.wasteToRevenueRatioPct).toBe(0);
    expect(Number.isFinite(result.totalWasteCost)).toBe(true);
    expect(Number.isFinite(result.wasteCostPerUnit)).toBe(true);
    expect(Number.isFinite(result.wasteToRevenueRatioPct)).toBe(true);
  });

  test("oracle — high waiting and machine cost scenario", () => {
    const result = calculateSevenMudaEngineeringWasteCost({
      ...buildZeroRev5Input(),
      waitingMinutes: 600,
      affectedOperators: 4,
      hourlyLaborCost: 480,
      affectedMachines: 2,
      hourlyMachineCost: 720,
      waitingOpportunityMode: "none",
    });

    const expectedWaitingCost = 600 * 4 * (480 / 60) + 600 * 2 * (720 / 60);
    expect(result.waitingCost).toBeCloseTo(expectedWaitingCost, 2);
    expect(result.totalWasteCost).toBeCloseTo(expectedWaitingCost, 2);
    expect(result.wasteCostPerUnit).toBeCloseTo(expectedWaitingCost / 10_000, 4);
    expect(result.wasteToRevenueRatioPct).toBeCloseTo((expectedWaitingCost / 1_000_000) * 100, 4);
  });

  test("oracle — defect and inventory obsolescence heavy scenario", () => {
    const result = calculateSevenMudaEngineeringWasteCost({
      ...buildZeroRev5Input(),
      inventoryObsolescenceValue: 12_000,
      averageExcessInventoryValue: 5_000,
      inventoryHoldingRatePct: 10,
      scrapUnits: 40,
      scrapDisposalCostPerUnit: 25,
      reworkMinutes: 120,
      reworkHourlyLaborCost: 360,
      reworkHourlyMachineCost: 480,
      customerReturnCost: 1_500,
    });

    const expectedInventoryCost =
      5_000 * (10 / 100) * (30 / 365) + 12_000 + 5_000 * (0 / 100);
    const expectedDefectCost =
      40 * 50 + 40 * 25 + 120 * (360 / 60) + 120 * (480 / 60) + 1_500;
    const expectedTotal = expectedInventoryCost + expectedDefectCost;

    expect(result.inventoryCost).toBeCloseTo(expectedInventoryCost, 2);
    expect(result.defectCost).toBeCloseTo(expectedDefectCost, 2);
    expect(result.totalWasteCost).toBeCloseTo(expectedTotal, 2);
    expect(result.wasteCostPerUnit).toBeCloseTo(expectedTotal / 10_000, 4);
    expect(result.wasteToRevenueRatioPct).toBeCloseTo((expectedTotal / 1_000_000) * 100, 4);
  });

  test("productionUnitsInPeriod must be greater than zero", () => {
    const validation = validateSevenMudaEngineeringInputs({
      ...baseRev5Input,
      productionUnitsInPeriod: 0,
    });
    expect(validation.ok).toBe(false);
    expect(validation.errors.join(" ")).toMatch(/productionUnitsInPeriod must be greater than zero/i);
  });

  test("extended oracle comparison passes for wired premium schema outputs", () => {
    const summary = runPremiumSchemaExtendedOracleComparisonAudit(SLUG);
    expect(summary.status).toBe("PASS");
    expect(summary.failCount).toBe(0);
  });
});
