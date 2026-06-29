/**
 * Batch free/revenue oracle property tests (Phase 5F-A).
 */

import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import {
  calculateCleaningCostOracle,
  calculateFoodCostOracle,
  calculateProductMarginOracle,
  calculateProjectCostOracle,
  calculateWeldingCostOracle,
} from "@/lib/formula-governance/oracle/batch-free-oracles";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

describe("project cost oracle properties", () => {
  test("material cost increase does not decrease total project cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1_000, max: 100_000, noNaN: true }),
        fc.double({ min: 10, max: 500, noNaN: true }),
        fc.double({ min: 20, max: 120, noNaN: true }),
        fc.double({ min: 0, max: 20_000, noNaN: true }),
        fc.double({ min: 0, max: 30, noNaN: true }),
        fc.double({ min: 0, max: 25, noNaN: true }),
        (materialCost, laborHours, laborHourlyRate, equipmentCost, overheadRate, contingencyRate) => {
          const base = calculateProjectCostOracle({
            materialCost,
            laborHours,
            laborHourlyRate,
            equipmentCost,
            overheadRate,
            contingencyRate,
          });
          const bumped = calculateProjectCostOracle({
            materialCost: materialCost * 1.1,
            laborHours,
            laborHourlyRate,
            equipmentCost,
            overheadRate,
            contingencyRate,
          });
          expect(bumped.estimatedProjectCost).toBeGreaterThanOrEqual(base.estimatedProjectCost);
        },
      ),
    );
  });

  test("labor and overhead increases do not decrease total project cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5_000, max: 80_000, noNaN: true }),
        fc.double({ min: 20, max: 400, noNaN: true }),
        fc.double({ min: 25, max: 90, noNaN: true }),
        fc.double({ min: 500, max: 15_000, noNaN: true }),
        fc.double({ min: 0, max: 20, noNaN: true }),
        fc.double({ min: 0, max: 15, noNaN: true }),
        (materialCost, laborHours, laborHourlyRate, equipmentCost, overheadRate, contingencyRate) => {
          fc.pre(overheadRate < 90 && contingencyRate < 90);
          const base = calculateProjectCostOracle({
            materialCost,
            laborHours,
            laborHourlyRate,
            equipmentCost,
            overheadRate,
            contingencyRate,
          });
          const bumpedLabor = calculateProjectCostOracle({
            materialCost,
            laborHours,
            laborHourlyRate: laborHourlyRate * 1.05,
            equipmentCost,
            overheadRate,
            contingencyRate,
          });
          const bumpedOverhead = calculateProjectCostOracle({
            materialCost,
            laborHours,
            laborHourlyRate,
            equipmentCost,
            overheadRate: overheadRate + 2,
            contingencyRate,
          });
          const bumpedContingency = calculateProjectCostOracle({
            materialCost,
            laborHours,
            laborHourlyRate,
            equipmentCost,
            overheadRate,
            contingencyRate: contingencyRate + 2,
          });
          expect(bumpedLabor.estimatedProjectCost).toBeGreaterThanOrEqual(base.estimatedProjectCost);
          expect(bumpedOverhead.estimatedProjectCost).toBeGreaterThanOrEqual(base.estimatedProjectCost);
          expect(bumpedContingency.estimatedProjectCost).toBeGreaterThanOrEqual(base.estimatedProjectCost);
        },
      ),
    );
  });

  test("negative material cost is invalid", () => {
    expect(() =>
      calculateProjectCostOracle({
        materialCost: -100,
        laborHours: 10,
        laborHourlyRate: 50,
        equipmentCost: 0,
        overheadRate: 10,
        contingencyRate: 5,
      }),
    ).toThrow(OracleValidationError);
  });
});

describe("cleaning cost oracle properties", () => {
  test("workload and supply inputs increase do not decrease total cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 500, max: 50_000, noNaN: true }),
        fc.double({ min: 1, max: 12, noNaN: true }),
        fc.double({ min: 1, max: 4, noNaN: true }),
        fc.double({ min: 15, max: 45, noNaN: true }),
        fc.double({ min: 0, max: 200, noNaN: true }),
        fc.double({ min: 0, max: 150, noNaN: true }),
        (area, estimatedHours, crewSize, laborHourlyCost, suppliesCost, travelCost) => {
          const base = calculateCleaningCostOracle({
            area,
            estimatedHours,
            crewSize,
            laborHourlyCost,
            suppliesCost,
            travelCost,
          });
          const bumpedHours = calculateCleaningCostOracle({
            area,
            estimatedHours: estimatedHours * 1.1,
            crewSize,
            laborHourlyCost,
            suppliesCost,
            travelCost,
          });
          const bumpedRate = calculateCleaningCostOracle({
            area,
            estimatedHours,
            crewSize,
            laborHourlyCost: laborHourlyCost + 2,
            suppliesCost,
            travelCost,
          });
          const bumpedSupplies = calculateCleaningCostOracle({
            area,
            estimatedHours,
            crewSize,
            laborHourlyCost,
            suppliesCost: suppliesCost + 10,
            travelCost,
          });
          expect(bumpedHours.totalCost).toBeGreaterThanOrEqual(base.totalCost);
          expect(bumpedRate.totalCost).toBeGreaterThanOrEqual(base.totalCost);
          expect(bumpedSupplies.totalCost).toBeGreaterThanOrEqual(base.totalCost);
        },
      ),
    );
  });

  test("zero area is invalid", () => {
    expect(() =>
      calculateCleaningCostOracle({
        area: 0,
        estimatedHours: 4,
        crewSize: 2,
        laborHourlyCost: 22,
        suppliesCost: 50,
        travelCost: 20,
      }),
    ).toThrow(OracleValidationError);
  });
});

