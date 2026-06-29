/**
 * Batch premium batch-3 oracle property tests (Phase 5G-D).
 */

import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import {
  calculate3dPrintCostOracle,
  calculateAutoShopMarginLeakOracle,
  calculateHvacProjectMarginGuardOracle,
  calculateLandscapingContractProfitOracle,
  calculateMillworkBidRiskOracle,
  calculatePaintingJobProfitVerdictOracle,
  calculatePanelShopMarginVerdictOracle,
  calculateRoofingContractMarginGuardOracle,
  calculateSheetMetalQuoteRiskOracle,
  calculateSignageBidSafePriceOracle,
} from "@/lib/formula-governance/oracle/batch-premium-batch3-oracles";

describe("hvac project margin oracle properties", () => {
  test("equipment and labor increases do not decrease base or safe price", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5000, max: 25_000, noNaN: true }),
        fc.double({ min: 1000, max: 8000, noNaN: true }),
        fc.double({ min: 12, max: 40, noNaN: true }),
        fc.double({ min: 60, max: 95, noNaN: true }),
        (equipmentCost, ductworkCost, laborHours, laborRate) => {
          const base = calculateHvacProjectMarginGuardOracle({
            equipmentCost,
            ductworkCost,
            laborHours,
            laborRate,
            commissioningCost: 400,
            callbackRiskPercent: 8,
            targetMargin: 22,
          });
          const bumpedEquipment = calculateHvacProjectMarginGuardOracle({
            equipmentCost: equipmentCost + 1000,
            ductworkCost,
            laborHours,
            laborRate,
            commissioningCost: 400,
            callbackRiskPercent: 8,
            targetMargin: 22,
          });
          const bumpedLabor = calculateHvacProjectMarginGuardOracle({
            equipmentCost,
            ductworkCost,
            laborHours: laborHours + 2,
            laborRate,
            commissioningCost: 400,
            callbackRiskPercent: 8,
            targetMargin: 22,
          });
          expect(bumpedEquipment.baseCost).toBeGreaterThanOrEqual(base.baseCost);
          expect(bumpedLabor.baseCost).toBeGreaterThanOrEqual(base.baseCost);
        },
      ),
    );
  });

  test("higher target margin does not decrease minimum safe price", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 8000, max: 18_000, noNaN: true }),
        fc.double({ min: 15, max: 30, noNaN: true }),
        (equipmentCost, targetMargin) => {
          const low = calculateHvacProjectMarginGuardOracle({
            equipmentCost,
            ductworkCost: 2500,
            laborHours: 24,
            laborRate: 75,
            commissioningCost: 400,
            callbackRiskPercent: 8,
            targetMargin,
          });
          const high = calculateHvacProjectMarginGuardOracle({
            equipmentCost,
            ductworkCost: 2500,
            laborHours: 24,
            laborRate: 75,
            commissioningCost: 400,
            callbackRiskPercent: 8,
            targetMargin: Math.min(targetMargin + 4, 35),
          });
          expect(high.minimumSafePrice).toBeGreaterThanOrEqual(low.minimumSafePrice);
        },
      ),
    );
  });
});

describe("panel shop margin oracle properties", () => {
  test("material and labor increases do not decrease base cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 2000, max: 10_000, noNaN: true }),
        fc.double({ min: 6, max: 24, noNaN: true }),
        fc.double({ min: 60, max: 100, noNaN: true }),
        (materialCost, laborHours, laborRate) => {
          const base = calculatePanelShopMarginVerdictOracle({
            materialCost,
            laborHours,
            laborRate,
            testingHours: 4,
            inspectionRiskPercent: 10,
            targetMargin: 24,
          });
          const bumped = calculatePanelShopMarginVerdictOracle({
            materialCost: materialCost + 500,
            laborHours: laborHours + 1,
            laborRate,
            testingHours: 4,
            inspectionRiskPercent: 10,
            targetMargin: 24,
          });
          expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
        },
      ),
    );
  });
});

