/**
 * Premium-schema batch production vs oracle comparison.
 */

import type { PremiumInputValues } from "@/lib/tools/premium-decision-engine";
import {
  BATCH_PREMIUM_SCHEMA_ORACLE_SLUGS,
  calculateBatchPremiumSchemaOracle,
  isBatchPremiumSchemaOracleSlug,
  type BatchPremiumSchemaOracleSlug,
} from "@/lib/formula-governance/oracle/batch-premium-schema-oracles";
import {
  adaptProductionBatchPremiumSchemaOutput,
  type NormalizedPremiumMarginProductionOutput,
} from "@/lib/formula-governance/oracle/production-adapters";
import {
  BATCH_PREMIUM_SCHEMA_PRODUCTION_FORMULA_LOCATORS,
  getBatchPremiumSchemaProductionFormulaLocator,
} from "@/lib/formula-governance/oracle/production-formula-locator";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";
import type {
  FieldComparisonDiff,
  OracleComparisonAuditSummary,
  OracleComparisonResult,
  OracleComparisonStatus,
} from "@/lib/formula-governance/oracle/compare-production-oracle";
import { compareNumericFields, CURRENCY_TOLERANCE, PERCENT_TOLERANCE } from "@/lib/formula-governance/oracle/compare-production-oracle";

export { BATCH_PREMIUM_SCHEMA_ORACLE_SLUGS };
export { BATCH_PREMIUM_SCHEMA_PRODUCTION_FORMULA_LOCATORS };

export type BatchPremiumSchemaComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: PremiumInputValues;
  readonly expectPass?: boolean;
};

function comparePremiumMarginNormalized(
  production: NormalizedPremiumMarginProductionOutput,
  oracle: NormalizedPremiumMarginProductionOutput,
): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  return compareNumericFields([
    {
      field: "baseCost",
      production: production.baseCost,
      oracle: oracle.baseCost,
      tolerance: CURRENCY_TOLERANCE,
    },
    {
      field: "p90Cost",
      production: production.p90Cost,
      oracle: oracle.p90Cost,
      tolerance: CURRENCY_TOLERANCE,
    },
    {
      field: "minimumSafePrice",
      production: production.minimumSafePrice,
      oracle: oracle.minimumSafePrice,
      tolerance: CURRENCY_TOLERANCE,
    },
  ]);
}

export const BATCH_PREMIUM_SCHEMA_COMPARISON_SCENARIOS: Record<
  BatchPremiumSchemaOracleSlug,
  readonly BatchPremiumSchemaComparisonScenario[]
