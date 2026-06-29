/**
 * Batch free/revenue batch-2 oracle property tests (Phase 5G-B).
 */

import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import {
  calculateCabinetCostOracle,
  calculateElectricalLaborOracle,
  calculateHvacTonnageRuleOracle,
  calculateLaserCuttingTimeOracle,
  calculateLawnCareCostOracle,
  calculatePlumbingJobMarginOracle,
  calculatePrintJobCostOracle,
  calculateRepairTimeVsPriceOracle,
  calculateRoofingSquareCostOracle,
  calculateSampleSizeOracle,
} from "@/lib/formula-governance/oracle/batch-free-batch2-oracles";

describe("sample size oracle properties", () => {
  test("higher confidence z does not decrease required sample", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 50_000 }),
        fc.double({ min: 1.645, max: 2.576, noNaN: true }),
        fc.double({ min: 2, max: 10, noNaN: true }),
        fc.double({ min: 10, max: 90, noNaN: true }),
        (population, zLow, margin, proportion) => {
          const low = calculateSampleSizeOracle({
            population,
            confidenceZ: zLow,
            marginErrorPercent: margin,
            proportionPercent: proportion,
          });
          const high = calculateSampleSizeOracle({
            population,
            confidenceZ: zLow + 0.2,
            marginErrorPercent: margin,
            proportionPercent: proportion,
          });
          expect(high.requiredSample).toBeGreaterThanOrEqual(low.requiredSample);
        },
      ),
    );
  });
});

describe("hvac tonnage oracle properties", () => {
  test("larger area does not decrease recommended tonnage", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 8000 }),
        fc.double({ min: 2, max: 8, noNaN: true }),
        fc.double({ min: 4, max: 48, noNaN: true }),
        (area, tonnage, laborHours) => {
          const base = calculateHvacTonnageRuleOracle({
            squareFootage: area,
            tonnage,
            laborHours,
          });
          const bumped = calculateHvacTonnageRuleOracle({
            squareFootage: area + 500,
            tonnage,
            laborHours,
          });
          expect(bumped.recommendedTons).toBeGreaterThanOrEqual(base.recommendedTons);
        },
      ),
    );
  });
});

describe("electrical labor oracle properties", () => {
  test("labor rate and hours increases do not decrease labor cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 500, max: 10_000, noNaN: true }),
        fc.double({ min: 2, max: 24, noNaN: true }),
        fc.double({ min: 50, max: 120, noNaN: true }),
        (materialCost, laborHours, laborRate) => {
          const base = calculateElectricalLaborOracle({ materialCost, laborHours, laborRate });
          const bumpedRate = calculateElectricalLaborOracle({
            materialCost,
            laborHours,
            laborRate: laborRate + 5,
          });
          const bumpedHours = calculateElectricalLaborOracle({
            materialCost,
            laborHours: laborHours + 1,
            laborRate,
          });
          expect(bumpedRate.laborCost).toBeGreaterThanOrEqual(base.laborCost);
          expect(bumpedHours.laborCost).toBeGreaterThanOrEqual(base.laborCost);
        },
      ),
    );
  });
});

describe("lawn care oracle properties", () => {
  test("visit frequency and crew hours increases do not decrease monthly load", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 6, noNaN: true }),
        fc.integer({ min: 1, max: 8 }),
        fc.double({ min: 20, max: 45, noNaN: true }),
        (crewHours, visits, laborRate) => {
          const base = calculateLawnCareCostOracle({
            crewHoursPerVisit: crewHours,
            visitsPerMonth: visits,
            laborRate,
          });
          const bumpedVisits = calculateLawnCareCostOracle({
            crewHoursPerVisit: crewHours,
            visitsPerMonth: visits + 1,
            laborRate,
          });
          expect(bumpedVisits.monthlyLoad).toBeGreaterThanOrEqual(base.monthlyLoad);
        },
      ),
    );
  });
});

describe("repair time oracle properties", () => {
  test("labor hours and parts cost increases do not decrease burdened cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 200, max: 2000, noNaN: true }),
        fc.double({ min: 0.5, max: 10, noNaN: true }),
        fc.double({ min: 50, max: 800, noNaN: true }),
        (quotedPrice, repairHours, partsCost) => {
          const base = calculateRepairTimeVsPriceOracle({ quotedPrice, repairHours, partsCost });
          const bumpedHours = calculateRepairTimeVsPriceOracle({
            quotedPrice,
            repairHours: repairHours + 0.5,
            partsCost,
          });
          const bumpedParts = calculateRepairTimeVsPriceOracle({
            quotedPrice,
            repairHours,
            partsCost: partsCost + 25,
          });
          expect(bumpedHours.burdenedCost).toBeGreaterThanOrEqual(base.burdenedCost);
          expect(bumpedParts.burdenedCost).toBeGreaterThanOrEqual(base.burdenedCost);
        },
      ),
    );
  });
});