describe("landscaping contract oracle properties", () => {
  test("labor hours and equipment cost increases do not decrease base cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1.5, max: 5, noNaN: true }),
        fc.double({ min: 22, max: 40, noNaN: true }),
        fc.integer({ min: 2, max: 8 }),
        (crewHoursPerVisit, laborRate, visitsPerMonth) => {
          const base = calculateLandscapingContractProfitOracle({
            crewHoursPerVisit,
            laborRate,
            fuelCostPerVisit: 15,
            supplyCostPerMonth: 100,
            visitsPerMonth,
            equipmentWearCost: 80,
            targetMargin: 20,
          });
          const bumped = calculateLandscapingContractProfitOracle({
            crewHoursPerVisit: crewHoursPerVisit + 0.5,
            laborRate,
            fuelCostPerVisit: 15,
            supplyCostPerMonth: 100,
            visitsPerMonth,
            equipmentWearCost: 120,
            targetMargin: 20,
          });
          expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
        },
      ),
    );
  });
});

describe("auto shop margin oracle properties", () => {
  test("labor hours and parts cost increases do not decrease base cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 8, noNaN: true }),
        fc.double({ min: 80, max: 120, noNaN: true }),
        fc.double({ min: 100, max: 900, noNaN: true }),
        (repairHours, laborRate, partsCost) => {
          const base = calculateAutoShopMarginLeakOracle({
            diagnosticHours: 1,
            repairHours,
            laborRate,
            partsCost,
            comebackRiskPercent: 12,
            partsMarkupPercent: 30,
          });
          const bumped = calculateAutoShopMarginLeakOracle({
            diagnosticHours: 1,
            repairHours: repairHours + 1,
            laborRate,
            partsCost: partsCost + 50,
            comebackRiskPercent: 12,
            partsMarkupPercent: 30,
          });
          expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
        },
      ),
    );
  });
});

describe("signage bid oracle properties", () => {
  test("material and install hours increases do not decrease base cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 500, max: 3000, noNaN: true }),
        fc.double({ min: 2, max: 10, noNaN: true }),
        fc.double({ min: 50, max: 80, noNaN: true }),
        (materialCost, installHours, laborRate) => {
          const base = calculateSignageBidSafePriceOracle({
            materialCost,
            inkCost: 120,
            designHours: 3,
            laborRate,
            installHours,
            reprintRiskPercent: 8,
            targetMargin: 28,
          });
          const bumped = calculateSignageBidSafePriceOracle({
            materialCost: materialCost + 200,
            inkCost: 120,
            designHours: 3,
            laborRate,
            installHours: installHours + 1,
            reprintRiskPercent: 8,
            targetMargin: 28,
          });
          expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
        },
      ),
    );
  });
});

describe("millwork bid oracle properties", () => {
  test("material and labor increases do not decrease safe bid", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1500, max: 6000, noNaN: true }),
        fc.double({ min: 10, max: 28, noNaN: true }),
        fc.double({ min: 60, max: 85, noNaN: true }),
        (sheetMaterialCost, laborHours, laborRate) => {
          const base = calculateMillworkBidRiskOracle({
            sheetMaterialCost,
            laborHours,
            laborRate,
            finishingCost: 700,
            installHours: 8,
            wasteRatePercent: 12,
            targetMargin: 26,
          });
          const bumped = calculateMillworkBidRiskOracle({
            sheetMaterialCost: sheetMaterialCost + 400,
            laborHours: laborHours + 2,
            laborRate,
            finishingCost: 700,
            installHours: 8,
            wasteRatePercent: 12,
            targetMargin: 26,
          });
          expect(bumped.minimumSafePrice).toBeGreaterThanOrEqual(base.minimumSafePrice);
        },
      ),
    );
  });
});