> = {
  "route-optimization-analyzer": [
    {
      id: "normal-lane",
      kind: "normal",
      values: {
        distanceKm: 500,
        fuelPricePerKm: 0.35,
        driverHourlyRate: 28,
        estimatedHours: 8,
        returnEmpty: "no",
        hasTolls: "yes",
        overweightRisk: "no",
        targetMargin: 18,
      },
    },
    {
      id: "normal-deadhead",
      kind: "normal",
      values: {
        distanceKm: 320,
        fuelPricePerKm: 0.42,
        driverHourlyRate: 30,
        estimatedHours: 6,
        returnEmpty: "yes",
        hasTolls: "no",
        overweightRisk: "no",
        targetMargin: 20,
      },
    },
    {
      id: "edge-overweight",
      kind: "edge",
      values: {
        distanceKm: 450,
        fuelPricePerKm: 0.38,
        driverHourlyRate: 32,
        estimatedHours: 7,
        returnEmpty: "yes",
        hasTolls: "yes",
        overweightRisk: "yes",
        targetMargin: 22,
      },
    },
    {
      id: "directional-long",
      kind: "normal",
      values: {
        distanceKm: 800,
        fuelPricePerKm: 0.36,
        driverHourlyRate: 29,
        estimatedHours: 12,
        returnEmpty: "no",
        hasTolls: "yes",
        overweightRisk: "no",
        targetMargin: 18,
      },
    },
    {
      id: "absurd-zero-distance",
      kind: "absurd",
      values: {
        distanceKm: 0,
        fuelPricePerKm: 0.35,
        driverHourlyRate: 28,
        estimatedHours: 8,
        returnEmpty: "no",
        hasTolls: "no",
        overweightRisk: "no",
        targetMargin: 18,
      },
      expectPass: false,
    },
  ],
  "energy-efficiency-report": [
    {
      id: "normal-facility",
      kind: "normal",
      values: {
        monthlyKwh: 12000,
        tariffPerKwh: 0.12,
        demandCharge: 450,
        powerFactorPenalty: 5,
        efficiencyTargetPercent: 85,
        targetSavings: 10,
      },
    },
    {
      id: "normal-warehouse",
      kind: "normal",
      values: {
        monthlyKwh: 45000,
        tariffPerKwh: 0.09,
        demandCharge: 1200,
        powerFactorPenalty: 8,
        efficiencyTargetPercent: 80,
        targetSavings: 12,
      },
    },
    {
      id: "edge-high-pf",
      kind: "edge",
      values: {
        monthlyKwh: 18000,
        tariffPerKwh: 0.11,
        demandCharge: 680,
        powerFactorPenalty: 15,
        efficiencyTargetPercent: 75,
        targetSavings: 10,
      },
    },
    {
      id: "directional-kwh",
      kind: "normal",
      values: {
        monthlyKwh: 25000,
        tariffPerKwh: 0.1,
        demandCharge: 900,
        powerFactorPenalty: 6,
        efficiencyTargetPercent: 88,
        targetSavings: 8,
      },
    },
    {
      id: "absurd-zero-kwh",
      kind: "absurd",
      values: {
        monthlyKwh: 0,
        tariffPerKwh: 0.12,
        demandCharge: 450,
        powerFactorPenalty: 5,
        efficiencyTargetPercent: 85,
        targetSavings: 10,
      },
      expectPass: false,
    },
  ],
  "meal-planning-verdict": [
    {
      id: "normal-household",
      kind: "normal",
      values: {
        mealsPerWeek: 21,
        weeklyGroceryBudget: 180,
        foodWastePercent: 15,
        inflationBuffer: 8,
        householdSize: 4,
        targetSavings: 10,
      },
    },
    {
      id: "normal-couple",
      kind: "normal",
      values: {
        mealsPerWeek: 14,
        weeklyGroceryBudget: 120,
        foodWastePercent: 10,
        inflationBuffer: 6,
        householdSize: 2,
        targetSavings: 8,
      },
    },
    {
      id: "edge-high-waste",
      kind: "edge",
      values: {
        mealsPerWeek: 21,
        weeklyGroceryBudget: 200,
        foodWastePercent: 25,
        inflationBuffer: 10,
        householdSize: 5,
        targetSavings: 10,
      },
    },
    {
      id: "directional-budget",
      kind: "normal",
      values: {
        mealsPerWeek: 18,
        weeklyGroceryBudget: 250,
        foodWastePercent: 12,
        inflationBuffer: 7,
        householdSize: 4,
        targetSavings: 10,
      },
    },
    {
      id: "absurd-zero-budget",
      kind: "absurd",
      values: {
        mealsPerWeek: 21,
        weeklyGroceryBudget: 0,
        foodWastePercent: 15,
        inflationBuffer: 8,
        householdSize: 4,
        targetSavings: 10,
      },
      expectPass: false,
    },
  ],
  "trip-budget-optimizer": [
    {
      id: "normal-trip",
      kind: "normal",
      values: {
        distanceKm: 420,
        consumptionPer100Km: 7.5,
        fuelPricePerLiter: 1.45,
        tollEstimate: 28,
        returnTrip: "no",
        parkingPerDay: 15,
        bufferPercent: 12,
      },
    },
    {
      id: "normal-return",
      kind: "normal",
      values: {
        distanceKm: 280,
        consumptionPer100Km: 8.2,
        fuelPricePerLiter: 1.52,
        tollEstimate: 18,
        returnTrip: "yes",
        parkingPerDay: 20,
        bufferPercent: 15,
      },
    },
    {
      id: "edge-long-trip",
      kind: "edge",
      values: {
        distanceKm: 950,
        consumptionPer100Km: 9.5,
        fuelPricePerLiter: 1.6,
        tollEstimate: 65,
        returnTrip: "yes",
        parkingPerDay: 35,
        bufferPercent: 18,
      },
    },
    {
      id: "directional-tolls",
      kind: "normal",
      values: {
        distanceKm: 350,
        consumptionPer100Km: 7.8,
        fuelPricePerLiter: 1.48,
        tollEstimate: 55,
        returnTrip: "no",
        parkingPerDay: 12,
        bufferPercent: 12,
      },
    },
    {
      id: "absurd-zero-distance",
      kind: "absurd",
      values: {
        distanceKm: 0,
        consumptionPer100Km: 7.5,
        fuelPricePerLiter: 1.45,
        tollEstimate: 28,
        returnTrip: "no",
        parkingPerDay: 15,
        bufferPercent: 12,
      },
      expectPass: false,
    },
  ],
  "cbam-compliance-verdict": [
    {
      id: "normal-export",
      kind: "normal",
      values: {
        productionTons: 100,
        energySource: "electricity",
        euImportValue: 500000,
        processEmissionsFactor: 0.2,
        includesTransport: "yes",
        targetMargin: 15,
      },
    },
    {
      id: "normal-gas",
      kind: "normal",
      values: {
        productionTons: 250,
        energySource: "gas",
        euImportValue: 1200000,
        processEmissionsFactor: 0.35,
        includesTransport: "yes",
        targetMargin: 18,
      },
    },
    {
      id: "edge-coal",
      kind: "edge",
      values: {
        productionTons: 80,
        energySource: "coal",
        euImportValue: 400000,
        processEmissionsFactor: 0.5,
        includesTransport: "yes",
        targetMargin: 15,
      },
    },
    {
      id: "directional-tons",
      kind: "normal",
      values: {
        productionTons: 400,
        energySource: "renewable",
        euImportValue: 2000000,
        processEmissionsFactor: 0.15,
        includesTransport: "no",
        targetMargin: 20,
      },
    },
    {
      id: "absurd-zero-tons",
      kind: "absurd",
      values: {
        productionTons: 0,
        energySource: "electricity",
        euImportValue: 500000,
        processEmissionsFactor: 0.2,
        includesTransport: "yes",
        targetMargin: 15,
      },
      expectPass: false,
    },
  ],
  "crop-yield-loss-analyzer": [
    {
      id: "normal-field",
      kind: "normal",
      values: {
        areaHectares: 45,
        expectedYieldTonnes: 3.2,
        fertilizerCost: 8500,
        irrigationCost: 4200,
        soilMoisturePercent: 18,
        weatherRiskIndex: 3,
        targetMargin: 20,
      },
    },
    {
      id: "normal-small-plot",
      kind: "normal",
      values: {
        areaHectares: 12,
        expectedYieldTonnes: 2.8,
        fertilizerCost: 2200,
        irrigationCost: 900,
        soilMoisturePercent: 22,
        weatherRiskIndex: 2,
        targetMargin: 18,
      },
    },
    {
      id: "edge-weather",
      kind: "edge",
      values: {
        areaHectares: 60,
        expectedYieldTonnes: 2.5,
        fertilizerCost: 11000,
        irrigationCost: 5500,
        soilMoisturePercent: 14,
        weatherRiskIndex: 8,
        targetMargin: 22,
      },
    },
    {
      id: "directional-fertilizer",
      kind: "normal",
      values: {
        areaHectares: 30,
        expectedYieldTonnes: 3,
        fertilizerCost: 12000,
        irrigationCost: 3800,
        soilMoisturePercent: 20,
        weatherRiskIndex: 4,
        targetMargin: 20,
      },
    },
    {
      id: "absurd-zero-area",
      kind: "absurd",
      values: {
        areaHectares: 0,
        expectedYieldTonnes: 3.2,
        fertilizerCost: 8500,
        irrigationCost: 4200,
        soilMoisturePercent: 18,
        weatherRiskIndex: 3,
        targetMargin: 20,
      },
      expectPass: false,
    },
  ],
  "feed-efficiency-analyzer": [
    {
      id: "normal-herd",
      kind: "normal",
      values: {
        animalCount: 120,
        dailyFeedKg: 8,
        feedPricePerKg: 0.42,
        feedWastePercent: 8,
        waterQualityIndex: 7,
        targetMargin: 15,
      },
    },
    {
      id: "normal-dairy-herd",
      kind: "normal",
      values: {
        animalCount: 85,
        dailyFeedKg: 12,
        feedPricePerKg: 0.38,
        feedWastePercent: 6,
        waterQualityIndex: 8,
        targetMargin: 12,
      },
    },
    {
      id: "edge-high-waste",
      kind: "edge",
      values: {
        animalCount: 200,
        dailyFeedKg: 10,
        feedPricePerKg: 0.45,
        feedWastePercent: 18,
        waterQualityIndex: 5,
        targetMargin: 15,
      },
    },
    {
      id: "directional-price",
      kind: "normal",
      values: {
        animalCount: 150,
        dailyFeedKg: 9,
        feedPricePerKg: 0.52,
        feedWastePercent: 10,
        waterQualityIndex: 7,
        targetMargin: 15,
      },
    },
    {
      id: "absurd-zero-herd",
      kind: "absurd",
      values: {
        animalCount: 0,
        dailyFeedKg: 8,
        feedPricePerKg: 0.42,
        feedWastePercent: 8,
        waterQualityIndex: 7,
        targetMargin: 15,
      },
      expectPass: false,
    },
  ],
  "dairy-profit-detector": [
    {
      id: "normal-dairy",
      kind: "normal",
      values: {
        cowCount: 150,
        litersPerCowPerDay: 28,
        milkPricePerLiter: 0.38,
        monthlyFeedCost: 42000,
        laborCost: 18000,
        vetAndHealth: 3500,
        targetMargin: 12,
      },
    },
    {
      id: "normal-family-farm",
      kind: "normal",
      values: {
        cowCount: 60,
        litersPerCowPerDay: 24,
        milkPricePerLiter: 0.35,
        monthlyFeedCost: 15000,
        laborCost: 8000,
        vetAndHealth: 1800,
        targetMargin: 10,
      },
    },
    {
      id: "edge-high-feed",
      kind: "edge",
      values: {
        cowCount: 120,
        litersPerCowPerDay: 26,
        milkPricePerLiter: 0.36,
        monthlyFeedCost: 55000,
        laborCost: 16000,
        vetAndHealth: 4200,
        targetMargin: 12,
      },
    },
    {
      id: "directional-labor",
      kind: "normal",
      values: {
        cowCount: 100,
        litersPerCowPerDay: 27,
        milkPricePerLiter: 0.37,
        monthlyFeedCost: 28000,
        laborCost: 24000,
        vetAndHealth: 3000,
        targetMargin: 12,
      },
    },
    {
      id: "absurd-negative-cost",
      kind: "absurd",
      values: {
        cowCount: 100,
        litersPerCowPerDay: 27,
        milkPricePerLiter: 0.37,
        monthlyFeedCost: 28000,
        laborCost: -5000,
        vetAndHealth: 3000,
        targetMargin: 12,
      },
      expectPass: false,
    },
  ],
  "water-optimization-verdict": [
    {
      id: "normal-irrigation",
      kind: "normal",
      values: {
        areaHectares: 35,
        pumpingHours: 120,
        electricityRate: 0.14,
        waterRightsFee: 850,
        evaporationLossPercent: 12,
        targetMargin: 18,
      },
    },
    {
      id: "normal-pivot",
      kind: "normal",
      values: {
        areaHectares: 80,
        pumpingHours: 200,
        electricityRate: 0.11,
        waterRightsFee: 1200,
        evaporationLossPercent: 10,
        targetMargin: 16,
      },
    },
    {
      id: "edge-high-evap",
      kind: "edge",
      values: {
        areaHectares: 50,
        pumpingHours: 180,
        electricityRate: 0.13,
        waterRightsFee: 950,
        evaporationLossPercent: 22,
        targetMargin: 18,
      },
    },
    {
      id: "directional-pumping",
      kind: "normal",
      values: {
        areaHectares: 40,
        pumpingHours: 260,
        electricityRate: 0.12,
        waterRightsFee: 700,
        evaporationLossPercent: 14,
        targetMargin: 18,
      },
    },
    {
      id: "absurd-zero-area",
      kind: "absurd",
      values: {
        areaHectares: 0,
        pumpingHours: 120,
        electricityRate: 0.14,
        waterRightsFee: 850,
        evaporationLossPercent: 12,
        targetMargin: 18,
      },
      expectPass: false,
    },
  ],
  "renovation-budget-optimizer": [
    {
      id: "normal-renovation",
      kind: "normal",
      values: {
        areaM2: 85,
        materialQuality: "standard",
        includeLabor: "yes",
        season: "summer",
        cityTier: "standard",
        contingencyPercent: 10,
      },
    },
    {
      id: "normal-apartment",
      kind: "normal",
      values: {
        areaM2: 55,
        materialQuality: "basic",
        includeLabor: "yes",
        season: "summer",
        cityTier: "major",
        contingencyPercent: 12,
      },
    },
    {
      id: "edge-winter",
      kind: "edge",
      values: {
        areaM2: 120,
        materialQuality: "premium",
        includeLabor: "yes",
        season: "winter",
        cityTier: "major",
        contingencyPercent: 15,
      },
    },
    {
      id: "directional-area",
      kind: "normal",
      values: {
        areaM2: 160,
        materialQuality: "standard",
        includeLabor: "yes",
        season: "summer",
        cityTier: "standard",
        contingencyPercent: 10,
      },
    },
    {
      id: "absurd-zero-area",
      kind: "absurd",
      values: {
        areaM2: 0,
        materialQuality: "standard",
        includeLabor: "yes",
        season: "summer",
        cityTier: "standard",
        contingencyPercent: 10,
      },
      expectPass: false,
    },
  ],
  "3d-print-job-margin-tool": [
    {
      id: "normal-print-job",
      kind: "normal",
      values: {
        materialCost: 45,
        printHours: 6,
        machineRate: 12,
        postProcessHours: 1.5,
        laborRate: 28,
        failRatePercent: 10,
        targetMargin: 30,
      },
    },
    {
      id: "normal-prototype",
      kind: "normal",
      values: {
        materialCost: 28,
        printHours: 4,
        machineRate: 10,
        postProcessHours: 1,
        laborRate: 25,
        failRatePercent: 8,
        targetMargin: 28,
      },
    },
    {
      id: "edge-high-fail",
      kind: "edge",
      values: {
        materialCost: 60,
        printHours: 14,
        machineRate: 15,
        postProcessHours: 3,
        laborRate: 32,
        failRatePercent: 22,
        targetMargin: 32,
      },
    },
    {
      id: "directional-hours",
      kind: "normal",
      values: {
        materialCost: 50,
        printHours: 10,
        machineRate: 12,
        postProcessHours: 2,
        laborRate: 28,
        failRatePercent: 12,
        targetMargin: 30,
      },
    },
    {
      id: "absurd-negative-material",
      kind: "absurd",
      values: {
        materialCost: -10,
        printHours: 6,
        machineRate: 12,
        postProcessHours: 1.5,
        laborRate: 28,
        failRatePercent: 10,
        targetMargin: 30,
      },
      expectPass: false,
    },
  ],
};

