/**
 * Batch premium batch-3 production vs oracle comparison (Phase 5G-D).
 */

import type { CalculatorInputValues } from "@/lib/calculators/registry";
import type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";
import type { PremiumInputValues } from "@/lib/tools/premium-decision-engine";
import {
  BATCH_PREMIUM_BATCH3_ORACLE_SLUGS,
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
  isBatchPremiumBatch3OracleSlug,
  type BatchPremiumBatch3OracleSlug,
} from "@/lib/formula-governance/oracle/batch-premium-batch3-oracles";
import {
  adaptProductionBatchPremiumBatch3Output,
  type Normalized3dPrintCostProductionOutput,
  type NormalizedBatchPremiumBatch3ProductionOutput,
  type NormalizedPremiumMarginProductionOutput,
} from "@/lib/formula-governance/oracle/production-adapters";
import {
  BATCH_PREMIUM_BATCH3_PRODUCTION_FORMULA_LOCATORS,
  getBatchPremiumBatch3ProductionFormulaLocator,
} from "@/lib/formula-governance/oracle/production-formula-locator";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";
import type {
  FieldComparisonDiff,
  OracleComparisonAuditSummary,
  OracleComparisonResult,
  OracleComparisonStatus,
} from "@/lib/formula-governance/oracle/compare-production-oracle";

const CURRENCY_TOLERANCE = 0.01;

function compareNumericFields(fields: readonly {
  readonly field: string;
  readonly production: number;
  readonly oracle: number;
  readonly tolerance: number;
}[]): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  const diffs: FieldComparisonDiff[] = [];
  for (const entry of fields) {
    const delta = Math.abs(entry.production - entry.oracle);
    if (delta > entry.tolerance) {
      diffs.push({
        field: entry.field,
        production: entry.production,
        oracle: entry.oracle,
        delta,
        tolerance: entry.tolerance,
      });
    }
  }
  return { passed: diffs.length === 0, diffs };
}

export { BATCH_PREMIUM_BATCH3_ORACLE_SLUGS };
export { BATCH_PREMIUM_BATCH3_PRODUCTION_FORMULA_LOCATORS };

export type BatchPremiumBatch3ComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: CalculatorInputValues | FreeTrafficInputValues | PremiumInputValues;
  readonly expectPass?: boolean;
};

const PREMIUM_MARGIN_SLUGS = [
  "hvac-project-margin-guard",
  "panel-shop-margin-verdict",
  "landscaping-contract-profit-tool",
  "auto-shop-margin-leak-detector",
  "signage-bid-safe-price-tool",
  "millwork-bid-risk-analyzer",
  "roofing-contract-margin-guard",
  "painting-job-profit-verdict",
  "sheet-metal-quote-risk-tool",
] as const;

type PremiumMarginSlug = (typeof PREMIUM_MARGIN_SLUGS)[number];

function isPremiumMarginSlug(slug: BatchPremiumBatch3OracleSlug): slug is PremiumMarginSlug {
  return (PREMIUM_MARGIN_SLUGS as readonly string[]).includes(slug);
}

