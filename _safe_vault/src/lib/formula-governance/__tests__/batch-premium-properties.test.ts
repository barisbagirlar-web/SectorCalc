/**
 * Batch premium/revenue oracle property tests (Phase 5F-B).
 */

import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import {
  calculateChangeOrderImpactOracle,
  calculateMenuProfitLeakDetectorOracle,
  calculateOfficeCleaningBidOptimizerOracle,
  calculateReturnProfitErosionOracle,
  calculateWeldingBidRiskOracle,
} from "@/lib/formula-governance/oracle/batch-premium-oracles";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

describe("change order impact oracle properties", () => {
  test("added labor hours do not decrease total change order impact", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 10_000, max: 200_000, noNaN: true }),
        fc.double({ min: 5_000, max: 150_000, noNaN: true }),
        fc.double({ min: 4, max: 80, noNaN: true }),
        fc.double({ min: 25, max: 90, noNaN: true }),
        fc.double({ min: 0, max: 10_000, noNaN: true }),
        fc.double({ min: 0, max: 3_000, noNaN: true }),
        fc.double({ min: 0, max: 14, noNaN: true }),
        fc.double({ min: 50, max: 600, noNaN: true }),
        fc.double({ min: 10, max: 35, noNaN: true }),
        fc.double({ min: 500, max: 20_000, noNaN: true }),
        (
          originalContractValue,
          originalEstimatedCost,
          extraLaborHours,
          laborHourlyRate,
          extraMaterialCost,
          extraEquipmentCost,
          delayDays,
          dailyOverheadCost,
          targetChangeMargin,
          customerOfferedPrice,
        ) => {
          const base = calculateChangeOrderImpactOracle({
            originalContractValue,
            originalEstimatedCost,
            extraLaborHours,
            laborHourlyRate,
            extraMaterialCost,
            extraEquipmentCost,
            delayDays,
            dailyOverheadCost,
            targetChangeMargin,
            customerOfferedPrice,
          });
          const bumped = calculateChangeOrderImpactOracle({
            originalContractValue,
            originalEstimatedCost,
            extraLaborHours: extraLaborHours * 1.1,
            laborHourlyRate,
            extraMaterialCost,
            extraEquipmentCost,
            delayDays,
            dailyOverheadCost,
            targetChangeMargin,
            customerOfferedPrice,
          });
          expect(bumped.extraDirectCost).toBeGreaterThanOrEqual(base.extraDirectCost);
          expect(bumped.minimumSafeChangePrice).toBeGreaterThanOrEqual(base.minimumSafeChangePrice);
        },
      ),
    );
  });

  test("added material cost and delay days do not decrease total impact", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 8_000, max: 120_000, noNaN: true }),
        fc.double({ min: 4_000, max: 90_000, noNaN: true }),
        fc.double({ min: 8, max: 60, noNaN: true }),
        fc.double({ min: 30, max: 75, noNaN: true }),
        fc.double({ min: 200, max: 8_000, noNaN: true }),
        fc.double({ min: 0, max: 2_000, noNaN: true }),
        fc.double({ min: 0, max: 10, noNaN: true }),
        fc.double({ min: 80, max: 500, noNaN: true }),
        fc.double({ min: 12, max: 30, noNaN: true }),
        fc.double({ min: 1_000, max: 15_000, noNaN: true }),
        (
          originalContractValue,
          originalEstimatedCost,
          extraLaborHours,
          laborHourlyRate,
          extraMaterialCost,
          extraEquipmentCost,
          delayDays,
          dailyOverheadCost,
          targetChangeMargin,
          customerOfferedPrice,
        ) => {
          const base = calculateChangeOrderImpactOracle({
            originalContractValue,
            originalEstimatedCost,
            extraLaborHours,
            laborHourlyRate,
            extraMaterialCost,
            extraEquipmentCost,
            delayDays,
            dailyOverheadCost,
            targetChangeMargin,
            customerOfferedPrice,
          });
          const bumpedMaterial = calculateChangeOrderImpactOracle({
            originalContractValue,
            originalEstimatedCost,
            extraLaborHours,
            laborHourlyRate,
            extraMaterialCost: extraMaterialCost + 250,
            extraEquipmentCost,
            delayDays,
            dailyOverheadCost,
            targetChangeMargin,
            customerOfferedPrice,
          });
          const bumpedDelay = calculateChangeOrderImpactOracle({
            originalContractValue,
            originalEstimatedCost,
            extraLaborHours,
            laborHourlyRate,
            extraMaterialCost,
            extraEquipmentCost,
            delayDays: delayDays + 2,
            dailyOverheadCost,
            targetChangeMargin,
            customerOfferedPrice,
          });
          expect(bumpedMaterial.extraDirectCost).toBeGreaterThanOrEqual(base.extraDirectCost);
          expect(bumpedDelay.delayCost).toBeGreaterThanOrEqual(base.delayCost);
        },
      ),
    );
  });

  test("higher target margin does not decrease minimum safe change price", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 15_000, max: 80_000, noNaN: true }),
        fc.double({ min: 10_000, max: 60_000, noNaN: true }),
        fc.double({ min: 10, max: 50, noNaN: true }),
        fc.double({ min: 35, max: 70, noNaN: true }),
        fc.double({ min: 500, max: 5_000, noNaN: true }),
        fc.double({ min: 0, max: 1_500, noNaN: true }),
        fc.double({ min: 1, max: 8, noNaN: true }),
        fc.double({ min: 100, max: 400, noNaN: true }),
        fc.double({ min: 10, max: 25, noNaN: true }),
        fc.double({ min: 2_000, max: 12_000, noNaN: true }),
        (
          originalContractValue,
          originalEstimatedCost,
          extraLaborHours,
          laborHourlyRate,
          extraMaterialCost,
          extraEquipmentCost,
          delayDays,
          dailyOverheadCost,
          targetChangeMargin,
          customerOfferedPrice,
        ) => {
          fc.pre(targetChangeMargin < 70);
          const base = calculateChangeOrderImpactOracle({
            originalContractValue,
            originalEstimatedCost,
            extraLaborHours,
            laborHourlyRate,
            extraMaterialCost,
            extraEquipmentCost,
            delayDays,
            dailyOverheadCost,
            targetChangeMargin,
            customerOfferedPrice,
          });
          const bumped = calculateChangeOrderImpactOracle({
            originalContractValue,
            originalEstimatedCost,
            extraLaborHours,
            laborHourlyRate,
            extraMaterialCost,
            extraEquipmentCost,
            delayDays,
            dailyOverheadCost,
            targetChangeMargin: targetChangeMargin + 5,
            customerOfferedPrice,
          });
          expect(bumped.minimumSafeChangePrice).toBeGreaterThanOrEqual(base.minimumSafeChangePrice);
        },
      ),
    );
  });
});

