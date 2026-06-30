/**
 * Scenario runtime handlers for Phase 5G-B batch free/revenue tools.
 */

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
} from "@/lib/features/formula-governance/oracle/batch-free-batch2-oracles";
import { OracleValidationError } from "@/lib/features/formula-governance/oracle/oracle-types";

type ScenarioHandler = () => void;

export const SAMPLE_SIZE_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-survey": () => {
    const result = calculateSampleSizeOracle({
      population: 5000,
      confidenceZ: 1.96,
      marginErrorPercent: 5,
      proportionPercent: 50,
    });
    if (result.requiredSample <= 0) {
      throw new Error("Expected positive sample size.");
    }
  },
  "edge-large-population": () => {
    const infinite = calculateSampleSizeOracle({
      population: 0,
      confidenceZ: 1.96,
      marginErrorPercent: 5,
      proportionPercent: 50,
    });
    const finite = calculateSampleSizeOracle({
      population: 1_000_000,
      confidenceZ: 1.96,
      marginErrorPercent: 5,
      proportionPercent: 50,
    });
    if (finite.requiredSample > infinite.requiredSample) {
      throw new Error("Finite population correction should not exceed infinite estimate.");
    }
  },
  "absurd-zero-margin": () => {
    try {
      calculateSampleSizeOracle({
        population: 1000,
        confidenceZ: 1.96,
        marginErrorPercent: 0,
        proportionPercent: 50,
      });
      throw new Error("Expected validation error for zero margin.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-confidence": () => {
    const low = calculateSampleSizeOracle({
      population: 10_000,
      confidenceZ: 1.645,
      marginErrorPercent: 5,
      proportionPercent: 50,
    });
    const high = calculateSampleSizeOracle({
      population: 10_000,
      confidenceZ: 2.576,
      marginErrorPercent: 5,
      proportionPercent: 50,
    });
    if (high.requiredSample <= low.requiredSample) {
      throw new Error("Higher confidence z must increase required sample.");
    }
  },
  "sensitivity-proportion": () => {
    const edge = calculateSampleSizeOracle({
      population: 5000,
      confidenceZ: 1.96,
      marginErrorPercent: 5,
      proportionPercent: 50,
    });
    const center = calculateSampleSizeOracle({
      population: 5000,
      confidenceZ: 1.96,
      marginErrorPercent: 5,
      proportionPercent: 30,
    });
    if (edge.requiredSample <= center.requiredSample) {
      throw new Error("Proportion near 50% should maximize sample need.");
    }
  },
};

export const HVAC_TONNAGE_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-office": () => {
    const result = calculateHvacTonnageRuleOracle({
      squareFootage: 2400,
      tonnage: 4,
      laborHours: 16,
    });
    if (result.recommendedTons <= 0) {
      throw new Error("Expected positive recommended tonnage.");
    }
  },
  "edge-undersized": () => {
    const result = calculateHvacTonnageRuleOracle({
      squareFootage: 4000,
      tonnage: 2,
      laborHours: 32,
    });
    if (result.totalTons <= 0) {
      throw new Error("Expected positive ASHRAE tonnage.");
    }
  },
  "absurd-zero-area": () => {
    try {
      calculateHvacTonnageRuleOracle({ squareFootage: 0, tonnage: 3, laborHours: 8 });
      throw new Error("Expected validation error for zero area.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-area": () => {
    const small = calculateHvacTonnageRuleOracle({
      squareFootage: 1500,
      tonnage: 3,
      laborHours: 10,
    });
    const large = calculateHvacTonnageRuleOracle({
      squareFootage: 3000,
      tonnage: 3,
      laborHours: 10,
    });
    if (large.recommendedTons < small.recommendedTons) {
      throw new Error("Larger area must not decrease recommended tonnage.");
    }
  },
  "sensitivity-labor": () => {
    const result = calculateHvacTonnageRuleOracle({
      squareFootage: 2200,
      tonnage: 4,
      laborHours: 48,
    });
    if (result.totalBtu <= 0) {
      throw new Error("Expected positive BTU load.");
    }
  },
};

export const ELECTRICAL_LABOR_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-panel-job": () => {
    const result = calculateElectricalLaborOracle({
      materialCost: 2800,
      laborHours: 10,
      laborRate: 78,
    });
    if (result.laborCost <= 0) {
      throw new Error("Expected positive labor cost.");
    }
  },
  "edge-labor-heavy": () => {
    const result = calculateElectricalLaborOracle({
      materialCost: 1200,
      laborHours: 20,
      laborRate: 72,
    });
    if (result.laborMaterialRatio < 50) {
      throw new Error("Long labor job should show elevated ratio.");
    }
  },
  "absurd-negative-cost": () => {
    try {
      calculateElectricalLaborOracle({ materialCost: -500, laborHours: 8, laborRate: 70 });
      throw new Error("Expected validation error for negative material.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-labor": () => {
    const base = calculateElectricalLaborOracle({
      materialCost: 2000,
      laborHours: 8,
      laborRate: 75,
    });
    const bumped = calculateElectricalLaborOracle({
      materialCost: 2000,
      laborHours: 10,
      laborRate: 75,
    });
    if (bumped.laborCost <= base.laborCost) {
      throw new Error("More labor hours must increase labor cost.");
    }
  },
  "sensitivity-rate": () => {
    const base = calculateElectricalLaborOracle({
      materialCost: 3000,
      laborHours: 12,
      laborRate: 70,
    });
    const bumped = calculateElectricalLaborOracle({
      materialCost: 3000,
      laborHours: 12,
      laborRate: 85,
    });
    if (bumped.laborMaterialRatio <= base.laborMaterialRatio) {
      throw new Error("Higher labor rate must widen labor/material ratio.");
    }
  },
};

export const LAWN_CARE_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-route": () => {
    const result = calculateLawnCareCostOracle({
      crewHoursPerVisit: 2.5,
      visitsPerMonth: 4,
      laborRate: 28,
    });
    if (result.monthlyLoad <= 0) {
      throw new Error("Expected positive monthly load.");
    }
  },
  "edge-heavy-route": () => {
    const result = calculateLawnCareCostOracle({
      crewHoursPerVisit: 5,
      visitsPerMonth: 8,
      laborRate: 32,
    });
    if (result.monthlyLoad < 40) {
      throw new Error("Heavy route should exceed 40 crew-hr/month.");
    }
  },
  "absurd-negative-visits": () => {
    try {
      calculateLawnCareCostOracle({
        crewHoursPerVisit: 2,
        visitsPerMonth: -1,
        laborRate: 25,
      });
      throw new Error("Expected validation error for negative visits.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-visits": () => {
    const base = calculateLawnCareCostOracle({
      crewHoursPerVisit: 2,
      visitsPerMonth: 4,
      laborRate: 28,
    });
    const bumped = calculateLawnCareCostOracle({
      crewHoursPerVisit: 2,
      visitsPerMonth: 6,
      laborRate: 28,
    });
    if (bumped.monthlyLoad <= base.monthlyLoad) {
      throw new Error("More visits must increase monthly load.");
    }
  },
  "sensitivity-rate": () => {
    const base = calculateLawnCareCostOracle({
      crewHoursPerVisit: 3,
      visitsPerMonth: 4,
      laborRate: 26,
    });
    const bumped = calculateLawnCareCostOracle({
      crewHoursPerVisit: 3,
      visitsPerMonth: 4,
      laborRate: 32,
    });
    if (bumped.monthlyLaborCost <= base.monthlyLaborCost) {
      throw new Error("Higher labor rate must increase monthly labor cost.");
    }
  },
};

export const REPAIR_TIME_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-brake-job": () => {
    const result = calculateRepairTimeVsPriceOracle({
      quotedPrice: 420,
      repairHours: 2.5,
      partsCost: 180,
    });
    if (result.burdenedCost <= 0) {
      throw new Error("Expected positive burdened cost.");
    }
  },
  "edge-thin-quote": () => {
    const result = calculateRepairTimeVsPriceOracle({
      quotedPrice: 300,
      repairHours: 4,
      partsCost: 220,
    });
    if (result.burdenedCost / 300 < 0.5) {
      throw new Error("Thin quote edge should show high burden ratio.");
    }
  },
  "absurd-negative-quote": () => {
    const result = calculateRepairTimeVsPriceOracle({
      quotedPrice: -100,
      repairHours: 2,
      partsCost: 150,
    });
    if (result.burdenedCost <= 0) {
      throw new Error("Expected numeric burdened cost even with negative quote input.");
    }
  },
  "directional-hours": () => {
    const base = calculateRepairTimeVsPriceOracle({
      quotedPrice: 500,
      repairHours: 2,
      partsCost: 150,
    });
    const bumped = calculateRepairTimeVsPriceOracle({
      quotedPrice: 500,
      repairHours: 4,
      partsCost: 150,
    });
    if (bumped.burdenedCost <= base.burdenedCost) {
      throw new Error("More repair hours must increase burdened cost.");
    }
  },
  "sensitivity-parts": () => {
    const base = calculateRepairTimeVsPriceOracle({
      quotedPrice: 450,
      repairHours: 3,
      partsCost: 100,
    });
    const bumped = calculateRepairTimeVsPriceOracle({
      quotedPrice: 450,
      repairHours: 3,
      partsCost: 200,
    });
    if (bumped.burdenedCost <= base.burdenedCost) {
      throw new Error("Higher parts cost must increase burdened cost.");
    }
  },
};

export const PRINT_JOB_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-signage": () => {
    const result = calculatePrintJobCostOracle({
      materialCost: 450,
      designHours: 2,
      laborRate: 65,
    });
    if (result.designCost <= 0) {
      throw new Error("Expected positive design cost.");
    }
  },
  "edge-design-heavy": () => {
    const result = calculatePrintJobCostOracle({
      materialCost: 300,
      designHours: 6,
      laborRate: 70,
    });
    if (result.designMaterialRatio < 1) {
      throw new Error("Design-heavy edge should exceed ratio 1.0.");
    }
  },
  "absurd-negative-material": () => {
    try {
      calculatePrintJobCostOracle({ materialCost: -100, designHours: 2, laborRate: 60 });
      throw new Error("Expected validation error for negative material.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-design": () => {
    const base = calculatePrintJobCostOracle({
      materialCost: 400,
      designHours: 2,
      laborRate: 65,
    });
    const bumped = calculatePrintJobCostOracle({
      materialCost: 400,
      designHours: 4,
      laborRate: 65,
    });
    if (bumped.designCost <= base.designCost) {
      throw new Error("More design hours must increase design cost.");
    }
  },
  "sensitivity-rate": () => {
    const base = calculatePrintJobCostOracle({
      materialCost: 350,
      designHours: 3,
      laborRate: 60,
    });
    const bumped = calculatePrintJobCostOracle({
      materialCost: 350,
      designHours: 3,
      laborRate: 75,
    });
    if (bumped.designCost <= base.designCost) {
      throw new Error("Higher labor rate must increase design cost.");
    }
  },
};

export const PLUMBING_MARGIN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-fixture-job": () => {
    const result = calculatePlumbingJobMarginOracle({
      partsCost: 420,
      laborHours: 6,
      laborRate: 85,
      fixtureCount: 3,
      materialRunCost: 65,
      callbackRiskPercent: 8,
      targetMargin: 25,
    });
    if (result.minimumSafePrice <= result.baseCost) {
      throw new Error("Safe price must exceed base cost.");
    }
  },
  "edge-high-callback": () => {
    const low = calculatePlumbingJobMarginOracle({
      partsCost: 600,
      laborHours: 8,
      laborRate: 88,
      fixtureCount: 4,
      materialRunCost: 90,
      callbackRiskPercent: 6,
      targetMargin: 25,
    });
    const high = calculatePlumbingJobMarginOracle({
      partsCost: 600,
      laborHours: 8,
      laborRate: 88,
      fixtureCount: 4,
      materialRunCost: 90,
      callbackRiskPercent: 18,
      targetMargin: 25,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher callback risk must increase base cost.");
    }
  },
  "absurd-zero-rate": () => {
    try {
      calculatePlumbingJobMarginOracle({
        partsCost: 300,
        laborHours: 4,
        laborRate: 0,
        fixtureCount: 2,
        materialRunCost: 40,
        callbackRiskPercent: 8,
        targetMargin: 25,
      });
      throw new Error("Expected validation error for zero labor rate.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-parts": () => {
    const base = calculatePlumbingJobMarginOracle({
      partsCost: 300,
      laborHours: 5,
      laborRate: 80,
      fixtureCount: 2,
      materialRunCost: 50,
      callbackRiskPercent: 8,
      targetMargin: 25,
    });
    const bumped = calculatePlumbingJobMarginOracle({
      partsCost: 450,
      laborHours: 5,
      laborRate: 80,
      fixtureCount: 2,
      materialRunCost: 50,
      callbackRiskPercent: 8,
      targetMargin: 25,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher parts cost must raise minimum safe price.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculatePlumbingJobMarginOracle({
      partsCost: 400,
      laborHours: 6,
      laborRate: 82,
      fixtureCount: 3,
      materialRunCost: 60,
      callbackRiskPercent: 10,
      targetMargin: 20,
    });
    const high = calculatePlumbingJobMarginOracle({
      partsCost: 400,
      laborHours: 6,
      laborRate: 82,
      fixtureCount: 3,
      materialRunCost: 60,
      callbackRiskPercent: 10,
      targetMargin: 30,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher target margin must raise minimum safe price.");
    }
  },
};

export const CABINET_COST_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-cabinet-job": () => {
    const result = calculateCabinetCostOracle({
      sheetMaterialCost: 2200,
      laborHours: 14,
      installHours: 8,
    });
    if (result.totalHours <= 0) {
      throw new Error("Expected positive total hours.");
    }
  },
  "edge-long-install": () => {
    const result = calculateCabinetCostOracle({
      sheetMaterialCost: 1800,
      laborHours: 16,
      installHours: 18,
    });
    if (result.totalHours < 24) {
      throw new Error("Long install edge should exceed 24 total hours.");
    }
  },
  "absurd-negative-hours": () => {
    try {
      calculateCabinetCostOracle({
        sheetMaterialCost: 1200,
        laborHours: -4,
        installHours: 6,
      });
      throw new Error("Expected validation error for negative hours.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-install": () => {
    const base = calculateCabinetCostOracle({
      sheetMaterialCost: 1500,
      laborHours: 10,
      installHours: 6,
    });
    const bumped = calculateCabinetCostOracle({
      sheetMaterialCost: 1500,
      laborHours: 10,
      installHours: 12,
    });
    if (bumped.totalHours <= base.totalHours) {
      throw new Error("More install hours must increase total hours.");
    }
  },
  "sensitivity-waste": () => {
    const result = calculateCabinetCostOracle({
      sheetMaterialCost: 2000,
      laborHours: 12,
      installHours: 8,
    });
    if (result.wasteAdjustedHours <= result.totalHours) {
      throw new Error("Waste-adjusted hours must exceed total hours.");
    }
  },
};

export const ROOFING_SQUARE_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-shingle-job": () => {
    const result = calculateRoofingSquareCostOracle({
      materialCost: 4200,
      laborHours: 18,
      laborRate: 42,
    });
    if (result.nrcaEstimate <= 0) {
      throw new Error("Expected positive NRCA estimate.");
    }
  },
  "edge-long-labor": () => {
    const result = calculateRoofingSquareCostOracle({
      materialCost: 5000,
      laborHours: 32,
      laborRate: 38,
    });
    if (result.laborCost < 1000) {
      throw new Error("Long labor edge should show substantial labor cost.");
    }
  },
  "absurd-negative-material": () => {
    try {
      calculateRoofingSquareCostOracle({
        materialCost: -1000,
        laborHours: 16,
        laborRate: 42,
      });
      throw new Error("Expected validation error for negative material.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-labor": () => {
    const base = calculateRoofingSquareCostOracle({
      materialCost: 3500,
      laborHours: 14,
      laborRate: 40,
    });
    const bumped = calculateRoofingSquareCostOracle({
      materialCost: 3500,
      laborHours: 20,
      laborRate: 40,
    });
    if (bumped.laborCost <= base.laborCost) {
      throw new Error("More labor hours must increase labor cost.");
    }
  },
  "sensitivity-material": () => {
    const base = calculateRoofingSquareCostOracle({
      materialCost: 3000,
      laborHours: 16,
      laborRate: 42,
    });
    const bumped = calculateRoofingSquareCostOracle({
      materialCost: 4500,
      laborHours: 16,
      laborRate: 42,
    });
    if (bumped.nrcaEstimate <= base.nrcaEstimate) {
      throw new Error("Higher material cost must increase NRCA estimate.");
    }
  },
};

export const LASER_CUTTING_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-batch": () => {
    const result = calculateLaserCuttingTimeOracle({
      setupMinutes: 18,
      cutLengthM: 12,
      cutSpeedMMin: 2.5,
      pierceCount: 8,
      pierceSeconds: 2,
    });
    if (result.totalMinutes <= 0) {
      throw new Error("Expected positive total minutes.");
    }
  },
  "normal-sheet": () => {
    const result = calculateLaserCuttingTimeOracle({
      setupMinutes: 25,
      cutLengthM: 8,
      cutSpeedMMin: 3,
      pierceCount: 4,
      pierceSeconds: 1.5,
    });
    if (result.cutMinutes <= 0) {
      throw new Error("Expected positive cut minutes.");
    }
  },
  "normal-prototype": () => {
    const setupMinutes = 35;
    const result = calculateLaserCuttingTimeOracle({
      setupMinutes,
      cutLengthM: 4,
      cutSpeedMMin: 2,
      pierceCount: 12,
      pierceSeconds: 2.5,
    });
    if (result.totalMinutes <= setupMinutes) {
      throw new Error("Total minutes must exceed setup alone.");
    }
  },
  "edge-setup-heavy": () => {
    const result = calculateLaserCuttingTimeOracle({
      setupMinutes: 60,
      cutLengthM: 3,
      cutSpeedMMin: 1.8,
      pierceCount: 20,
      pierceSeconds: 3,
    });
    if (result.totalMinutes < 60) {
      throw new Error("Setup-heavy edge must exceed setup minutes.");
    }
  },
  "absurd-zero-speed": () => {
    try {
      calculateLaserCuttingTimeOracle({
        setupMinutes: 15,
        cutLengthM: 10,
        cutSpeedMMin: 0,
        pierceCount: 5,
        pierceSeconds: 2,
      });
      throw new Error("Expected validation error for zero cut speed.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
};

export const BATCH_FREE_BATCH2_SCENARIO_HANDLERS: Record<string, Record<string, ScenarioHandler>> = {
  "sample-size-calculator": SAMPLE_SIZE_SCENARIOS,
  "hvac-tonnage-rule-check": HVAC_TONNAGE_SCENARIOS,
  "electrical-labor-estimator": ELECTRICAL_LABOR_SCENARIOS,
  "lawn-care-cost-check": LAWN_CARE_SCENARIOS,
  "repair-time-vs-price-check": REPAIR_TIME_SCENARIOS,
  "print-job-cost-check": PRINT_JOB_SCENARIOS,
  "plumbing-job-margin-verdict": PLUMBING_MARGIN_SCENARIOS,
  "cabinet-cost-estimator": CABINET_COST_SCENARIOS,
  "roofing-square-cost-check": ROOFING_SQUARE_SCENARIOS,
  "laser-cutting-time-check": LASER_CUTTING_SCENARIOS,
};
