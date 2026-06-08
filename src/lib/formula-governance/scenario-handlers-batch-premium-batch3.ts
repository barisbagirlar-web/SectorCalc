/**
 * Scenario runtime handlers for Phase 5G-D premium batch-3 tools.
 */

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
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

type ScenarioHandler = () => void;

export const HVAC_PROJECT_MARGIN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-install": () => {
    const result = calculateHvacProjectMarginGuardOracle({
      equipmentCost: 12_500,
      ductworkCost: 3200,
      laborHours: 28,
      laborRate: 78,
      commissioningCost: 450,
      callbackRiskPercent: 8,
      targetMargin: 22,
    });
    if (result.minimumSafePrice <= result.baseCost) {
      throw new Error("Safe price must exceed base cost.");
    }
  },
  "edge-high-callback": () => {
    const low = calculateHvacProjectMarginGuardOracle({
      equipmentCost: 15_000,
      ductworkCost: 4000,
      laborHours: 32,
      laborRate: 80,
      commissioningCost: 500,
      callbackRiskPercent: 6,
      targetMargin: 22,
    });
    const high = calculateHvacProjectMarginGuardOracle({
      equipmentCost: 15_000,
      ductworkCost: 4000,
      laborHours: 32,
      laborRate: 80,
      commissioningCost: 500,
      callbackRiskPercent: 16,
      targetMargin: 22,
    });
    if (high.baseCost <= low.baseCost) {
      throw new Error("Higher callback risk must increase base cost.");
    }
  },
  "absurd-zero-rate": () => {
    const result = calculateHvacProjectMarginGuardOracle({
      equipmentCost: 10_000,
      ductworkCost: 2000,
      laborHours: 20,
      laborRate: 0,
      commissioningCost: 300,
      callbackRiskPercent: 8,
      targetMargin: 22,
    });
    if (result.baseCost <= 0) {
      throw new Error("Expected non-negative base cost at zero labor rate.");
    }
  },
  "directional-equipment": () => {
    const base = calculateHvacProjectMarginGuardOracle({
      equipmentCost: 10_000,
      ductworkCost: 2500,
      laborHours: 24,
      laborRate: 75,
      commissioningCost: 400,
      callbackRiskPercent: 8,
      targetMargin: 22,
    });
    const bumped = calculateHvacProjectMarginGuardOracle({
      equipmentCost: 14_000,
      ductworkCost: 2500,
      laborHours: 24,
      laborRate: 75,
      commissioningCost: 400,
      callbackRiskPercent: 8,
      targetMargin: 22,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher equipment cost must raise minimum safe price.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculateHvacProjectMarginGuardOracle({
      equipmentCost: 11_000,
      ductworkCost: 2800,
      laborHours: 26,
      laborRate: 76,
      commissioningCost: 420,
      callbackRiskPercent: 8,
      targetMargin: 18,
    });
    const high = calculateHvacProjectMarginGuardOracle({
      equipmentCost: 11_000,
      ductworkCost: 2800,
      laborHours: 26,
      laborRate: 76,
      commissioningCost: 420,
      callbackRiskPercent: 8,
      targetMargin: 28,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher target margin must raise minimum safe price.");
    }
  },
};

export const PANEL_SHOP_MARGIN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-panel-bid": () => {
    const result = calculatePanelShopMarginVerdictOracle({
      materialCost: 4200,
      laborHours: 14,
      laborRate: 82,
      testingHours: 4,
      inspectionRiskPercent: 10,
      targetMargin: 24,
    });
    if (result.minimumSafePrice <= result.baseCost) {
      throw new Error("Safe bid must exceed base cost.");
    }
  },
  "edge-high-inspection": () => {
    const low = calculatePanelShopMarginVerdictOracle({
      materialCost: 5000,
      laborHours: 16,
      laborRate: 84,
      testingHours: 5,
      inspectionRiskPercent: 6,
      targetMargin: 24,
    });
    const high = calculatePanelShopMarginVerdictOracle({
      materialCost: 5000,
      laborHours: 16,
      laborRate: 84,
      testingHours: 5,
      inspectionRiskPercent: 18,
      targetMargin: 24,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher inspection risk must raise safe bid.");
    }
  },
  "absurd-negative-material": () => {
    try {
      calculatePanelShopMarginVerdictOracle({
        materialCost: -500,
        laborHours: 12,
        laborRate: 80,
        testingHours: 4,
        inspectionRiskPercent: 10,
        targetMargin: 24,
      });
      throw new Error("Expected validation error for negative material.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-labor": () => {
    const base = calculatePanelShopMarginVerdictOracle({
      materialCost: 3500,
      laborHours: 12,
      laborRate: 80,
      testingHours: 3,
      inspectionRiskPercent: 10,
      targetMargin: 24,
    });
    const bumped = calculatePanelShopMarginVerdictOracle({
      materialCost: 3500,
      laborHours: 16,
      laborRate: 80,
      testingHours: 3,
      inspectionRiskPercent: 10,
      targetMargin: 24,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("More labor hours must raise base cost.");
    }
  },
  "sensitivity-testing": () => {
    const base = calculatePanelShopMarginVerdictOracle({
      materialCost: 4000,
      laborHours: 14,
      laborRate: 82,
      testingHours: 2,
      inspectionRiskPercent: 10,
      targetMargin: 24,
    });
    const bumped = calculatePanelShopMarginVerdictOracle({
      materialCost: 4000,
      laborHours: 14,
      laborRate: 82,
      testingHours: 6,
      inspectionRiskPercent: 10,
      targetMargin: 24,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("More testing hours must raise base cost.");
    }
  },
};

export const LANDSCAPING_CONTRACT_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-route": () => {
    const result = calculateLandscapingContractProfitOracle({
      crewHoursPerVisit: 2.5,
      laborRate: 28,
      fuelCostPerVisit: 18,
      supplyCostPerMonth: 120,
      visitsPerMonth: 4,
      equipmentWearCost: 85,
      targetMargin: 20,
    });
    if (result.minimumSafePrice <= 0) {
      throw new Error("Expected positive minimum monthly price.");
    }
  },
  "edge-heavy-route": () => {
    const light = calculateLandscapingContractProfitOracle({
      crewHoursPerVisit: 2,
      laborRate: 28,
      fuelCostPerVisit: 15,
      supplyCostPerMonth: 100,
      visitsPerMonth: 4,
      equipmentWearCost: 70,
      targetMargin: 20,
    });
    const heavy = calculateLandscapingContractProfitOracle({
      crewHoursPerVisit: 4.5,
      laborRate: 32,
      fuelCostPerVisit: 28,
      supplyCostPerMonth: 180,
      visitsPerMonth: 8,
      equipmentWearCost: 150,
      targetMargin: 20,
    });
    if (heavy.baseCost <= light.baseCost) {
      throw new Error("Heavier route must increase base cost.");
    }
  },
  "absurd-negative-visits": () => {
    try {
      calculateLandscapingContractProfitOracle({
        crewHoursPerVisit: 2,
        laborRate: 28,
        fuelCostPerVisit: 15,
        supplyCostPerMonth: 100,
        visitsPerMonth: -2,
        equipmentWearCost: 80,
        targetMargin: 20,
      });
      throw new Error("Expected validation error for negative visits.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-labor": () => {
    const base = calculateLandscapingContractProfitOracle({
      crewHoursPerVisit: 2,
      laborRate: 28,
      fuelCostPerVisit: 15,
      supplyCostPerMonth: 100,
      visitsPerMonth: 4,
      equipmentWearCost: 80,
      targetMargin: 20,
    });
    const bumped = calculateLandscapingContractProfitOracle({
      crewHoursPerVisit: 3,
      laborRate: 28,
      fuelCostPerVisit: 15,
      supplyCostPerMonth: 100,
      visitsPerMonth: 4,
      equipmentWearCost: 80,
      targetMargin: 20,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("More crew hours must raise base cost.");
    }
  },
  "sensitivity-margin": () => {
    const low = calculateLandscapingContractProfitOracle({
      crewHoursPerVisit: 2.5,
      laborRate: 28,
      fuelCostPerVisit: 18,
      supplyCostPerMonth: 120,
      visitsPerMonth: 4,
      equipmentWearCost: 85,
      targetMargin: 16,
    });
    const high = calculateLandscapingContractProfitOracle({
      crewHoursPerVisit: 2.5,
      laborRate: 28,
      fuelCostPerVisit: 18,
      supplyCostPerMonth: 120,
      visitsPerMonth: 4,
      equipmentWearCost: 85,
      targetMargin: 26,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher target margin must raise bid price.");
    }
  },
};

export const AUTO_SHOP_MARGIN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-brake-job": () => {
    const result = calculateAutoShopMarginLeakOracle({
      quotedPrice: 420,
      diagnosticHours: 0.5,
      repairHours: 2.5,
      laborRate: 95,
      partsCost: 180,
      comebackRiskPercent: 10,
      partsMarkupPercent: 30,
    });
    if (result.baseCost <= 0) {
      throw new Error("Expected positive job base cost.");
    }
  },
  "edge-high-comeback": () => {
    const low = calculateAutoShopMarginLeakOracle({
      quotedPrice: 600,
      diagnosticHours: 1,
      repairHours: 5,
      laborRate: 100,
      partsCost: 250,
      comebackRiskPercent: 8,
      partsMarkupPercent: 30,
    });
    const high = calculateAutoShopMarginLeakOracle({
      quotedPrice: 600,
      diagnosticHours: 1,
      repairHours: 5,
      laborRate: 100,
      partsCost: 250,
      comebackRiskPercent: 20,
      partsMarkupPercent: 30,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher comeback risk must raise safe price.");
    }
  },
  "absurd-negative-parts": () => {
    try {
      calculateAutoShopMarginLeakOracle({
        quotedPrice: 400,
        diagnosticHours: 1,
        repairHours: 3,
        laborRate: 95,
        partsCost: -100,
        comebackRiskPercent: 12,
        partsMarkupPercent: 30,
      });
      throw new Error("Expected validation error for negative parts cost.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-parts": () => {
    const base = calculateAutoShopMarginLeakOracle({
      quotedPrice: 500,
      diagnosticHours: 1,
      repairHours: 4,
      laborRate: 98,
      partsCost: 200,
      comebackRiskPercent: 12,
      partsMarkupPercent: 30,
    });
    const bumped = calculateAutoShopMarginLeakOracle({
      quotedPrice: 500,
      diagnosticHours: 1,
      repairHours: 4,
      laborRate: 98,
      partsCost: 320,
      comebackRiskPercent: 12,
      partsMarkupPercent: 30,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("Higher parts cost must raise base cost.");
    }
  },
  "sensitivity-labor": () => {
    const base = calculateAutoShopMarginLeakOracle({
      quotedPrice: 500,
      diagnosticHours: 0.5,
      repairHours: 3,
      laborRate: 90,
      partsCost: 180,
      comebackRiskPercent: 12,
      partsMarkupPercent: 30,
    });
    const bumped = calculateAutoShopMarginLeakOracle({
      quotedPrice: 500,
      diagnosticHours: 0.5,
      repairHours: 5,
      laborRate: 90,
      partsCost: 180,
      comebackRiskPercent: 12,
      partsMarkupPercent: 30,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("More labor hours must raise base cost.");
    }
  },
};

export const SIGNAGE_BID_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-signage": () => {
    const result = calculateSignageBidSafePriceOracle({
      materialCost: 1200,
      inkCost: 180,
      designHours: 4,
      laborRate: 65,
      installHours: 6,
      reprintRiskPercent: 8,
      targetMargin: 28,
    });
    if (result.minimumSafePrice <= result.baseCost) {
      throw new Error("Safe price must exceed base cost.");
    }
  },
  "edge-high-reprint": () => {
    const low = calculateSignageBidSafePriceOracle({
      materialCost: 1500,
      inkCost: 220,
      designHours: 5,
      laborRate: 68,
      installHours: 8,
      reprintRiskPercent: 6,
      targetMargin: 28,
    });
    const high = calculateSignageBidSafePriceOracle({
      materialCost: 1500,
      inkCost: 220,
      designHours: 5,
      laborRate: 68,
      installHours: 8,
      reprintRiskPercent: 16,
      targetMargin: 28,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher reprint risk must raise safe price.");
    }
  },
  "absurd-negative-ink": () => {
    try {
      calculateSignageBidSafePriceOracle({
        materialCost: 800,
        inkCost: -50,
        designHours: 3,
        laborRate: 60,
        installHours: 4,
        reprintRiskPercent: 8,
        targetMargin: 28,
      });
      throw new Error("Expected validation error for negative ink cost.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-install": () => {
    const base = calculateSignageBidSafePriceOracle({
      materialCost: 1000,
      inkCost: 150,
      designHours: 3,
      laborRate: 62,
      installHours: 4,
      reprintRiskPercent: 8,
      targetMargin: 28,
    });
    const bumped = calculateSignageBidSafePriceOracle({
      materialCost: 1000,
      inkCost: 150,
      designHours: 3,
      laborRate: 62,
      installHours: 8,
      reprintRiskPercent: 8,
      targetMargin: 28,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("More install hours must raise base cost.");
    }
  },
  "sensitivity-material": () => {
    const base = calculateSignageBidSafePriceOracle({
      materialCost: 900,
      inkCost: 140,
      designHours: 3,
      laborRate: 60,
      installHours: 5,
      reprintRiskPercent: 8,
      targetMargin: 28,
    });
    const bumped = calculateSignageBidSafePriceOracle({
      materialCost: 1400,
      inkCost: 140,
      designHours: 3,
      laborRate: 60,
      installHours: 5,
      reprintRiskPercent: 8,
      targetMargin: 28,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("Higher material cost must raise base cost.");
    }
  },
};

export const MILLWORK_BID_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-millwork": () => {
    const result = calculateMillworkBidRiskOracle({
      sheetMaterialCost: 3200,
      laborHours: 18,
      laborRate: 72,
      finishingCost: 850,
      installHours: 10,
      wasteRatePercent: 12,
      targetMargin: 26,
    });
    if (result.minimumSafePrice <= result.baseCost) {
      throw new Error("Minimum bid must exceed base cost.");
    }
  },
  "edge-high-waste": () => {
    const low = calculateMillworkBidRiskOracle({
      sheetMaterialCost: 3600,
      laborHours: 20,
      laborRate: 74,
      finishingCost: 900,
      installHours: 12,
      wasteRatePercent: 10,
      targetMargin: 26,
    });
    const high = calculateMillworkBidRiskOracle({
      sheetMaterialCost: 3600,
      laborHours: 20,
      laborRate: 74,
      finishingCost: 900,
      installHours: 12,
      wasteRatePercent: 18,
      targetMargin: 26,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher waste rate must raise safe bid.");
    }
  },
  "absurd-negative-material": () => {
    try {
      calculateMillworkBidRiskOracle({
        sheetMaterialCost: -800,
        laborHours: 16,
        laborRate: 70,
        finishingCost: 600,
        installHours: 8,
        wasteRatePercent: 12,
        targetMargin: 26,
      });
      throw new Error("Expected validation error for negative material.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-labor": () => {
    const base = calculateMillworkBidRiskOracle({
      sheetMaterialCost: 2800,
      laborHours: 16,
      laborRate: 70,
      finishingCost: 700,
      installHours: 8,
      wasteRatePercent: 12,
      targetMargin: 26,
    });
    const bumped = calculateMillworkBidRiskOracle({
      sheetMaterialCost: 2800,
      laborHours: 22,
      laborRate: 70,
      finishingCost: 700,
      installHours: 8,
      wasteRatePercent: 12,
      targetMargin: 26,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("More labor hours must raise base cost.");
    }
  },
  "sensitivity-finish": () => {
    const base = calculateMillworkBidRiskOracle({
      sheetMaterialCost: 3000,
      laborHours: 18,
      laborRate: 72,
      finishingCost: 600,
      installHours: 10,
      wasteRatePercent: 12,
      targetMargin: 26,
    });
    const bumped = calculateMillworkBidRiskOracle({
      sheetMaterialCost: 3000,
      laborHours: 18,
      laborRate: 72,
      finishingCost: 1100,
      installHours: 10,
      wasteRatePercent: 12,
      targetMargin: 26,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("Higher finishing cost must raise safe bid.");
    }
  },
};

export const ROOFING_MARGIN_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-shingle": () => {
    const result = calculateRoofingContractMarginGuardOracle({
      materialCost: 6200,
      laborHours: 24,
      laborRate: 42,
      tearOffCost: 1800,
      dumpFees: 450,
      weatherDelayRiskPercent: 10,
      targetMargin: 22,
    });
    if (result.minimumSafePrice <= result.baseCost) {
      throw new Error("Minimum bid must exceed base cost.");
    }
  },
  "edge-weather-risk": () => {
    const low = calculateRoofingContractMarginGuardOracle({
      materialCost: 7000,
      laborHours: 26,
      laborRate: 43,
      tearOffCost: 2000,
      dumpFees: 500,
      weatherDelayRiskPercent: 6,
      targetMargin: 22,
    });
    const high = calculateRoofingContractMarginGuardOracle({
      materialCost: 7000,
      laborHours: 26,
      laborRate: 43,
      tearOffCost: 2000,
      dumpFees: 500,
      weatherDelayRiskPercent: 18,
      targetMargin: 22,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher weather risk must raise safe bid.");
    }
  },
  "absurd-negative-labor": () => {
    try {
      calculateRoofingContractMarginGuardOracle({
        materialCost: 5000,
        laborHours: -4,
        laborRate: 42,
        tearOffCost: 1500,
        dumpFees: 400,
        weatherDelayRiskPercent: 10,
        targetMargin: 22,
      });
      throw new Error("Expected validation error for negative labor hours.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-squares": () => {
    const base = calculateRoofingContractMarginGuardOracle({
      materialCost: 5000,
      laborHours: 20,
      laborRate: 42,
      tearOffCost: 1500,
      dumpFees: 400,
      weatherDelayRiskPercent: 10,
      targetMargin: 22,
    });
    const bumped = calculateRoofingContractMarginGuardOracle({
      materialCost: 7500,
      laborHours: 20,
      laborRate: 42,
      tearOffCost: 1500,
      dumpFees: 400,
      weatherDelayRiskPercent: 10,
      targetMargin: 22,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("Higher material cost must raise base cost.");
    }
  },
  "sensitivity-tearoff": () => {
    const base = calculateRoofingContractMarginGuardOracle({
      materialCost: 6000,
      laborHours: 24,
      laborRate: 42,
      tearOffCost: 1200,
      dumpFees: 450,
      weatherDelayRiskPercent: 10,
      targetMargin: 22,
    });
    const bumped = calculateRoofingContractMarginGuardOracle({
      materialCost: 6000,
      laborHours: 24,
      laborRate: 42,
      tearOffCost: 2400,
      dumpFees: 450,
      weatherDelayRiskPercent: 10,
      targetMargin: 22,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("Higher tear-off cost must raise base cost.");
    }
  },
};

export const PAINTING_JOB_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-interior": () => {
    const result = calculatePaintingJobProfitVerdictOracle({
      paintCost: 680,
      prepHours: 6,
      laborRate: 48,
      scaffoldCost: 0,
      touchUpRiskPercent: 8,
      areaSize: 2400,
      targetMargin: 24,
    });
    if (result.minimumSafePrice <= result.baseCost) {
      throw new Error("Minimum price must exceed base cost.");
    }
  },
  "edge-high-touchup": () => {
    const low = calculatePaintingJobProfitVerdictOracle({
      paintCost: 900,
      prepHours: 8,
      laborRate: 50,
      scaffoldCost: 300,
      touchUpRiskPercent: 6,
      areaSize: 2800,
      targetMargin: 24,
    });
    const high = calculatePaintingJobProfitVerdictOracle({
      paintCost: 900,
      prepHours: 8,
      laborRate: 50,
      scaffoldCost: 300,
      touchUpRiskPercent: 16,
      areaSize: 2800,
      targetMargin: 24,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher touch-up risk must raise safe price.");
    }
  },
  "absurd-negative-area": () => {
    try {
      calculatePaintingJobProfitVerdictOracle({
        paintCost: 500,
        prepHours: 4,
        laborRate: 45,
        scaffoldCost: 0,
        touchUpRiskPercent: 8,
        areaSize: -100,
        targetMargin: 24,
      });
      throw new Error("Expected validation error for negative area.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-area": () => {
    const base = calculatePaintingJobProfitVerdictOracle({
      paintCost: 600,
      prepHours: 5,
      laborRate: 46,
      scaffoldCost: 0,
      touchUpRiskPercent: 8,
      areaSize: 1800,
      targetMargin: 24,
    });
    const bumped = calculatePaintingJobProfitVerdictOracle({
      paintCost: 600,
      prepHours: 5,
      laborRate: 46,
      scaffoldCost: 0,
      touchUpRiskPercent: 8,
      areaSize: 3200,
      targetMargin: 24,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("Larger area must raise base cost.");
    }
  },
  "sensitivity-prep": () => {
    const base = calculatePaintingJobProfitVerdictOracle({
      paintCost: 700,
      prepHours: 4,
      laborRate: 48,
      scaffoldCost: 200,
      touchUpRiskPercent: 8,
      areaSize: 2200,
      targetMargin: 24,
    });
    const bumped = calculatePaintingJobProfitVerdictOracle({
      paintCost: 700,
      prepHours: 10,
      laborRate: 48,
      scaffoldCost: 200,
      touchUpRiskPercent: 8,
      areaSize: 2200,
      targetMargin: 24,
    });
    if (bumped.minimumSafePrice <= base.minimumSafePrice) {
      throw new Error("More prep hours must raise safe price.");
    }
  },
};

export const SHEET_METAL_QUOTE_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-fabrication": () => {
    const result = calculateSheetMetalQuoteRiskOracle({
      programmingTime: 45,
      setupTime: 30,
      cutTime: 55,
      bendCount: 8,
      laborRate: 72,
      materialCost: 420,
      scrapRatePercent: 8,
      finishingCost: 120,
      targetMargin: 25,
    });
    if (result.minimumSafePrice <= result.baseCost) {
      throw new Error("Safe quote must exceed base cost.");
    }
  },
  "edge-high-scrap": () => {
    const low = calculateSheetMetalQuoteRiskOracle({
      programmingTime: 50,
      setupTime: 35,
      cutTime: 70,
      bendCount: 10,
      laborRate: 74,
      materialCost: 500,
      scrapRatePercent: 8,
      finishingCost: 140,
      targetMargin: 25,
    });
    const high = calculateSheetMetalQuoteRiskOracle({
      programmingTime: 50,
      setupTime: 35,
      cutTime: 70,
      bendCount: 10,
      laborRate: 74,
      materialCost: 500,
      scrapRatePercent: 16,
      finishingCost: 140,
      targetMargin: 25,
    });
    if (high.minimumSafePrice <= low.minimumSafePrice) {
      throw new Error("Higher scrap rate must raise safe quote.");
    }
  },
  "absurd-negative-bend": () => {
    try {
      calculateSheetMetalQuoteRiskOracle({
        programmingTime: 40,
        setupTime: 30,
        cutTime: 50,
        bendCount: -2,
        laborRate: 70,
        materialCost: 400,
        scrapRatePercent: 8,
        finishingCost: 100,
        targetMargin: 25,
      });
      throw new Error("Expected validation error for negative bend count.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-material": () => {
    const base = calculateSheetMetalQuoteRiskOracle({
      programmingTime: 40,
      setupTime: 30,
      cutTime: 50,
      bendCount: 8,
      laborRate: 70,
      materialCost: 350,
      scrapRatePercent: 8,
      finishingCost: 100,
      targetMargin: 25,
    });
    const bumped = calculateSheetMetalQuoteRiskOracle({
      programmingTime: 40,
      setupTime: 30,
      cutTime: 50,
      bendCount: 8,
      laborRate: 70,
      materialCost: 550,
      scrapRatePercent: 8,
      finishingCost: 100,
      targetMargin: 25,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("Higher material cost must raise base cost.");
    }
  },
  "sensitivity-setup": () => {
    const base = calculateSheetMetalQuoteRiskOracle({
      programmingTime: 35,
      setupTime: 25,
      cutTime: 45,
      bendCount: 6,
      laborRate: 72,
      materialCost: 400,
      scrapRatePercent: 8,
      finishingCost: 110,
      targetMargin: 25,
    });
    const bumped = calculateSheetMetalQuoteRiskOracle({
      programmingTime: 35,
      setupTime: 55,
      cutTime: 45,
      bendCount: 6,
      laborRate: 72,
      materialCost: 400,
      scrapRatePercent: 8,
      finishingCost: 110,
      targetMargin: 25,
    });
    if (bumped.baseCost <= base.baseCost) {
      throw new Error("Higher setup time must raise base cost.");
    }
  },
};

export const THREE_D_PRINT_COST_SCENARIOS: Record<string, ScenarioHandler> = {
  "normal-print-job": () => {
    const result = calculate3dPrintCostOracle({
      materialCost: 45,
      printHours: 6,
      machineRate: 12,
      postProcessHours: 1.5,
      laborRate: 35,
    });
    if (result.estimatedCost <= 0) {
      throw new Error("Expected positive estimated cost.");
    }
  },
  "edge-long-print": () => {
    const short = calculate3dPrintCostOracle({
      materialCost: 40,
      printHours: 4,
      machineRate: 12,
      postProcessHours: 1,
      laborRate: 35,
    });
    const long = calculate3dPrintCostOracle({
      materialCost: 40,
      printHours: 18,
      machineRate: 12,
      postProcessHours: 1,
      laborRate: 35,
    });
    if (long.estimatedCost <= short.estimatedCost) {
      throw new Error("Longer print must increase estimated cost.");
    }
  },
  "absurd-negative-material": () => {
    try {
      calculate3dPrintCostOracle({
        materialCost: -20,
        printHours: 5,
        machineRate: 12,
        postProcessHours: 1,
        laborRate: 35,
      });
      throw new Error("Expected validation error for negative material.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "directional-hours": () => {
    const base = calculate3dPrintCostOracle({
      materialCost: 50,
      printHours: 4,
      machineRate: 12,
      postProcessHours: 1,
      laborRate: 35,
    });
    const bumped = calculate3dPrintCostOracle({
      materialCost: 50,
      printHours: 8,
      machineRate: 12,
      postProcessHours: 1,
      laborRate: 35,
    });
    if (bumped.estimatedCost <= base.estimatedCost) {
      throw new Error("More print hours must raise estimated cost.");
    }
  },
  "sensitivity-post": () => {
    const base = calculate3dPrintCostOracle({
      materialCost: 50,
      printHours: 5,
      machineRate: 12,
      postProcessHours: 0.5,
      laborRate: 35,
    });
    const bumped = calculate3dPrintCostOracle({
      materialCost: 50,
      printHours: 5,
      machineRate: 12,
      postProcessHours: 3,
      laborRate: 35,
    });
    if (bumped.estimatedCost <= base.estimatedCost) {
      throw new Error("More post-process hours must raise estimated cost.");
    }
  },
};

export const BATCH_PREMIUM_BATCH3_SCENARIO_HANDLERS: Record<string, Record<string, ScenarioHandler>> = {
  "hvac-project-margin-guard": HVAC_PROJECT_MARGIN_SCENARIOS,
  "panel-shop-margin-verdict": PANEL_SHOP_MARGIN_SCENARIOS,
  "landscaping-contract-profit-tool": LANDSCAPING_CONTRACT_SCENARIOS,
  "auto-shop-margin-leak-detector": AUTO_SHOP_MARGIN_SCENARIOS,
  "signage-bid-safe-price-tool": SIGNAGE_BID_SCENARIOS,
  "millwork-bid-risk-analyzer": MILLWORK_BID_SCENARIOS,
  "roofing-contract-margin-guard": ROOFING_MARGIN_SCENARIOS,
  "painting-job-profit-verdict": PAINTING_JOB_SCENARIOS,
  "sheet-metal-quote-risk-tool": SHEET_METAL_QUOTE_SCENARIOS,
  "3d-print-cost-check": THREE_D_PRINT_COST_SCENARIOS,
};