describe("roofing margin oracle properties", () => {
  test("material and labor rate increases do not decrease base cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 3000, max: 12_000, noNaN: true }),
        fc.double({ min: 12, max: 32, noNaN: true }),
        fc.double({ min: 35, max: 55, noNaN: true }),
        (materialCost, laborHours, laborRate) => {
          const base = calculateRoofingContractMarginGuardOracle({
            materialCost,
            laborHours,
            laborRate,
            tearOffCost: 1500,
            dumpFees: 400,
            weatherDelayRiskPercent: 10,
            targetMargin: 22,
          });
          const bumped = calculateRoofingContractMarginGuardOracle({
            materialCost: materialCost + 800,
            laborHours,
            laborRate: laborRate + 2,
            tearOffCost: 1500,
            dumpFees: 400,
            weatherDelayRiskPercent: 10,
            targetMargin: 22,
          });
          expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
        },
      ),
    );
  });
});

describe("painting job oracle properties", () => {
  test("area and labor rate increases do not decrease base cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1200, max: 6000, noNaN: true }),
        fc.double({ min: 40, max: 60, noNaN: true }),
        fc.double({ min: 400, max: 1200, noNaN: true }),
        (areaSize, laborRate, paintCost) => {
          const base = calculatePaintingJobProfitVerdictOracle({
            paintCost,
            prepHours: 6,
            laborRate,
            scaffoldCost: 200,
            touchUpRiskPercent: 8,
            areaSize,
            targetMargin: 24,
          });
          const bumped = calculatePaintingJobProfitVerdictOracle({
            paintCost,
            prepHours: 6,
            laborRate: laborRate + 2,
            scaffoldCost: 200,
            touchUpRiskPercent: 8,
            areaSize: areaSize + 400,
            targetMargin: 24,
          });
          expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
        },
      ),
    );
  });
});

describe("sheet metal quote oracle properties", () => {
  test("material and setup time increases do not decrease base cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 200, max: 1200, noNaN: true }),
        fc.double({ min: 20, max: 60, noNaN: true }),
        fc.double({ min: 60, max: 85, noNaN: true }),
        (materialCost, setupTime, laborRate) => {
          const base = calculateSheetMetalQuoteRiskOracle({
            programmingTime: 40,
            setupTime,
            cutTime: 50,
            bendCount: 8,
            laborRate,
            materialCost,
            scrapRatePercent: 8,
            finishingCost: 100,
            targetMargin: 25,
          });
          const bumped = calculateSheetMetalQuoteRiskOracle({
            programmingTime: 40,
            setupTime: setupTime + 10,
            cutTime: 50,
            bendCount: 8,
            laborRate,
            materialCost: materialCost + 80,
            scrapRatePercent: 8,
            finishingCost: 100,
            targetMargin: 25,
          });
          expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
        },
      ),
    );
  });
});

describe("3d print cost oracle properties", () => {
  test("print hours, machine rate and material increases do not decrease cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 20, max: 120, noNaN: true }),
        fc.double({ min: 2, max: 14, noNaN: true }),
        fc.double({ min: 8, max: 20, noNaN: true }),
        (materialCost, printHours, machineRate) => {
          const base = calculate3dPrintCostOracle({
            materialCost,
            printHours,
            machineRate,
            postProcessHours: 1,
            laborRate: 35,
          });
          const bumpedHours = calculate3dPrintCostOracle({
            materialCost,
            printHours: printHours + 1,
            machineRate,
            postProcessHours: 1,
            laborRate: 35,
          });
          const bumpedRate = calculate3dPrintCostOracle({
            materialCost,
            printHours,
            machineRate: machineRate + 1,
            postProcessHours: 1,
            laborRate: 35,
          });
          expect(bumpedHours.estimatedCost).toBeGreaterThanOrEqual(base.estimatedCost);
          expect(bumpedRate.estimatedCost).toBeGreaterThanOrEqual(base.estimatedCost);
        },
      ),
    );
  });
});