describe("food cost oracle properties", () => {
  test("ingredient cost increase does not decrease food cost percent", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 20, noNaN: true }),
        fc.double({ min: 12, max: 60, noNaN: true }),
        (ingredientCost, menuPrice) => {
          fc.pre(ingredientCost < menuPrice);
          const base = calculateFoodCostOracle({ ingredientCost, menuPrice });
          const bumped = calculateFoodCostOracle({ ingredientCost: ingredientCost * 1.1, menuPrice });
          expect(bumped.foodCostPercent).toBeGreaterThanOrEqual(base.foodCostPercent);
        },
      ),
    );
  });

  test("fixed menu price: higher ingredient cost lowers gross margin headroom", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 2, max: 15, noNaN: true }),
        fc.double({ min: 18, max: 50, noNaN: true }),
        (ingredientCost, menuPrice) => {
          fc.pre(ingredientCost * 1.2 < menuPrice);
          const base = calculateFoodCostOracle({ ingredientCost, menuPrice });
          const bumped = calculateFoodCostOracle({ ingredientCost: ingredientCost * 1.2, menuPrice });
          expect(bumped.grossMarginPercent).toBeLessThanOrEqual(base.grossMarginPercent);
        },
      ),
    );
  });

  test("zero menu price is invalid", () => {
    expect(() => calculateFoodCostOracle({ ingredientCost: 5, menuPrice: 0 })).toThrow(
      OracleValidationError,
    );
  });
});

describe("product margin oracle properties", () => {
  test("product cost increase does not improve margin", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 30, max: 200, noNaN: true }),
        fc.double({ min: 5, max: 80, noNaN: true }),
        fc.double({ min: 0, max: 20, noNaN: true }),
        fc.double({ min: 0, max: 20, noNaN: true }),
        fc.double({ min: 0, max: 5, noNaN: true }),
        fc.double({ min: 0, max: 20, noNaN: true }),
        (sellingPrice, productCost, shippingCost, platformFeeRate, paymentFeeRate, returnRate) => {
          fc.pre(productCost * 1.1 < sellingPrice);
          const base = calculateProductMarginOracle({
            sellingPrice,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate,
          });
          const bumped = calculateProductMarginOracle({
            sellingPrice,
            productCost: productCost * 1.1,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate,
          });
          expect(bumped.margin).toBeLessThanOrEqual(base.margin);
        },
      ),
    );
  });

  test("selling price increase does not worsen margin when costs fixed", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 40, max: 150, noNaN: true }),
        fc.double({ min: 8, max: 60, noNaN: true }),
        fc.double({ min: 0, max: 15, noNaN: true }),
        fc.double({ min: 0, max: 15, noNaN: true }),
        fc.double({ min: 0, max: 4, noNaN: true }),
        fc.double({ min: 0, max: 15, noNaN: true }),
        (sellingPrice, productCost, shippingCost, platformFeeRate, paymentFeeRate, returnRate) => {
          const base = calculateProductMarginOracle({
            sellingPrice,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate,
          });
          const bumped = calculateProductMarginOracle({
            sellingPrice: sellingPrice * 1.1,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate,
          });
          expect(bumped.margin).toBeGreaterThanOrEqual(base.margin);
        },
      ),
    );
  });

  test("return rate increase does not improve net margin", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50, max: 180, noNaN: true }),
        fc.double({ min: 10, max: 70, noNaN: true }),
        fc.double({ min: 0, max: 12, noNaN: true }),
        fc.double({ min: 0, max: 12, noNaN: true }),
        fc.double({ min: 0, max: 4, noNaN: true }),
        fc.double({ min: 0, max: 15, noNaN: true }),
        (sellingPrice, productCost, shippingCost, platformFeeRate, paymentFeeRate, returnRate) => {
          fc.pre(returnRate < 90);
          const base = calculateProductMarginOracle({
            sellingPrice,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate,
          });
          const bumped = calculateProductMarginOracle({
            sellingPrice,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate: returnRate + 3,
          });
          expect(bumped.margin).toBeLessThanOrEqual(base.margin);
        },
      ),
    );
  });
});

describe("welding cost oracle properties", () => {
  test("labor length, rate and consumables increases do not decrease cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50, max: 5_000, noNaN: true }),
        fc.double({ min: 1, max: 40, noNaN: true }),
        fc.double({ min: 40, max: 120, noNaN: true }),
        fc.double({ min: 0, max: 500, noNaN: true }),
        (materialCost, laborHours, laborRate, consumablesCost) => {
          const base = calculateWeldingCostOracle({
            materialCost,
            laborHours,
            laborRate,
            consumablesCost,
          });
          const bumpedHours = calculateWeldingCostOracle({
            materialCost,
            laborHours: laborHours * 1.1,
            laborRate,
            consumablesCost,
          });
          const bumpedRate = calculateWeldingCostOracle({
            materialCost,
            laborHours,
            laborRate: laborRate * 1.05,
            consumablesCost,
          });
          const bumpedConsumables = calculateWeldingCostOracle({
            materialCost,
            laborHours,
            laborRate,
            consumablesCost: consumablesCost + 15,
          });
          expect(bumpedHours.estimatedCost).toBeGreaterThanOrEqual(base.estimatedCost);
          expect(bumpedRate.estimatedCost).toBeGreaterThanOrEqual(base.estimatedCost);
          expect(bumpedConsumables.estimatedCost).toBeGreaterThanOrEqual(base.estimatedCost);
        },
      ),
    );
  });

  test("zero labor hours is invalid", () => {
    expect(() =>
      calculateWeldingCostOracle({
        materialCost: 400,
        laborHours: 0,
        laborRate: 65,
        consumablesCost: 80,
      }),
    ).toThrow(OracleValidationError);
  });
});