describe("office cleaning bid optimizer oracle properties", () => {
  test("labor rate and supply cost increases do not decrease total bid cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1_000, max: 30_000, noNaN: true }),
        fc.double({ min: 4, max: 24, noNaN: true }),
        fc.double({ min: 1.5, max: 8, noNaN: true }),
        fc.double({ min: 1, max: 4, noNaN: true }),
        fc.double({ min: 15, max: 45, noNaN: true }),
        fc.double({ min: 5, max: 60, noNaN: true }),
        fc.double({ min: 5, max: 50, noNaN: true }),
        fc.double({ min: 0, max: 500, noNaN: true }),
        fc.double({ min: 15, max: 40, noNaN: true }),
        fc.double({ min: 800, max: 6_000, noNaN: true }),
        (
          area,
          frequencyPerMonth,
          hoursPerVisit,
          crewSize,
          laborHourlyCost,
          suppliesCostPerVisit,
          travelCostPerVisit,
          monthlyOverhead,
          targetMargin,
          customerBudget,
        ) => {
          const base = calculateOfficeCleaningBidOptimizerOracle({
            area,
            frequencyPerMonth,
            hoursPerVisit,
            crewSize,
            laborHourlyCost,
            suppliesCostPerVisit,
            travelCostPerVisit,
            monthlyOverhead,
            targetMargin,
            customerBudget,
          });
          const bumpedRate = calculateOfficeCleaningBidOptimizerOracle({
            area,
            frequencyPerMonth,
            hoursPerVisit,
            crewSize,
            laborHourlyCost: laborHourlyCost + 2,
            suppliesCostPerVisit,
            travelCostPerVisit,
            monthlyOverhead,
            targetMargin,
            customerBudget,
          });
          const bumpedSupply = calculateOfficeCleaningBidOptimizerOracle({
            area,
            frequencyPerMonth,
            hoursPerVisit,
            crewSize,
            laborHourlyCost,
            suppliesCostPerVisit: suppliesCostPerVisit + 5,
            travelCostPerVisit,
            monthlyOverhead,
            targetMargin,
            customerBudget,
          });
          expect(bumpedRate.monthlyDirectCost).toBeGreaterThanOrEqual(base.monthlyDirectCost);
          expect(bumpedSupply.monthlyDirectCost).toBeGreaterThanOrEqual(base.monthlyDirectCost);
        },
      ),
    );
  });

  test("higher target margin does not decrease recommended bid", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 2_000, max: 25_000, noNaN: true }),
        fc.double({ min: 6, max: 20, noNaN: true }),
        fc.double({ min: 2, max: 6, noNaN: true }),
        fc.double({ min: 1, max: 3, noNaN: true }),
        fc.double({ min: 16, max: 35, noNaN: true }),
        fc.double({ min: 8, max: 40, noNaN: true }),
        fc.double({ min: 8, max: 35, noNaN: true }),
        fc.double({ min: 50, max: 400, noNaN: true }),
        fc.double({ min: 18, max: 35, noNaN: true }),
        fc.double({ min: 1_000, max: 5_000, noNaN: true }),
        (
          area,
          frequencyPerMonth,
          hoursPerVisit,
          crewSize,
          laborHourlyCost,
          suppliesCostPerVisit,
          travelCostPerVisit,
          monthlyOverhead,
          targetMargin,
          customerBudget,
        ) => {
          fc.pre(targetMargin < 70);
          const base = calculateOfficeCleaningBidOptimizerOracle({
            area,
            frequencyPerMonth,
            hoursPerVisit,
            crewSize,
            laborHourlyCost,
            suppliesCostPerVisit,
            travelCostPerVisit,
            monthlyOverhead,
            targetMargin,
            customerBudget,
          });
          const bumped = calculateOfficeCleaningBidOptimizerOracle({
            area,
            frequencyPerMonth,
            hoursPerVisit,
            crewSize,
            laborHourlyCost,
            suppliesCostPerVisit,
            travelCostPerVisit,
            monthlyOverhead,
            targetMargin: targetMargin + 4,
            customerBudget,
          });
          expect(bumped.minimumSafeMonthlyBid).toBeGreaterThanOrEqual(base.minimumSafeMonthlyBid);
        },
      ),
    );
  });
});