describe("print job oracle properties", () => {
  test("design hours and labor rate increases do not decrease design cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100, max: 2000, noNaN: true }),
        fc.double({ min: 0.5, max: 8, noNaN: true }),
        fc.double({ min: 45, max: 95, noNaN: true }),
        (materialCost, designHours, laborRate) => {
          const base = calculatePrintJobCostOracle({ materialCost, designHours, laborRate });
          const bumped = calculatePrintJobCostOracle({
            materialCost,
            designHours: designHours + 0.5,
            laborRate,
          });
          expect(bumped.designCost).toBeGreaterThanOrEqual(base.designCost);
        },
      ),
    );
  });
});

describe("plumbing margin oracle properties", () => {
  test("higher parts cost and callback risk do not decrease minimum safe price", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100, max: 1500, noNaN: true }),
        fc.double({ min: 2, max: 12, noNaN: true }),
        fc.double({ min: 60, max: 110, noNaN: true }),
        fc.integer({ min: 1, max: 6 }),
        (partsCost, laborHours, laborRate, fixtureCount) => {
          const base = calculatePlumbingJobMarginOracle({
            partsCost,
            laborHours,
            laborRate,
            fixtureCount,
            materialRunCost: 50,
            callbackRiskPercent: 8,
            targetMargin: 25,
          });
          const bumpedParts = calculatePlumbingJobMarginOracle({
            partsCost: partsCost + 100,
            laborHours,
            laborRate,
            fixtureCount,
            materialRunCost: 50,
            callbackRiskPercent: 8,
            targetMargin: 25,
          });
          expect(bumpedParts.minimumSafePrice).toBeGreaterThanOrEqual(base.minimumSafePrice);
        },
      ),
    );
  });
});

describe("cabinet cost oracle properties", () => {
  test("labor and install hours increases do not decrease total hours", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 500, max: 5000, noNaN: true }),
        fc.double({ min: 4, max: 24, noNaN: true }),
        fc.double({ min: 2, max: 16, noNaN: true }),
        (sheetMaterialCost, laborHours, installHours) => {
          const base = calculateCabinetCostOracle({ sheetMaterialCost, laborHours, installHours });
          const bumped = calculateCabinetCostOracle({
            sheetMaterialCost,
            laborHours: laborHours + 1,
            installHours,
          });
          expect(bumped.totalHours).toBeGreaterThanOrEqual(base.totalHours);
        },
      ),
    );
  });
});

describe("roofing square oracle properties", () => {
  test("material and labor increases do not decrease cost estimates", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1500, max: 12_000, noNaN: true }),
        fc.double({ min: 8, max: 32, noNaN: true }),
        fc.double({ min: 30, max: 60, noNaN: true }),
        (materialCost, laborHours, laborRate) => {
          const base = calculateRoofingSquareCostOracle({ materialCost, laborHours, laborRate });
          const bumpedMaterial = calculateRoofingSquareCostOracle({
            materialCost: materialCost + 500,
            laborHours,
            laborRate,
          });
          expect(bumpedMaterial.nrcaEstimate).toBeGreaterThanOrEqual(base.nrcaEstimate);
        },
      ),
    );
  });
});

describe("laser cutting oracle properties", () => {
  test("cut length, pierce count and setup increases do not decrease total time", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 60, noNaN: true }),
        fc.double({ min: 2, max: 30, noNaN: true }),
        fc.double({ min: 1, max: 5, noNaN: true }),
        fc.integer({ min: 0, max: 20 }),
        (setupMinutes, cutLengthM, cutSpeedMMin, pierceCount) => {
          const base = calculateLaserCuttingTimeOracle({
            setupMinutes,
            cutLengthM,
            cutSpeedMMin,
            pierceCount,
            pierceSeconds: 2,
          });
          const bumpedLength = calculateLaserCuttingTimeOracle({
            setupMinutes,
            cutLengthM: cutLengthM + 1,
            cutSpeedMMin,
            pierceCount,
            pierceSeconds: 2,
          });
          expect(bumpedLength.totalMinutes).toBeGreaterThanOrEqual(base.totalMinutes);
        },
      ),
    );
  });
});