export function isBatchPremiumSchemaComparisonSlug(
  slug: string,
): slug is BatchPremiumSchemaOracleSlug {
  return isBatchPremiumSchemaOracleSlug(slug);
}

export function compareBatchPremiumSchemaProductionVsOracle(input: {
  readonly slug: BatchPremiumSchemaOracleSlug;
  readonly scenarioId: string;
  readonly values: PremiumInputValues;
}): OracleComparisonResult {
  const locator = getBatchPremiumSchemaProductionFormulaLocator(input.slug);
  const toolId = locator?.toolId ?? `batch-premium-schema.${input.slug}`;

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

  const adapted = adaptProductionBatchPremiumSchemaOutput(input.slug, input.values);
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
    const oracleOutput = calculateBatchPremiumSchemaOracle(input.slug, input.values);
    const comparison = comparePremiumMarginNormalized(
      adapted.output as NormalizedPremiumMarginProductionOutput,
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

export function runBatchPremiumSchemaOracleComparisonAudit(
  slug: BatchPremiumSchemaOracleSlug,
): OracleComparisonAuditSummary {
  const locator = getBatchPremiumSchemaProductionFormulaLocator(slug);
  const toolId = locator?.toolId ?? `batch-premium-schema.${slug}`;
  const scenarios = BATCH_PREMIUM_SCHEMA_COMPARISON_SCENARIOS[slug] ?? [];
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
    compareBatchPremiumSchemaProductionVsOracle({
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

export function runAllBatchPremiumSchemaOracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return BATCH_PREMIUM_SCHEMA_ORACLE_SLUGS.map((slug) =>
    runBatchPremiumSchemaOracleComparisonAudit(slug),
  );
}