describe("menu profit leak detector oracle properties", () => {
  test("ingredient cost and waste rate increases worsen margin", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 8, max: 40, noNaN: true }),
        fc.double({ min: 1, max: 12, noNaN: true }),
        fc.double({ min: 0, max: 25, noNaN: true }),
        fc.double({ min: 0, max: 2, noNaN: true }),
        fc.double({ min: 0, max: 3, noNaN: true }),
        fc.double({ min: 0, max: 30, noNaN: true }),
        fc.double({ min: 40, max: 70, noNaN: true }),
        fc.double({ min: 50, max: 800, noNaN: true }),
        (
          sellingPrice,
          ingredientCost,
          wasteRate,
          packagingCost,
          laborCostPerItem,
          deliveryCommissionRate,
          targetMargin,
          monthlyUnitsSold,
        ) => {
          fc.pre(ingredientCost * 1.15 < sellingPrice);
          fc.pre(wasteRate < 80);
          const base = calculateMenuProfitLeakDetectorOracle({
            sellingPrice,
            ingredientCost,
            wasteRate,
            packagingCost,
            laborCostPerItem,
            deliveryCommissionRate,
            targetMargin,
            monthlyUnitsSold,
          });
          const bumpedIngredient = calculateMenuProfitLeakDetectorOracle({
            sellingPrice,
            ingredientCost: ingredientCost * 1.1,
            wasteRate,
            packagingCost,
            laborCostPerItem,
            deliveryCommissionRate,
            targetMargin,
            monthlyUnitsSold,
          });
          const bumpedWaste = calculateMenuProfitLeakDetectorOracle({
            sellingPrice,
            ingredientCost,
            wasteRate: wasteRate + 3,
            packagingCost,
            laborCostPerItem,
            deliveryCommissionRate,
            targetMargin,
            monthlyUnitsSold,
          });
          expect(bumpedIngredient.actualMargin).toBeLessThanOrEqual(base.actualMargin);
          expect(bumpedWaste.actualMargin).toBeLessThanOrEqual(base.actualMargin);
        },
      ),
    );
  });

  test("selling price increase does not worsen margin; portion cost increase lowers margin", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 10, max: 35, noNaN: true }),
        fc.double({ min: 2, max: 10, noNaN: true }),
        fc.double({ min: 0, max: 15, noNaN: true }),
        fc.double({ min: 0, max: 1.5, noNaN: true }),
        fc.double({ min: 0, max: 2.5, noNaN: true }),
        fc.double({ min: 0, max: 25, noNaN: true }),
        fc.double({ min: 45, max: 65, noNaN: true }),
        fc.double({ min: 80, max: 600, noNaN: true }),
        (
          sellingPrice,
          ingredientCost,
          wasteRate,
          packagingCost,
          laborCostPerItem,
          deliveryCommissionRate,
          targetMargin,
          monthlyUnitsSold,
        ) => {
          const base = calculateMenuProfitLeakDetectorOracle({
            sellingPrice,
            ingredientCost,
            wasteRate,
            packagingCost,
            laborCostPerItem,
            deliveryCommissionRate,
            targetMargin,
            monthlyUnitsSold,
          });
          const bumpedPrice = calculateMenuProfitLeakDetectorOracle({
            sellingPrice: sellingPrice * 1.08,
            ingredientCost,
            wasteRate,
            packagingCost,
            laborCostPerItem,
            deliveryCommissionRate,
            targetMargin,
            monthlyUnitsSold,
          });
          const bumpedPortion = calculateMenuProfitLeakDetectorOracle({
            sellingPrice,
            ingredientCost,
            wasteRate,
            packagingCost: packagingCost + 0.25,
            laborCostPerItem: laborCostPerItem + 0.2,
            deliveryCommissionRate,
            targetMargin,
            monthlyUnitsSold,
          });
          expect(bumpedPrice.actualMargin).toBeGreaterThanOrEqual(base.actualMargin);
          expect(bumpedPortion.actualMargin).toBeLessThanOrEqual(base.actualMargin);
        },
      ),
    );
  });
});