function buildBatchPremiumBatch3OracleOutput(
  slug: BatchPremiumBatch3OracleSlug,
  values: CalculatorInputValues | FreeTrafficInputValues | PremiumInputValues,
): NormalizedBatchPremiumBatch3ProductionOutput {
  switch (slug) {
    case "hvac-project-margin-guard":
      return calculateHvacProjectMarginGuardOracle({
        equipmentCost: Number(values.equipmentCost),
        ductworkCost: Number(values.ductworkCost),
        laborHours: Number(values.laborHours),
        laborRate: Number(values.laborRate),
        commissioningCost: Number(values.commissioningCost),
        callbackRiskPercent: Number(values.callbackRiskPercent),
        targetMargin: Number(values.targetMargin),
      });
    case "panel-shop-margin-verdict":
      return calculatePanelShopMarginVerdictOracle({
        materialCost: Number(values.materialCost),
        laborHours: Number(values.laborHours),
        laborRate: Number(values.laborRate),
        testingHours: Number(values.testingHours),
        inspectionRiskPercent: Number(values.inspectionRiskPercent),
        targetMargin: Number(values.targetMargin),
      });
    case "landscaping-contract-profit-tool":
      return calculateLandscapingContractProfitOracle({
        crewHoursPerVisit: Number(values.crewHoursPerVisit),
        laborRate: Number(values.laborRate),
        fuelCostPerVisit: Number(values.fuelCostPerVisit),
        supplyCostPerMonth: Number(values.supplyCostPerMonth),
        visitsPerMonth: Number(values.visitsPerMonth),
        equipmentWearCost: Number(values.equipmentWearCost),
        targetMargin: Number(values.targetMargin),
      });
    case "auto-shop-margin-leak-detector":
      return calculateAutoShopMarginLeakOracle({
        quotedPrice: Number(values.quotedPrice),
        diagnosticHours: Number(values.diagnosticHours),
        repairHours: Number(values.repairHours),
        laborRate: Number(values.laborRate),
        partsCost: Number(values.partsCost),
        comebackRiskPercent: Number(values.comebackRiskPercent),
        partsMarkupPercent: Number(values.partsMarkupPercent),
      });
    case "signage-bid-safe-price-tool":
      return calculateSignageBidSafePriceOracle({
        materialCost: Number(values.materialCost),
        inkCost: Number(values.inkCost),
        designHours: Number(values.designHours),
        laborRate: Number(values.laborRate),
        installHours: Number(values.installHours),
        reprintRiskPercent: Number(values.reprintRiskPercent),
        targetMargin: Number(values.targetMargin),
      });
    case "millwork-bid-risk-analyzer":
      return calculateMillworkBidRiskOracle({
        sheetMaterialCost: Number(values.sheetMaterialCost),
        laborHours: Number(values.laborHours),
        laborRate: Number(values.laborRate),
        finishingCost: Number(values.finishingCost),
        installHours: Number(values.installHours),
        wasteRatePercent: Number(values.wasteRatePercent),
        targetMargin: Number(values.targetMargin),
      });
    case "roofing-contract-margin-guard":
      return calculateRoofingContractMarginGuardOracle({
        materialCost: Number(values.materialCost),
        laborHours: Number(values.laborHours),
        laborRate: Number(values.laborRate),
        tearOffCost: Number(values.tearOffCost),
        dumpFees: Number(values.dumpFees),
        weatherDelayRiskPercent: Number(values.weatherDelayRiskPercent),
        targetMargin: Number(values.targetMargin),
      });
    case "painting-job-profit-verdict":
      return calculatePaintingJobProfitVerdictOracle({
        paintCost: Number(values.paintCost),
        prepHours: Number(values.prepHours),
        laborRate: Number(values.laborRate),
        scaffoldCost: Number(values.scaffoldCost),
        touchUpRiskPercent: Number(values.touchUpRiskPercent),
        areaSize: Number(values.areaSize),
        targetMargin: Number(values.targetMargin),
      });
    case "sheet-metal-quote-risk-tool":
      return calculateSheetMetalQuoteRiskOracle({
        programmingTime: Number(values.programmingTime),
        setupTime: Number(values.setupTime),
        cutTime: Number(values.cutTime),
        bendCount: Number(values.bendCount),
        laborRate: Number(values.laborRate),
        materialCost: Number(values.materialCost),
        scrapRatePercent: Number(values.scrapRatePercent),
        finishingCost: Number(values.finishingCost),
        targetMargin: Number(values.targetMargin),
      });
    case "3d-print-cost-check":
      return calculate3dPrintCostOracle({
        materialCost: Number(values.materialCost),
        printHours: Number(values.printHours),
        machineRate: Number(values.machineRate),
        postProcessHours: Number(values.postProcessHours),
        laborRate: Number(values.laborRate),
      });
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported batch premium batch-3 slug: ${unsupported}`);
    }
  }
}

function compareBatchPremiumBatch3Normalized(
  slug: BatchPremiumBatch3OracleSlug,
  production: NormalizedBatchPremiumBatch3ProductionOutput,
  oracle: NormalizedBatchPremiumBatch3ProductionOutput,
): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  if (slug === "3d-print-cost-check") {
    const prod = production as Normalized3dPrintCostProductionOutput;
    const orc = oracle as Normalized3dPrintCostProductionOutput;
    return compareNumericFields([
      {
        field: "estimatedCost",
        production: prod.estimatedCost,
        oracle: orc.estimatedCost,
        tolerance: CURRENCY_TOLERANCE,
      },
      {
        field: "machineTimeCost",
        production: prod.machineTimeCost,
        oracle: orc.machineTimeCost,
        tolerance: CURRENCY_TOLERANCE,
      },
    ]);
  }

  if (isPremiumMarginSlug(slug)) {
    const prod = production as NormalizedPremiumMarginProductionOutput;
    const orc = oracle as NormalizedPremiumMarginProductionOutput;
    return compareNumericFields([
      {
        field: "baseCost",
        production: prod.baseCost,
        oracle: orc.baseCost,
        tolerance: CURRENCY_TOLERANCE,
      },
      {
        field: "p90Cost",
        production: prod.p90Cost,
        oracle: orc.p90Cost,
        tolerance: CURRENCY_TOLERANCE,
      },
      {
        field: "minimumSafePrice",
        production: prod.minimumSafePrice,
        oracle: orc.minimumSafePrice,
        tolerance: CURRENCY_TOLERANCE,
      },
    ]);
  }

  const unsupported: never = slug;
  throw new Error(`Unsupported slug: ${unsupported}`);
}

export const BATCH_PREMIUM_BATCH3_COMPARISON_SCENARIOS: Record<
  BatchPremiumBatch3OracleSlug,
  readonly BatchPremiumBatch3ComparisonScenario[]
> = {
  "hvac-project-margin-guard": [
    {
      id: "normal-install",
      kind: "normal",
      values: {
        equipmentCost: 12_500,
        ductworkCost: 3200,
        laborHours: 28,
        laborRate: 78,
        commissioningCost: 450,
        callbackRiskPercent: 8,
        targetMargin: 22,
      },
    },
    {
      id: "normal-retrofit",
      kind: "normal",
      values: {
        equipmentCost: 8500,
        ductworkCost: 1800,
        laborHours: 18,
        laborRate: 72,
        commissioningCost: 300,
        callbackRiskPercent: 6,
        targetMargin: 20,
      },
    },
    {
      id: "normal-commercial",
      kind: "normal",
      values: {
        equipmentCost: 22_000,
        ductworkCost: 5400,
        laborHours: 42,
        laborRate: 85,
        commissioningCost: 800,
        callbackRiskPercent: 10,
        targetMargin: 24,
      },
    },
    {
      id: "edge-high-callback",
      kind: "edge",
      values: {
        equipmentCost: 15_000,
        ductworkCost: 4000,
        laborHours: 32,
        laborRate: 80,
        commissioningCost: 500,
        callbackRiskPercent: 16,
        targetMargin: 25,
      },
    },
    {
      id: "absurd-negative-equipment",
      kind: "absurd",
      values: {
        equipmentCost: -1000,
        ductworkCost: 2000,
        laborHours: 20,
        laborRate: 75,
        commissioningCost: 300,
        callbackRiskPercent: 8,
        targetMargin: 22,
      },
      expectPass: false,
    },
  ],
  "panel-shop-margin-verdict": [
    {
      id: "normal-panel-bid",
      kind: "normal",
      values: {
        materialCost: 4200,
        laborHours: 14,
        laborRate: 82,
        testingHours: 4,
        inspectionRiskPercent: 10,
        targetMargin: 24,
      },
    },
    {
      id: "normal-shop-upgrade",
      kind: "normal",
      values: {
        materialCost: 2800,
        laborHours: 10,
        laborRate: 76,
        testingHours: 3,
        inspectionRiskPercent: 8,
        targetMargin: 22,
      },
    },
    {
      id: "normal-commercial-panel",
      kind: "normal",
      values: {
        materialCost: 7500,
        laborHours: 22,
        laborRate: 88,
        testingHours: 6,
        inspectionRiskPercent: 12,
        targetMargin: 26,
      },
    },
    {
      id: "edge-high-inspection",
      kind: "edge",
      values: {
        materialCost: 5000,
        laborHours: 16,
        laborRate: 84,
        testingHours: 5,
        inspectionRiskPercent: 18,
        targetMargin: 25,
      },
    },
    {
      id: "absurd-negative-material",
      kind: "absurd",
      values: {
        materialCost: -500,
        laborHours: 12,
        laborRate: 80,
        testingHours: 4,
        inspectionRiskPercent: 10,
        targetMargin: 24,
      },
      expectPass: false,
    },
  ],
  "landscaping-contract-profit-tool": [
    {
      id: "normal-route",
      kind: "normal",
      values: {
        crewHoursPerVisit: 2.5,
        laborRate: 28,
        fuelCostPerVisit: 18,
        supplyCostPerMonth: 120,
        visitsPerMonth: 4,
        equipmentWearCost: 85,
        targetMargin: 20,
      },
    },
    {
      id: "normal-weekly",
      kind: "normal",
      values: {
        crewHoursPerVisit: 1.8,
        laborRate: 26,
        fuelCostPerVisit: 12,
        supplyCostPerMonth: 90,
        visitsPerMonth: 4,
        equipmentWearCost: 60,
        targetMargin: 18,
      },
    },
    {
      id: "normal-biweekly",
      kind: "normal",
      values: {
        crewHoursPerVisit: 3.2,
        laborRate: 30,
        fuelCostPerVisit: 22,
        supplyCostPerMonth: 140,
        visitsPerMonth: 2,
        equipmentWearCost: 95,
        targetMargin: 22,
      },
    },
    {
      id: "edge-heavy-route",
      kind: "edge",
      values: {
        crewHoursPerVisit: 4.5,
        laborRate: 32,
        fuelCostPerVisit: 28,
        supplyCostPerMonth: 180,
        visitsPerMonth: 8,
        equipmentWearCost: 150,
        targetMargin: 24,
      },
    },
    {
      id: "absurd-negative-visits",
      kind: "absurd",
      values: {
        crewHoursPerVisit: 2,
        laborRate: 28,
        fuelCostPerVisit: 15,
        supplyCostPerMonth: 100,
        visitsPerMonth: -2,
        equipmentWearCost: 80,
        targetMargin: 20,
      },
      expectPass: false,
    },
  ],
  "auto-shop-margin-leak-detector": [
    {
      id: "normal-brake-job",
      kind: "normal",
      values: {
        quotedPrice: 420,
        diagnosticHours: 0.5,
        repairHours: 2.5,
        laborRate: 95,
        partsCost: 180,
        comebackRiskPercent: 10,
        partsMarkupPercent: 30,
      },
    },
    {
      id: "normal-engine-diagnostic",
      kind: "normal",
      values: {
        quotedPrice: 850,
        diagnosticHours: 1.5,
        repairHours: 4,
        laborRate: 105,
        partsCost: 320,
        comebackRiskPercent: 12,
        partsMarkupPercent: 28,
      },
    },
    {
      id: "normal-transmission",
      kind: "normal",
      values: {
        quotedPrice: 2200,
        diagnosticHours: 2,
        repairHours: 8,
        laborRate: 110,
        partsCost: 780,
        comebackRiskPercent: 14,
        partsMarkupPercent: 32,
      },
    },
    {
      id: "edge-high-comeback",
      kind: "edge",
      values: {
        quotedPrice: 600,
        diagnosticHours: 1,
        repairHours: 5,
        laborRate: 100,
        partsCost: 250,
        comebackRiskPercent: 20,
        partsMarkupPercent: 30,
      },
    },
    {
      id: "absurd-negative-parts",
      kind: "absurd",
      values: {
        quotedPrice: 400,
        diagnosticHours: 1,
        repairHours: 3,
        laborRate: 95,
        partsCost: -100,
        comebackRiskPercent: 12,
        partsMarkupPercent: 30,
      },
      expectPass: false,
    },
  ],
  "signage-bid-safe-price-tool": [
    {
      id: "normal-signage",
      kind: "normal",
      values: {
        materialCost: 1200,
        inkCost: 180,
        designHours: 4,
        laborRate: 65,
        installHours: 6,
        reprintRiskPercent: 8,
        targetMargin: 28,
      },
    },
    {
      id: "normal-banner",
      kind: "normal",
      values: {
        materialCost: 650,
        inkCost: 90,
        designHours: 2,
        laborRate: 58,
        installHours: 3,
        reprintRiskPercent: 6,
        targetMargin: 26,
      },
    },
    {
      id: "normal-wrap",
      kind: "normal",
      values: {
        materialCost: 2200,
        inkCost: 320,
        designHours: 6,
        laborRate: 72,
        installHours: 10,
        reprintRiskPercent: 10,
        targetMargin: 30,
      },
    },
    {
      id: "edge-high-reprint",
      kind: "edge",
      values: {
        materialCost: 1500,
        inkCost: 220,
        designHours: 5,
        laborRate: 68,
        installHours: 8,
        reprintRiskPercent: 16,
        targetMargin: 28,
      },
    },
    {
      id: "absurd-negative-ink",
      kind: "absurd",
      values: {
        materialCost: 800,
        inkCost: -50,
        designHours: 3,
        laborRate: 60,
        installHours: 4,
        reprintRiskPercent: 8,
        targetMargin: 28,
      },
      expectPass: false,
    },
  ],
  "millwork-bid-risk-analyzer": [
    {
      id: "normal-millwork",
      kind: "normal",
      values: {
        sheetMaterialCost: 3200,
        laborHours: 18,
        laborRate: 72,
        finishingCost: 850,
        installHours: 10,
        wasteRatePercent: 12,
        targetMargin: 26,
      },
    },
    {
      id: "normal-vanity",
      kind: "normal",
      values: {
        sheetMaterialCost: 1400,
        laborHours: 10,
        laborRate: 68,
        finishingCost: 420,
        installHours: 5,
        wasteRatePercent: 10,
        targetMargin: 24,
      },
    },
    {
      id: "normal-island",
      kind: "normal",
      values: {
        sheetMaterialCost: 4800,
        laborHours: 28,
        laborRate: 78,
        finishingCost: 1200,
        installHours: 14,
        wasteRatePercent: 14,
        targetMargin: 28,
      },
    },
    {
      id: "edge-high-waste",
      kind: "edge",
      values: {
        sheetMaterialCost: 3600,
        laborHours: 20,
        laborRate: 74,
        finishingCost: 900,
        installHours: 12,
        wasteRatePercent: 18,
        targetMargin: 27,
      },
    },
    {
      id: "absurd-negative-material",
      kind: "absurd",
      values: {
        sheetMaterialCost: -800,
        laborHours: 16,
        laborRate: 70,
        finishingCost: 600,
        installHours: 8,
        wasteRatePercent: 12,
        targetMargin: 26,
      },
      expectPass: false,
    },
  ],
  "roofing-contract-margin-guard": [
    {
      id: "normal-shingle",
      kind: "normal",
      values: {
        materialCost: 6200,
        laborHours: 24,
        laborRate: 42,
        tearOffCost: 1800,
        dumpFees: 450,
        weatherDelayRiskPercent: 10,
        targetMargin: 22,
      },
    },
    {
      id: "normal-small-roof",
      kind: "normal",
      values: {
        materialCost: 3800,
        laborHours: 16,
        laborRate: 40,
        tearOffCost: 1200,
        dumpFees: 300,
        weatherDelayRiskPercent: 8,
        targetMargin: 20,
      },
    },
    {
      id: "normal-large-roof",
      kind: "normal",
      values: {
        materialCost: 9800,
        laborHours: 32,
        laborRate: 45,
        tearOffCost: 2600,
        dumpFees: 650,
        weatherDelayRiskPercent: 12,
        targetMargin: 24,
      },
    },
    {
      id: "edge-weather-risk",
      kind: "edge",
      values: {
        materialCost: 7000,
        laborHours: 26,
        laborRate: 43,
        tearOffCost: 2000,
        dumpFees: 500,
        weatherDelayRiskPercent: 18,
        targetMargin: 23,
      },
    },
    {
      id: "absurd-negative-labor",
      kind: "absurd",
      values: {
        materialCost: 5000,
        laborHours: -4,
        laborRate: 42,
        tearOffCost: 1500,
        dumpFees: 400,
        weatherDelayRiskPercent: 10,
        targetMargin: 22,
      },
      expectPass: false,
    },
  ],
  "painting-job-profit-verdict": [
    {
      id: "normal-interior",
      kind: "normal",
      values: {
        paintCost: 680,
        prepHours: 6,
        laborRate: 48,
        scaffoldCost: 0,
        touchUpRiskPercent: 8,
        areaSize: 2400,
        targetMargin: 24,
      },
    },
    {
      id: "normal-exterior",
      kind: "normal",
      values: {
        paintCost: 1200,
        prepHours: 10,
        laborRate: 52,
        scaffoldCost: 450,
        touchUpRiskPercent: 10,
        areaSize: 3200,
        targetMargin: 26,
      },
    },
    {
      id: "normal-commercial",
      kind: "normal",
      values: {
        paintCost: 2200,
        prepHours: 14,
        laborRate: 55,
        scaffoldCost: 800,
        touchUpRiskPercent: 12,
        areaSize: 5000,
        targetMargin: 28,
      },
    },
    {
      id: "edge-high-touchup",
      kind: "edge",
      values: {
        paintCost: 900,
        prepHours: 8,
        laborRate: 50,
        scaffoldCost: 300,
        touchUpRiskPercent: 16,
        targetMargin: 25,
        areaSize: 2800,
      },
    },
    {
      id: "absurd-negative-area",
      kind: "absurd",
      values: {
        paintCost: 500,
        prepHours: 4,
        laborRate: 45,
        scaffoldCost: 0,
        touchUpRiskPercent: 8,
        areaSize: -100,
        targetMargin: 24,
      },
      expectPass: false,
    },
  ],
  "sheet-metal-quote-risk-tool": [
    {
      id: "normal-fabrication",
      kind: "normal",
      values: {
        programmingTime: 45,
        setupTime: 30,
        cutTime: 55,
        bendCount: 8,
        laborRate: 72,
        materialCost: 420,
        scrapRatePercent: 8,
        finishingCost: 120,
        targetMargin: 25,
      },
    },
    {
      id: "normal-prototype",
      kind: "normal",
      values: {
        programmingTime: 60,
        setupTime: 40,
        cutTime: 25,
        bendCount: 4,
        laborRate: 68,
        materialCost: 280,
        scrapRatePercent: 10,
        finishingCost: 80,
        targetMargin: 24,
      },
    },
    {
      id: "normal-production-run",
      kind: "normal",
      values: {
        programmingTime: 35,
        setupTime: 25,
        cutTime: 90,
        bendCount: 12,
        laborRate: 75,
        materialCost: 650,
        scrapRatePercent: 8,
        finishingCost: 180,
        targetMargin: 26,
      },
    },
    {
      id: "edge-high-scrap",
      kind: "edge",
      values: {
        programmingTime: 50,
        setupTime: 35,
        cutTime: 70,
        bendCount: 10,
        laborRate: 74,
        materialCost: 500,
        scrapRatePercent: 16,
        finishingCost: 140,
        targetMargin: 27,
      },
    },
    {
      id: "absurd-negative-bend",
      kind: "absurd",
      values: {
        programmingTime: 40,
        setupTime: 30,
        cutTime: 50,
        bendCount: -2,
        laborRate: 70,
        materialCost: 400,
        scrapRatePercent: 8,
        finishingCost: 100,
        targetMargin: 25,
      },
      expectPass: false,
    },
  ],
  "3d-print-cost-check": [
    {
      id: "normal-print-job",
      kind: "normal",
      values: {
        materialCost: 45,
        printHours: 6,
        machineRate: 12,
        postProcessHours: 1.5,
        laborRate: 35,
      },
    },
    {
      id: "normal-short-run",
      kind: "normal",
      values: {
        materialCost: 28,
        printHours: 3,
        machineRate: 10,
        postProcessHours: 0.5,
        laborRate: 32,
      },
    },
    {
      id: "normal-prototype",
      kind: "normal",
      values: {
        materialCost: 65,
        printHours: 10,
        machineRate: 14,
        postProcessHours: 2,
        laborRate: 38,
      },
    },
    {
      id: "edge-long-print",
      kind: "edge",
      values: {
        materialCost: 80,
        printHours: 18,
        machineRate: 15,
        postProcessHours: 3,
        laborRate: 40,
      },
    },
    {
      id: "absurd-negative-material",
      kind: "absurd",
      values: {
        materialCost: -20,
        printHours: 5,
        machineRate: 12,
        postProcessHours: 1,
        laborRate: 35,
      },
      expectPass: false,
    },
  ],
};

export function isBatchPremiumBatch3ComparisonSlug(
  slug: string,
): slug is BatchPremiumBatch3OracleSlug {
  return isBatchPremiumBatch3OracleSlug(slug);
}

export function compareBatchPremiumBatch3ProductionVsOracle(input: {
  readonly slug: BatchPremiumBatch3OracleSlug;
  readonly scenarioId: string;
  readonly values: CalculatorInputValues | FreeTrafficInputValues | PremiumInputValues;
}): OracleComparisonResult {
  const locator = getBatchPremiumBatch3ProductionFormulaLocator(input.slug);
  const toolId = locator?.toolId ?? `batch-premium-batch3.${input.slug}`;

  if (!locator?.comparisonWired || !hasOracleForTool(toolId)) {
    return {
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      status: "NOT_WIRED",
      diffs: [],
      message: "Production vs oracle comparison is not wired for this tool.",
    };
  }

  const adapted = adaptProductionBatchPremiumBatch3Output(input.slug, input.values);
  if (adapted.status === "needs_adapter") {
    return {
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      status: "NEEDS_ADAPTER",
      diffs: [],
      message: adapted.reason,
    };
  }
  if (adapted.status === "error") {
    return {
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      status: "FAIL",
      diffs: [],
      message: adapted.reason,
    };
  }

  try {
    const oracleOutput = buildBatchPremiumBatch3OracleOutput(input.slug, input.values);
    const comparison = compareBatchPremiumBatch3Normalized(
      input.slug,
      adapted.output as NormalizedBatchPremiumBatch3ProductionOutput,
      oracleOutput,
    );
    if (!comparison.passed) {
      return {
        slug: input.slug,
        toolId,
        scenarioId: input.scenarioId,
        status: "FAIL",
        diffs: comparison.diffs,
        message: `Field mismatch: ${comparison.diffs.map((d) => d.field).join(", ")}`,
      };
    }
    return {
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      status: "PASS",
      diffs: [],
    };
  } catch (error) {
    if (error instanceof OracleValidationError) {
      return {
        slug: input.slug,
        toolId,
        scenarioId: input.scenarioId,
        status: "FAIL",
        diffs: [],
        message: `Oracle rejected input while production accepted it: ${error.message}`,
      };
    }
    throw error;
  }
}

export function runBatchPremiumBatch3OracleComparisonAudit(
  slug: BatchPremiumBatch3OracleSlug,
): OracleComparisonAuditSummary {
  const locator = getBatchPremiumBatch3ProductionFormulaLocator(slug);
  const toolId = locator?.toolId ?? `batch-premium-batch3.${slug}`;
  const scenarios = BATCH_PREMIUM_BATCH3_COMPARISON_SCENARIOS[slug] ?? [];
  const comparableScenarios = scenarios.filter((scenario) => scenario.expectPass !== false);

  if (!locator?.comparisonWired || !hasOracleForTool(toolId)) {
    return {
      slug,
      toolId,
      status: "NOT_WIRED",
      passCount: 0,
      failCount: 0,
      needsAdapterCount: 0,
      notWiredCount: scenarios.length,
      results: scenarios.map((scenario) => ({
        slug,
        toolId,
        scenarioId: scenario.id,
        status: "NOT_WIRED" as const,
        diffs: [],
      })),
    };
  }

  const results = comparableScenarios.map((scenario) =>
    compareBatchPremiumBatch3ProductionVsOracle({
      slug,
      scenarioId: scenario.id,
      values: scenario.values,
    }),
  );

  const passCount = results.filter((result) => result.status === "PASS").length;
  const failCount = results.filter((result) => result.status === "FAIL").length;
  const needsAdapterCount = results.filter((result) => result.status === "NEEDS_ADAPTER").length;

  let status: OracleComparisonStatus = "PASS";
  if (needsAdapterCount > 0) {
    status = "NEEDS_ADAPTER";
  } else if (failCount > 0) {
    status = "FAIL";
  } else if (passCount === 0) {
    status = "NOT_WIRED";
  }

  return {
    slug,
    toolId,
    status,
    passCount,
    failCount,
    needsAdapterCount,
    notWiredCount: 0,
    results,
  };
}

export function runAllBatchPremiumBatch3OracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return BATCH_PREMIUM_BATCH3_ORACLE_SLUGS.map((slug) =>
    runBatchPremiumBatch3OracleComparisonAudit(slug),
  );
}
