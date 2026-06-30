/**
 * Scenario runtime handlers for premium-schema batch tools.
 */

import {
  calculate3dPrintJobMarginToolOracle,
  calculateCbamComplianceVerdictOracle,
  calculateCropYieldLossAnalyzerOracle,
  calculateDairyProfitDetectorOracle,
  calculateEnergyEfficiencyReportOracle,
  calculateFeedEfficiencyAnalyzerOracle,
  calculateMealPlanningVerdictOracle,
  calculateRenovationBudgetOptimizerOracle,
  calculateRouteOptimizationAnalyzerOracle,
  calculateTripBudgetOptimizerOracle,
  calculateWaterOptimizationVerdictOracle,
} from "@/lib/features/formula-governance/oracle/batch-premium-schema-oracles";
import { OracleValidationError } from "@/lib/features/formula-governance/oracle/oracle-types";

type ScenarioHandler = () => void;

function assertSafePriceExceedsBase(
  result: { baseCost: number; minimumSafePrice: number },
  message: string,
): void {
  if (result.minimumSafePrice <= result.baseCost) {
    throw new Error(message);
  }
}

export const ROUTE_OPTIMIZATION_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-lane": () => {
    const result = calculateRouteOptimizationAnalyzerOracle({
      distanceKm: 500,
      fuelPricePerKm: 0.35,
      driverHourlyRate: 28,
      estimatedHours: 8,
      returnEmpty: "no",
      hasTolls: "yes",
      overweightRisk: "no",
      targetMargin: 18,
    });
    assertSafePriceExceedsBase(result, "Safe freight price must exceed base cost.");
  },
  "edge-deadhead": () => {
    const noReturn = calculateRouteOptimizationAnalyzerOracle({
      distanceKm: 400,
      fuelPricePerKm: 0.36,
      driverHourlyRate: 30,
      estimatedHours: 7,
      returnEmpty: "no",
      hasTolls: "no",
      overweightRisk: "no",
      targetMargin: 18,
    });
    const deadhead = calculateRouteOptimizationAnalyzerOracle({
      distanceKm: 400,
      fuelPricePerKm: 0.36,
      driverHourlyRate: 30,
      estimatedHours: 7,
      returnEmpty: "yes",
      hasTolls: "no",
      overweightRisk: "no",
      targetMargin: 18,
    });
    if (deadhead.baseCost <= noReturn.baseCost) {
      throw new Error("Empty return must increase base cost.");
    }
  },
  "absurd-zero-distance": () => {
    try {
      calculateRouteOptimizationAnalyzerOracle({
        distanceKm: 0,
        fuelPricePerKm: 0.35,
        driverHourlyRate: 28,
        estimatedHours: 8,
        returnEmpty: "no",
        hasTolls: "no",
        overweightRisk: "no",
        targetMargin: 18,
      });
      throw new Error("Expected zero distance to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-distance": () => {
    const base = calculateRouteOptimizationAnalyzerOracle({
      distanceKm: 300,
      fuelPricePerKm: 0.35,
      driverHourlyRate: 28,
      estimatedHours: 6,
      returnEmpty: "no",
      hasTolls: "no",
      overweightRisk: "no",
      targetMargin: 18,
    });
    const longer = calculateRouteOptimizationAnalyzerOracle({
      distanceKm: 600,
      fuelPricePerKm: 0.35,
      driverHourlyRate: 28,
      estimatedHours: 6,
      returnEmpty: "no",
      hasTolls: "no",
      overweightRisk: "no",
      targetMargin: 18,
    });
    if (longer.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Longer distance must raise minimum safe price.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculateRouteOptimizationAnalyzerOracle({
      distanceKm: 450,
      fuelPricePerKm: 0.35,
      driverHourlyRate: 28,
      estimatedHours: 7,
      returnEmpty: "no",
      hasTolls: "no",
      overweightRisk: "no",
      targetMargin: 12,
    });
    const high = calculateRouteOptimizationAnalyzerOracle({
      distanceKm: 450,
      fuelPricePerKm: 0.35,
      driverHourlyRate: 28,
      estimatedHours: 7,
      returnEmpty: "no",
      hasTolls: "no",
      overweightRisk: "no",
      targetMargin: 24,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher target margin must raise minimum safe price.");
    }
  },
};

export const ENERGY_EFFICIENCY_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-facility": () => {
    const result = calculateEnergyEfficiencyReportOracle({
      monthlyKwh: 12000,
      tariffPerKwh: 0.12,
      demandCharge: 450,
      powerFactorPenalty: 5,
      efficiencyTargetPercent: 85,
      targetSavings: 10,
    });
    assertSafePriceExceedsBase(result, "Energy floor must exceed base cost.");
  },
  "edge-high-pf": () => {
    const low = calculateEnergyEfficiencyReportOracle({
      monthlyKwh: 15000,
      tariffPerKwh: 0.11,
      demandCharge: 500,
      powerFactorPenalty: 4,
      efficiencyTargetPercent: 85,
      targetSavings: 10,
    });
    const high = calculateEnergyEfficiencyReportOracle({
      monthlyKwh: 15000,
      tariffPerKwh: 0.11,
      demandCharge: 500,
      powerFactorPenalty: 14,
      efficiencyTargetPercent: 85,
      targetSavings: 10,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher power factor penalty must increase base cost.");
    }
  },
  "absurd-zero-kwh": () => {
    try {
      calculateEnergyEfficiencyReportOracle({
        monthlyKwh: 0,
        tariffPerKwh: 0.12,
        demandCharge: 450,
        powerFactorPenalty: 5,
        efficiencyTargetPercent: 85,
        targetSavings: 10,
      });
      throw new Error("Expected zero kWh to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-demand": () => {
    const base = calculateEnergyEfficiencyReportOracle({
      monthlyKwh: 10000,
      tariffPerKwh: 0.1,
      demandCharge: 300,
      powerFactorPenalty: 5,
      efficiencyTargetPercent: 85,
      targetSavings: 10,
    });
    const bumped = calculateEnergyEfficiencyReportOracle({
      monthlyKwh: 10000,
      tariffPerKwh: 0.1,
      demandCharge: 800,
      powerFactorPenalty: 5,
      efficiencyTargetPercent: 85,
      targetSavings: 10,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher demand charge must raise minimum safe price.");
    }
  },
  "sensitivity-tariff": () => {
    const low = calculateEnergyEfficiencyReportOracle({
      monthlyKwh: 12000,
      tariffPerKwh: 0.08,
      demandCharge: 450,
      powerFactorPenalty: 5,
      efficiencyTargetPercent: 85,
      targetSavings: 10,
    });
    const high = calculateEnergyEfficiencyReportOracle({
      monthlyKwh: 12000,
      tariffPerKwh: 0.16,
      demandCharge: 450,
      powerFactorPenalty: 5,
      efficiencyTargetPercent: 85,
      targetSavings: 10,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher tariff must raise minimum safe price.");
    }
  },
};

export const MEAL_PLANNING_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-household": () => {
    const result = calculateMealPlanningVerdictOracle({
      mealsPerWeek: 21,
      weeklyGroceryBudget: 180,
      foodWastePercent: 15,
      inflationBuffer: 8,
      householdSize: 4,
      targetSavings: 10,
    });
    assertSafePriceExceedsBase(result, "Adjusted budget must exceed visible grocery spend.");
  },
  "edge-high-waste": () => {
    const low = calculateMealPlanningVerdictOracle({
      mealsPerWeek: 21,
      weeklyGroceryBudget: 180,
      foodWastePercent: 8,
      inflationBuffer: 8,
      householdSize: 4,
      targetSavings: 10,
    });
    const high = calculateMealPlanningVerdictOracle({
      mealsPerWeek: 21,
      weeklyGroceryBudget: 180,
      foodWastePercent: 22,
      inflationBuffer: 8,
      householdSize: 4,
      targetSavings: 10,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher food waste must increase base cost.");
    }
  },
  "absurd-zero-budget": () => {
    try {
      calculateMealPlanningVerdictOracle({
        mealsPerWeek: 21,
        weeklyGroceryBudget: 0,
        foodWastePercent: 15,
        inflationBuffer: 8,
        householdSize: 4,
        targetSavings: 10,
      });
      throw new Error("Expected zero budget to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-waste": () => {
    const base = calculateMealPlanningVerdictOracle({
      mealsPerWeek: 21,
      weeklyGroceryBudget: 160,
      foodWastePercent: 10,
      inflationBuffer: 8,
      householdSize: 4,
      targetSavings: 10,
    });
    const bumped = calculateMealPlanningVerdictOracle({
      mealsPerWeek: 21,
      weeklyGroceryBudget: 160,
      foodWastePercent: 20,
      inflationBuffer: 8,
      householdSize: 4,
      targetSavings: 10,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher waste must raise adjusted budget floor.");
    }
  },
  "sensitivity-inflation": () => {
    const low = calculateMealPlanningVerdictOracle({
      mealsPerWeek: 21,
      weeklyGroceryBudget: 180,
      foodWastePercent: 12,
      inflationBuffer: 4,
      householdSize: 4,
      targetSavings: 10,
    });
    const high = calculateMealPlanningVerdictOracle({
      mealsPerWeek: 21,
      weeklyGroceryBudget: 180,
      foodWastePercent: 12,
      inflationBuffer: 14,
      householdSize: 4,
      targetSavings: 10,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher inflation buffer must increase base cost.");
    }
  },
};

export const TRIP_BUDGET_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-trip": () => {
    const result = calculateTripBudgetOptimizerOracle({
      distanceKm: 420,
      consumptionPer100Km: 7.5,
      fuelPricePerLiter: 1.45,
      tollEstimate: 28,
      returnTrip: "no",
      parkingPerDay: 15,
      bufferPercent: 12,
    });
    assertSafePriceExceedsBase(result, "Trip budget floor must exceed subtotal.");
  },
  "edge-return-trip": () => {
    const oneWay = calculateTripBudgetOptimizerOracle({
      distanceKm: 300,
      consumptionPer100Km: 7.5,
      fuelPricePerLiter: 1.45,
      tollEstimate: 20,
      returnTrip: "no",
      parkingPerDay: 10,
      bufferPercent: 12,
    });
    const roundTrip = calculateTripBudgetOptimizerOracle({
      distanceKm: 300,
      consumptionPer100Km: 7.5,
      fuelPricePerLiter: 1.45,
      tollEstimate: 20,
      returnTrip: "yes",
      parkingPerDay: 10,
      bufferPercent: 12,
    });
    if (roundTrip.baseCost <= oneWay.baseCost) {
      throw new Error("Return trip must increase trip budget base cost.");
    }
  },
  "absurd-zero-distance": () => {
    try {
      calculateTripBudgetOptimizerOracle({
        distanceKm: 0,
        consumptionPer100Km: 7.5,
        fuelPricePerLiter: 1.45,
        tollEstimate: 28,
        returnTrip: "no",
        parkingPerDay: 15,
        bufferPercent: 12,
      });
      throw new Error("Expected zero distance to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-tolls": () => {
    const base = calculateTripBudgetOptimizerOracle({
      distanceKm: 350,
      consumptionPer100Km: 7.8,
      fuelPricePerLiter: 1.48,
      tollEstimate: 10,
      returnTrip: "no",
      parkingPerDay: 12,
      bufferPercent: 12,
    });
    const bumped = calculateTripBudgetOptimizerOracle({
      distanceKm: 350,
      consumptionPer100Km: 7.8,
      fuelPricePerLiter: 1.48,
      tollEstimate: 60,
      returnTrip: "no",
      parkingPerDay: 12,
      bufferPercent: 12,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher tolls must raise trip budget floor.");
    }
  },
  "sensitivity-buffer": () => {
    const low = calculateTripBudgetOptimizerOracle({
      distanceKm: 400,
      consumptionPer100Km: 8,
      fuelPricePerLiter: 1.5,
      tollEstimate: 25,
      returnTrip: "no",
      parkingPerDay: 15,
      bufferPercent: 8,
    });
    const high = calculateTripBudgetOptimizerOracle({
      distanceKm: 400,
      consumptionPer100Km: 8,
      fuelPricePerLiter: 1.5,
      tollEstimate: 25,
      returnTrip: "no",
      parkingPerDay: 15,
      bufferPercent: 18,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher buffer percent must increase base cost.");
    }
  },
};

export const CBAM_COMPLIANCE_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-export": () => {
    const result = calculateCbamComplianceVerdictOracle({
      productionTons: 100,
      energySource: "electricity",
      euImportValue: 500000,
      processEmissionsFactor: 0.2,
      includesTransport: "yes",
      targetMargin: 15,
    });
    assertSafePriceExceedsBase(result, "CBAM floor must exceed visible carbon cost.");
  },
  "edge-coal-energy": () => {
    const grid = calculateCbamComplianceVerdictOracle({
      productionTons: 100,
      energySource: "electricity",
      euImportValue: 500000,
      processEmissionsFactor: 0.2,
      includesTransport: "yes",
      targetMargin: 15,
    });
    const coal = calculateCbamComplianceVerdictOracle({
      productionTons: 100,
      energySource: "coal",
      euImportValue: 500000,
      processEmissionsFactor: 0.2,
      includesTransport: "yes",
      targetMargin: 15,
    });
    if (coal.baseCost <= grid.baseCost) {
      throw new Error("Coal energy source must increase CBAM base cost.");
    }
  },
  "absurd-zero-tons": () => {
    try {
      calculateCbamComplianceVerdictOracle({
        productionTons: 0,
        energySource: "electricity",
        euImportValue: 500000,
        processEmissionsFactor: 0.2,
        includesTransport: "yes",
        targetMargin: 15,
      });
      throw new Error("Expected zero production tons to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-tons": () => {
    const base = calculateCbamComplianceVerdictOracle({
      productionTons: 80,
      energySource: "gas",
      euImportValue: 400000,
      processEmissionsFactor: 0.25,
      includesTransport: "yes",
      targetMargin: 15,
    });
    const bumped = calculateCbamComplianceVerdictOracle({
      productionTons: 160,
      energySource: "gas",
      euImportValue: 400000,
      processEmissionsFactor: 0.25,
      includesTransport: "yes",
      targetMargin: 15,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher production volume must raise CBAM floor.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculateCbamComplianceVerdictOracle({
      productionTons: 120,
      energySource: "electricity",
      euImportValue: 600000,
      processEmissionsFactor: 0.2,
      includesTransport: "yes",
      targetMargin: 10,
    });
    const high = calculateCbamComplianceVerdictOracle({
      productionTons: 120,
      energySource: "electricity",
      euImportValue: 600000,
      processEmissionsFactor: 0.2,
      includesTransport: "yes",
      targetMargin: 22,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher target margin must raise minimum safe price.");
    }
  },
};

export const CROP_YIELD_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-field": () => {
    const result = calculateCropYieldLossAnalyzerOracle({
      areaHectares: 45,
      expectedYieldTonnes: 3.2,
      fertilizerCost: 8500,
      irrigationCost: 4200,
      soilMoisturePercent: 18,
      weatherRiskIndex: 3,
      targetMargin: 20,
    });
    assertSafePriceExceedsBase(result, "Yield floor must exceed input cost exposure.");
  },
  "edge-weather": () => {
    const calm = calculateCropYieldLossAnalyzerOracle({
      areaHectares: 40,
      expectedYieldTonnes: 3,
      fertilizerCost: 7000,
      irrigationCost: 3500,
      soilMoisturePercent: 20,
      weatherRiskIndex: 2,
      targetMargin: 20,
    });
    const stormy = calculateCropYieldLossAnalyzerOracle({
      areaHectares: 40,
      expectedYieldTonnes: 3,
      fertilizerCost: 7000,
      irrigationCost: 3500,
      soilMoisturePercent: 20,
      weatherRiskIndex: 8,
      targetMargin: 20,
    });
    if (stormy.baseCost < calm.baseCost) {
      throw new Error("Higher weather risk must not decrease base cost.");
    }
  },
  "absurd-zero-area": () => {
    try {
      calculateCropYieldLossAnalyzerOracle({
        areaHectares: 0,
        expectedYieldTonnes: 3.2,
        fertilizerCost: 8500,
        irrigationCost: 4200,
        soilMoisturePercent: 18,
        weatherRiskIndex: 3,
        targetMargin: 20,
      });
      throw new Error("Expected zero area to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-fertilizer": () => {
    const base = calculateCropYieldLossAnalyzerOracle({
      areaHectares: 30,
      expectedYieldTonnes: 3,
      fertilizerCost: 5000,
      irrigationCost: 3000,
      soilMoisturePercent: 18,
      weatherRiskIndex: 3,
      targetMargin: 20,
    });
    const bumped = calculateCropYieldLossAnalyzerOracle({
      areaHectares: 30,
      expectedYieldTonnes: 3,
      fertilizerCost: 9000,
      irrigationCost: 3000,
      soilMoisturePercent: 18,
      weatherRiskIndex: 3,
      targetMargin: 20,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher fertilizer cost must raise minimum safe price.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculateCropYieldLossAnalyzerOracle({
      areaHectares: 35,
      expectedYieldTonnes: 3,
      fertilizerCost: 6000,
      irrigationCost: 3200,
      soilMoisturePercent: 18,
      weatherRiskIndex: 3,
      targetMargin: 15,
    });
    const high = calculateCropYieldLossAnalyzerOracle({
      areaHectares: 35,
      expectedYieldTonnes: 3,
      fertilizerCost: 6000,
      irrigationCost: 3200,
      soilMoisturePercent: 18,
      weatherRiskIndex: 3,
      targetMargin: 25,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher target margin must raise minimum safe price.");
    }
  },
};

export const FEED_EFFICIENCY_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-herd": () => {
    const result = calculateFeedEfficiencyAnalyzerOracle({
      animalCount: 120,
      dailyFeedKg: 8,
      feedPricePerKg: 0.42,
      feedWastePercent: 8,
      waterQualityIndex: 7,
      targetMargin: 15,
    });
    assertSafePriceExceedsBase(result, "Feed floor must exceed visible feed spend.");
  },
  "edge-high-waste": () => {
    const low = calculateFeedEfficiencyAnalyzerOracle({
      animalCount: 100,
      dailyFeedKg: 8,
      feedPricePerKg: 0.4,
      feedWastePercent: 5,
      waterQualityIndex: 7,
      targetMargin: 15,
    });
    const high = calculateFeedEfficiencyAnalyzerOracle({
      animalCount: 100,
      dailyFeedKg: 8,
      feedPricePerKg: 0.4,
      feedWastePercent: 16,
      waterQualityIndex: 7,
      targetMargin: 15,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher feed waste must increase base cost.");
    }
  },
  "absurd-zero-herd": () => {
    try {
      calculateFeedEfficiencyAnalyzerOracle({
        animalCount: 0,
        dailyFeedKg: 8,
        feedPricePerKg: 0.42,
        feedWastePercent: 8,
        waterQualityIndex: 7,
        targetMargin: 15,
      });
      throw new Error("Expected zero herd size to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-price": () => {
    const base = calculateFeedEfficiencyAnalyzerOracle({
      animalCount: 100,
      dailyFeedKg: 8,
      feedPricePerKg: 0.35,
      feedWastePercent: 8,
      waterQualityIndex: 7,
      targetMargin: 15,
    });
    const bumped = calculateFeedEfficiencyAnalyzerOracle({
      animalCount: 100,
      dailyFeedKg: 8,
      feedPricePerKg: 0.5,
      feedWastePercent: 8,
      waterQualityIndex: 7,
      targetMargin: 15,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher feed price must raise minimum safe price.");
    }
  },
  "sensitivity-waste": () => {
    const low = calculateFeedEfficiencyAnalyzerOracle({
      animalCount: 120,
      dailyFeedKg: 8,
      feedPricePerKg: 0.42,
      feedWastePercent: 4,
      waterQualityIndex: 7,
      targetMargin: 15,
    });
    const high = calculateFeedEfficiencyAnalyzerOracle({
      animalCount: 120,
      dailyFeedKg: 8,
      feedPricePerKg: 0.42,
      feedWastePercent: 14,
      waterQualityIndex: 7,
      targetMargin: 15,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher waste percent must raise minimum safe price.");
    }
  },
};

export const DAIRY_PROFIT_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-dairy": () => {
    const result = calculateDairyProfitDetectorOracle({
      cowCount: 150,
      litersPerCowPerDay: 28,
      milkPricePerLiter: 0.38,
      monthlyFeedCost: 42000,
      laborCost: 18000,
      vetAndHealth: 3500,
      targetMargin: 12,
    });
    assertSafePriceExceedsBase(result, "Dairy cost floor must exceed visible monthly stack.");
  },
  "edge-high-feed": () => {
    const base = calculateDairyProfitDetectorOracle({
      cowCount: 120,
      litersPerCowPerDay: 26,
      milkPricePerLiter: 0.36,
      monthlyFeedCost: 30000,
      laborCost: 15000,
      vetAndHealth: 3000,
      targetMargin: 12,
    });
    const high = calculateDairyProfitDetectorOracle({
      cowCount: 120,
      litersPerCowPerDay: 26,
      milkPricePerLiter: 0.36,
      monthlyFeedCost: 48000,
      laborCost: 15000,
      vetAndHealth: 3000,
      targetMargin: 12,
    });
    if (high.baseCost <= base.baseCost) {
      throw new Error("Higher feed cost must increase base cost.");
    }
  },
  "absurd-negative-cost": () => {
    try {
      calculateDairyProfitDetectorOracle({
        cowCount: 100,
        litersPerCowPerDay: 27,
        milkPricePerLiter: 0.37,
        monthlyFeedCost: 28000,
        laborCost: -5000,
        vetAndHealth: 3000,
        targetMargin: 12,
      });
      throw new Error("Expected negative labor cost to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-feed": () => {
    const base = calculateDairyProfitDetectorOracle({
      cowCount: 100,
      litersPerCowPerDay: 27,
      milkPricePerLiter: 0.37,
      monthlyFeedCost: 22000,
      laborCost: 14000,
      vetAndHealth: 2800,
      targetMargin: 12,
    });
    const bumped = calculateDairyProfitDetectorOracle({
      cowCount: 100,
      litersPerCowPerDay: 27,
      milkPricePerLiter: 0.37,
      monthlyFeedCost: 32000,
      laborCost: 14000,
      vetAndHealth: 2800,
      targetMargin: 12,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher feed cost must raise minimum safe price.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculateDairyProfitDetectorOracle({
      cowCount: 100,
      litersPerCowPerDay: 27,
      milkPricePerLiter: 0.37,
      monthlyFeedCost: 28000,
      laborCost: 14000,
      vetAndHealth: 3000,
      targetMargin: 8,
    });
    const high = calculateDairyProfitDetectorOracle({
      cowCount: 100,
      litersPerCowPerDay: 27,
      milkPricePerLiter: 0.37,
      monthlyFeedCost: 28000,
      laborCost: 14000,
      vetAndHealth: 3000,
      targetMargin: 18,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher target margin must raise minimum safe price.");
    }
  },
};

export const WATER_OPTIMIZATION_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-irrigation": () => {
    const result = calculateWaterOptimizationVerdictOracle({
      areaHectares: 35,
      pumpingHours: 120,
      electricityRate: 0.14,
      waterRightsFee: 850,
      evaporationLossPercent: 12,
      targetMargin: 18,
    });
    assertSafePriceExceedsBase(result, "Water spend floor must exceed pumping cost.");
  },
  "edge-high-evap": () => {
    const low = calculateWaterOptimizationVerdictOracle({
      areaHectares: 40,
      pumpingHours: 100,
      electricityRate: 0.13,
      waterRightsFee: 700,
      evaporationLossPercent: 8,
      targetMargin: 18,
    });
    const high = calculateWaterOptimizationVerdictOracle({
      areaHectares: 40,
      pumpingHours: 100,
      electricityRate: 0.13,
      waterRightsFee: 700,
      evaporationLossPercent: 20,
      targetMargin: 18,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher evaporation loss must increase base cost.");
    }
  },
  "absurd-zero-area": () => {
    try {
      calculateWaterOptimizationVerdictOracle({
        areaHectares: 0,
        pumpingHours: 120,
        electricityRate: 0.14,
        waterRightsFee: 850,
        evaporationLossPercent: 12,
        targetMargin: 18,
      });
      throw new Error("Expected zero area to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-pumping": () => {
    const base = calculateWaterOptimizationVerdictOracle({
      areaHectares: 35,
      pumpingHours: 80,
      electricityRate: 0.14,
      waterRightsFee: 850,
      evaporationLossPercent: 12,
      targetMargin: 18,
    });
    const bumped = calculateWaterOptimizationVerdictOracle({
      areaHectares: 35,
      pumpingHours: 180,
      electricityRate: 0.14,
      waterRightsFee: 850,
      evaporationLossPercent: 12,
      targetMargin: 18,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("More pumping hours must raise minimum safe price.");
    }
  },
  "sensitivity-rights": () => {
    const low = calculateWaterOptimizationVerdictOracle({
      areaHectares: 35,
      pumpingHours: 120,
      electricityRate: 0.14,
      waterRightsFee: 400,
      evaporationLossPercent: 12,
      targetMargin: 18,
    });
    const high = calculateWaterOptimizationVerdictOracle({
      areaHectares: 35,
      pumpingHours: 120,
      electricityRate: 0.14,
      waterRightsFee: 1200,
      evaporationLossPercent: 12,
      targetMargin: 18,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher water rights fee must raise minimum safe price.");
    }
  },
};

export const RENOVATION_BUDGET_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-renovation": () => {
    const result = calculateRenovationBudgetOptimizerOracle({
      areaM2: 85,
      materialQuality: "standard",
      includeLabor: "yes",
      season: "summer",
      cityTier: "standard",
      contingencyPercent: 10,
    });
    assertSafePriceExceedsBase(result, "Renovation budget floor must exceed visible total.");
  },
  "edge-winter": () => {
    const summer = calculateRenovationBudgetOptimizerOracle({
      areaM2: 100,
      materialQuality: "standard",
      includeLabor: "yes",
      season: "summer",
      cityTier: "standard",
      contingencyPercent: 10,
    });
    const winter = calculateRenovationBudgetOptimizerOracle({
      areaM2: 100,
      materialQuality: "standard",
      includeLabor: "yes",
      season: "winter",
      cityTier: "standard",
      contingencyPercent: 10,
    });
    if (winter.baseCost <= summer.baseCost) {
      throw new Error("Winter season must not decrease renovation base cost.");
    }
  },
  "absurd-zero-area": () => {
    try {
      calculateRenovationBudgetOptimizerOracle({
        areaM2: 0,
        materialQuality: "standard",
        includeLabor: "yes",
        season: "summer",
        cityTier: "standard",
        contingencyPercent: 10,
      });
      throw new Error("Expected zero area to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-area": () => {
    const base = calculateRenovationBudgetOptimizerOracle({
      areaM2: 60,
      materialQuality: "standard",
      includeLabor: "yes",
      season: "summer",
      cityTier: "standard",
      contingencyPercent: 10,
    });
    const bumped = calculateRenovationBudgetOptimizerOracle({
      areaM2: 120,
      materialQuality: "standard",
      includeLabor: "yes",
      season: "summer",
      cityTier: "standard",
      contingencyPercent: 10,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Larger area must raise minimum safe price.");
    }
  },
  "sensitivity-contingency": () => {
    const low = calculateRenovationBudgetOptimizerOracle({
      areaM2: 85,
      materialQuality: "standard",
      includeLabor: "yes",
      season: "summer",
      cityTier: "standard",
      contingencyPercent: 5,
    });
    const high = calculateRenovationBudgetOptimizerOracle({
      areaM2: 85,
      materialQuality: "standard",
      includeLabor: "yes",
      season: "summer",
      cityTier: "standard",
      contingencyPercent: 18,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher contingency must increase base cost.");
    }
  },
};

export const THREE_D_PRINT_JOB_MARGIN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-print-job": () => {
    const result = calculate3dPrintJobMarginToolOracle({
      materialCost: 45,
      printHours: 6,
      machineRate: 12,
      postProcessHours: 1.5,
      laborRate: 28,
      failRatePercent: 10,
      targetMargin: 30,
    });
    assertSafePriceExceedsBase(result, "Print price floor must exceed job base cost.");
  },
  "edge-high-fail": () => {
    const low = calculate3dPrintJobMarginToolOracle({
      materialCost: 45,
      printHours: 6,
      machineRate: 12,
      postProcessHours: 1.5,
      laborRate: 28,
      failRatePercent: 6,
      targetMargin: 30,
    });
    const high = calculate3dPrintJobMarginToolOracle({
      materialCost: 45,
      printHours: 6,
      machineRate: 12,
      postProcessHours: 1.5,
      laborRate: 28,
      failRatePercent: 20,
      targetMargin: 30,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher fail rate must increase base cost.");
    }
  },
  "absurd-negative-material": () => {
    try {
      calculate3dPrintJobMarginToolOracle({
        materialCost: -10,
        printHours: 6,
        machineRate: 12,
        postProcessHours: 1.5,
        laborRate: 28,
        failRatePercent: 10,
        targetMargin: 30,
      });
      throw new Error("Expected negative material cost to be rejected.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-hours": () => {
    const base = calculate3dPrintJobMarginToolOracle({
      materialCost: 40,
      printHours: 4,
      machineRate: 12,
      postProcessHours: 1,
      laborRate: 28,
      failRatePercent: 10,
      targetMargin: 30,
    });
    const bumped = calculate3dPrintJobMarginToolOracle({
      materialCost: 40,
      printHours: 10,
      machineRate: 12,
      postProcessHours: 1,
      laborRate: 28,
      failRatePercent: 10,
      targetMargin: 30,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Longer print hours must raise minimum safe price.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculate3dPrintJobMarginToolOracle({
      materialCost: 45,
      printHours: 6,
      machineRate: 12,
      postProcessHours: 1.5,
      laborRate: 28,
      failRatePercent: 10,
      targetMargin: 20,
    });
    const high = calculate3dPrintJobMarginToolOracle({
      materialCost: 45,
      printHours: 6,
      machineRate: 12,
      postProcessHours: 1.5,
      laborRate: 28,
      failRatePercent: 10,
      targetMargin: 35,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher target margin must raise minimum safe price.");
    }
  },
};

export const BATCH_PREMIUM_SCHEMA_SCENARIO_HANDLERS: Record<
  string,
  Record<string, ScenarioHandler>
> = {
  "route-optimization-analyzer": ROUTE_OPTIMIZATION_SCENARIOS,
  "energy-efficiency-report": ENERGY_EFFICIENCY_SCENARIOS,
  "meal-planning-verdict": MEAL_PLANNING_SCENARIOS,
  "trip-budget-optimizer": TRIP_BUDGET_SCENARIOS,
  "cbam-compliance-verdict": CBAM_COMPLIANCE_SCENARIOS,
  "crop-yield-loss-analyzer": CROP_YIELD_SCENARIOS,
  "feed-efficiency-analyzer": FEED_EFFICIENCY_SCENARIOS,
  "dairy-profit-detector": DAIRY_PROFIT_SCENARIOS,
  "water-optimization-verdict": WATER_OPTIMIZATION_SCENARIOS,
  "renovation-budget-optimizer": RENOVATION_BUDGET_SCENARIOS,
  "3d-print-job-margin-tool": THREE_D_PRINT_JOB_MARGIN_SCENARIOS,
};