describe("return profit erosion oracle properties", () => {
  test("return rate and handling cost increases reduce net profit", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 35, max: 180, noNaN: true }),
        fc.double({ min: 8, max: 70, noNaN: true }),
        fc.double({ min: 0, max: 15, noNaN: true }),
        fc.double({ min: 0, max: 18, noNaN: true }),
        fc.double({ min: 0, max: 5, noNaN: true }),
        fc.double({ min: 0, max: 25, noNaN: true }),
        fc.double({ min: 0, max: 12, noNaN: true }),
        fc.double({ min: 0, max: 20, noNaN: true }),
        fc.double({ min: 15, max: 35, noNaN: true }),
        (
          sellingPrice,
          productCost,
          shippingCost,
          platformFeeRate,
          paymentFeeRate,
          returnRate,
          returnHandlingCost,
          adCostPerOrder,
          targetMargin,
        ) => {
          fc.pre(returnRate < 80);
          const base = calculateReturnProfitErosionOracle({
            sellingPrice,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate,
            returnHandlingCost,
            adCostPerOrder,
            targetMargin,
          });
          const bumpedReturn = calculateReturnProfitErosionOracle({
            sellingPrice,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate: returnRate + 4,
            returnHandlingCost,
            adCostPerOrder,
            targetMargin,
          });
          const bumpedHandling = calculateReturnProfitErosionOracle({
            sellingPrice,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate,
            returnHandlingCost: returnHandlingCost + 2,
            adCostPerOrder,
            targetMargin,
          });
          expect(bumpedReturn.netProfit).toBeLessThanOrEqual(base.netProfit);
          expect(bumpedHandling.netProfit).toBeLessThanOrEqual(base.netProfit);
        },
      ),
    );
  });

  test("near-zero return rate lowers erosion impact", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50, max: 150, noNaN: true }),
        fc.double({ min: 12, max: 60, noNaN: true }),
        fc.double({ min: 2, max: 12, noNaN: true }),
        fc.double({ min: 0, max: 15, noNaN: true }),
        fc.double({ min: 0, max: 4, noNaN: true }),
        fc.double({ min: 2, max: 20, noNaN: true }),
        fc.double({ min: 0, max: 8, noNaN: true }),
        fc.double({ min: 5, max: 18, noNaN: true }),
        fc.double({ min: 18, max: 32, noNaN: true }),
        (
          sellingPrice,
          productCost,
          shippingCost,
          platformFeeRate,
          paymentFeeRate,
          returnRate,
          returnHandlingCost,
          adCostPerOrder,
          targetMargin,
        ) => {
          fc.pre(returnRate >= 5);
          const base = calculateReturnProfitErosionOracle({
            sellingPrice,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate,
            returnHandlingCost,
            adCostPerOrder,
            targetMargin,
          });
          const lowReturn = calculateReturnProfitErosionOracle({
            sellingPrice,
            productCost,
            shippingCost,
            platformFeeRate,
            paymentFeeRate,
            returnRate: 0.5,
            returnHandlingCost,
            adCostPerOrder,
            targetMargin,
          });
          expect(lowReturn.returnImpact).toBeLessThanOrEqual(base.returnImpact);
        },
      ),
    );
  });
});

describe("welding bid risk oracle properties", () => {
  test("labor hours, rate and consumables increases do not decrease total cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100, max: 3_000, noNaN: true }),
        fc.double({ min: 2, max: 40, noNaN: true }),
        fc.double({ min: 45, max: 110, noNaN: true }),
        fc.double({ min: 0, max: 300, noNaN: true }),
        fc.double({ min: 0, max: 10, noNaN: true }),
        fc.double({ min: 0, max: 25, noNaN: true }),
        fc.double({ min: 15, max: 35, noNaN: true }),
        (
          materialCost,
          laborHours,
          laborRate,
          gasConsumableCost,
          fitUpHours,
          reworkRiskPercent,
          targetMargin,
        ) => {
          const base = calculateWeldingBidRiskOracle({
            materialCost,
            laborHours,
            laborRate,
            gasConsumableCost,
            fitUpHours,
            reworkRiskPercent,
            targetMargin,
          });
          const bumpedHours = calculateWeldingBidRiskOracle({
            materialCost,
            laborHours: laborHours * 1.1,
            laborRate,
            gasConsumableCost,
            fitUpHours,
            reworkRiskPercent,
            targetMargin,
          });
          const bumpedRate = calculateWeldingBidRiskOracle({
            materialCost,
            laborHours,
            laborRate: laborRate * 1.05,
            gasConsumableCost,
            fitUpHours,
            reworkRiskPercent,
            targetMargin,
          });
          const bumpedGas = calculateWeldingBidRiskOracle({
            materialCost,
            laborHours,
            laborRate,
            gasConsumableCost: gasConsumableCost + 20,
            fitUpHours,
            reworkRiskPercent,
            targetMargin,
          });
          expect(bumpedHours.baseCost).toBeGreaterThanOrEqual(base.baseCost);
          expect(bumpedRate.baseCost).toBeGreaterThanOrEqual(base.baseCost);
          expect(bumpedGas.baseCost).toBeGreaterThanOrEqual(base.baseCost);
        },
      ),
    );
  });

  test("higher rework risk or target margin does not decrease safe bid", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 200, max: 2_500, noNaN: true }),
        fc.double({ min: 4, max: 30, noNaN: true }),
        fc.double({ min: 50, max: 95, noNaN: true }),
        fc.double({ min: 20, max: 250, noNaN: true }),
        fc.double({ min: 0.5, max: 8, noNaN: true }),
        fc.double({ min: 2, max: 20, noNaN: true }),
        fc.double({ min: 18, max: 30, noNaN: true }),
        (
          materialCost,
          laborHours,
          laborRate,
          gasConsumableCost,
          fitUpHours,
          reworkRiskPercent,
          targetMargin,
        ) => {
          fc.pre(reworkRiskPercent < 80 && targetMargin < 70);
          const base = calculateWeldingBidRiskOracle({
            materialCost,
            laborHours,
            laborRate,
            gasConsumableCost,
            fitUpHours,
            reworkRiskPercent,
            targetMargin,
          });
          const bumpedRework = calculateWeldingBidRiskOracle({
            materialCost,
            laborHours,
            laborRate,
            gasConsumableCost,
            fitUpHours,
            reworkRiskPercent: reworkRiskPercent + 5,
            targetMargin,
          });
          const bumpedMargin = calculateWeldingBidRiskOracle({
            materialCost,
            laborHours,
            laborRate,
            gasConsumableCost,
            fitUpHours,
            reworkRiskPercent,
            targetMargin: targetMargin + 5,
          });
          expect(bumpedRework.minimumSafePrice).toBeGreaterThanOrEqual(base.minimumSafePrice);
          expect(bumpedMargin.minimumSafePrice).toBeGreaterThanOrEqual(base.minimumSafePrice);
        },
      ),
    );
  });

  test("zero labor rate is invalid", () => {
    expect(() =>
      calculateWeldingBidRiskOracle({
        materialCost: 500,
        laborHours: 10,
        laborRate: 0,
        gasConsumableCost: 60,
        fitUpHours: 2,
        reworkRiskPercent: 10,
        targetMargin: 25,
      }),
    ).toThrow(OracleValidationError);
  });
});
