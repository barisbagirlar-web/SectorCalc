/**
 * Batch free/revenue batch-2 production vs oracle comparison (Phase 5G-B).
 */

import type { CalculatorInputValues } from "@/lib/features/calculators/registry";
import type { FreeTrafficInputValues } from "@/lib/features/tools/free-traffic-calculators";
import type { PremiumInputValues } from "@/lib/features/tools/premium-decision-engine";
import {
  BATCH_FREE_BATCH2_ORACLE_SLUGS,
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
  isBatchFreeBatch2OracleSlug,
  type BatchFreeBatch2OracleSlug,
} from "@/lib/features/formula-governance/oracle/batch-free-batch2-oracles";
import {
  adaptProductionBatchFreeBatch2Output,
  type NormalizedBatchFreeBatch2ProductionOutput,
  type NormalizedCabinetCostProductionOutput,
  type NormalizedElectricalLaborProductionOutput,
  type NormalizedHvacTonnageProductionOutput,
  type NormalizedLaserCuttingTimeProductionOutput,
  type NormalizedLawnCareCostProductionOutput,
  type NormalizedPlumbingJobMarginProductionOutput,
  type NormalizedPrintJobCostProductionOutput,
  type NormalizedRepairTimeVsPriceProductionOutput,
  type NormalizedRoofingSquareCostProductionOutput,
  type NormalizedSampleSizeProductionOutput,
} from "@/lib/features/formula-governance/oracle/production-adapters";
import {
  BATCH_FREE_BATCH2_PRODUCTION_FORMULA_LOCATORS,
  getBatchFreeBatch2ProductionFormulaLocator,
} from "@/lib/features/formula-governance/oracle/production-formula-locator";
import { hasOracleForTool } from "@/lib/features/formula-governance/oracle/registry";
import { OracleValidationError } from "@/lib/features/formula-governance/oracle/oracle-types";
import type {
  FieldComparisonDiff,
  OracleComparisonAuditSummary,
  OracleComparisonResult,
  OracleComparisonStatus,
} from "@/lib/features/formula-governance/oracle/compare-production-oracle";

const CURRENCY_TOLERANCE = 0.01;
const PERCENT_TOLERANCE = 0.01;
const INTEGER_TOLERANCE = 0.5;

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

export { BATCH_FREE_BATCH2_ORACLE_SLUGS };
export { BATCH_FREE_BATCH2_PRODUCTION_FORMULA_LOCATORS };

export type BatchFreeBatch2ComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: CalculatorInputValues | FreeTrafficInputValues | PremiumInputValues;
  readonly expectPass?: boolean;
};

function buildBatchFreeBatch2OracleOutput(
  slug: BatchFreeBatch2OracleSlug,
  values: CalculatorInputValues | FreeTrafficInputValues | PremiumInputValues,
): NormalizedBatchFreeBatch2ProductionOutput {
  switch (slug) {
    case "sample-size-calculator":
      return calculateSampleSizeOracle({
        population: Number(values.population),
        confidenceZ: Number(values.confidenceZ),
        marginErrorPercent: Number(values.marginErrorPercent),
        proportionPercent: Number(values.proportionPercent),
      });
    case "hvac-tonnage-rule-check":
      return calculateHvacTonnageRuleOracle({
        squareFootage: Number(values.squareFootage),
        tonnage: Number(values.tonnage),
        laborHours: Number(values.laborHours),
      });
    case "electrical-labor-estimator":
      return calculateElectricalLaborOracle({
        laborHours: Number(values.laborHours),
        laborRate: Number(values.laborRate),
        materialCost: Number(values.materialCost),
      });
    case "lawn-care-cost-check":
      return calculateLawnCareCostOracle({
        crewHoursPerVisit: Number(values.crewHoursPerVisit),
        visitsPerMonth: Number(values.visitsPerMonth),
        laborRate: Number(values.laborRate),
      });
    case "repair-time-vs-price-check":
      return calculateRepairTimeVsPriceOracle({
        quotedPrice: Number(values.quotedPrice),
        repairHours: Number(values.repairHours),
        partsCost: Number(values.partsCost),
      });
    case "print-job-cost-check":
      return calculatePrintJobCostOracle({
        designHours: Number(values.designHours),
        laborRate: Number(values.laborRate),
        materialCost: Number(values.materialCost),
      });
    case "plumbing-job-margin-verdict":
      return calculatePlumbingJobMarginOracle({
        partsCost: Number(values.partsCost),
        laborHours: Number(values.laborHours),
        laborRate: Number(values.laborRate),
        fixtureCount: Number(values.fixtureCount),
        materialRunCost: Number(values.materialRunCost),
        callbackRiskPercent: Number(values.callbackRiskPercent),
        targetMargin: Number(values.targetMargin),
      });
    case "cabinet-cost-estimator":
      return calculateCabinetCostOracle({
        laborHours: Number(values.laborHours),
        installHours: Number(values.installHours),
        sheetMaterialCost: Number(values.sheetMaterialCost),
      });
    case "roofing-square-cost-check":
      return calculateRoofingSquareCostOracle({
        laborHours: Number(values.laborHours),
        laborRate: Number(values.laborRate),
        materialCost: Number(values.materialCost),
      });
    case "laser-cutting-time-check":
      return calculateLaserCuttingTimeOracle({
        setupMinutes: Number(values.setupMinutes),
        cutLengthM: Number(values.cutLengthM),
        cutSpeedMMin: Number(values.cutSpeedMMin),
        pierceCount: Number(values.pierceCount),
        pierceSeconds: Number(values.pierceSeconds),
      });
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported batch free batch-2 slug: ${unsupported}`);
    }
  }
}

function compareBatchFreeBatch2Normalized(
  slug: BatchFreeBatch2OracleSlug,
  production: NormalizedBatchFreeBatch2ProductionOutput,
  oracle: NormalizedBatchFreeBatch2ProductionOutput,
): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  switch (slug) {
    case "sample-size-calculator": {
      const prod = production as NormalizedSampleSizeProductionOutput;
      const orc = oracle as NormalizedSampleSizeProductionOutput;
      return compareNumericFields([
        {
          field: "requiredSample",
          production: prod.requiredSample,
          oracle: orc.requiredSample,
          tolerance: INTEGER_TOLERANCE,
        },
        {
          field: "infinitePopulationEstimate",
          production: prod.infinitePopulationEstimate,
          oracle: orc.infinitePopulationEstimate,
          tolerance: INTEGER_TOLERANCE,
        },
      ]);
    }
    case "hvac-tonnage-rule-check": {
      const prod = production as NormalizedHvacTonnageProductionOutput;
      const orc = oracle as NormalizedHvacTonnageProductionOutput;
      return compareNumericFields([
        {
          field: "totalBtu",
          production: prod.totalBtu,
          oracle: orc.totalBtu,
          tolerance: 1,
        },
        {
          field: "totalTons",
          production: prod.totalTons,
          oracle: orc.totalTons,
          tolerance: 0.01,
        },
        {
          field: "recommendedTons",
          production: prod.recommendedTons,
          oracle: orc.recommendedTons,
          tolerance: INTEGER_TOLERANCE,
        },
      ]);
    }
    case "electrical-labor-estimator": {
      const prod = production as NormalizedElectricalLaborProductionOutput;
      const orc = oracle as NormalizedElectricalLaborProductionOutput;
      return compareNumericFields([
        {
          field: "laborCost",
          production: prod.laborCost,
          oracle: orc.laborCost,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "laborMaterialRatio",
          production: prod.laborMaterialRatio,
          oracle: orc.laborMaterialRatio,
          tolerance: PERCENT_TOLERANCE,
        },
      ]);
    }
    case "lawn-care-cost-check": {
      const prod = production as NormalizedLawnCareCostProductionOutput;
      const orc = oracle as NormalizedLawnCareCostProductionOutput;
      return compareNumericFields([
        {
          field: "monthlyLoad",
          production: prod.monthlyLoad,
          oracle: orc.monthlyLoad,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "repair-time-vs-price-check": {
      const prod = production as NormalizedRepairTimeVsPriceProductionOutput;
      const orc = oracle as NormalizedRepairTimeVsPriceProductionOutput;
      return compareNumericFields([
        {
          field: "burdenedCost",
          production: prod.burdenedCost,
          oracle: orc.burdenedCost,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "mitchellTotalHours",
          production: prod.mitchellTotalHours,
          oracle: orc.mitchellTotalHours,
          tolerance: 0.01,
        },
      ]);
    }
    case "print-job-cost-check": {
      const prod = production as NormalizedPrintJobCostProductionOutput;
      const orc = oracle as NormalizedPrintJobCostProductionOutput;
      return compareNumericFields([
        {
          field: "designCost",
          production: prod.designCost,
          oracle: orc.designCost,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "designMaterialRatio",
          production: prod.designMaterialRatio,
          oracle: orc.designMaterialRatio,
          tolerance: 0.01,
        },
      ]);
    }
    case "plumbing-job-margin-verdict": {
      const prod = production as NormalizedPlumbingJobMarginProductionOutput;
      const orc = oracle as NormalizedPlumbingJobMarginProductionOutput;
      return compareNumericFields([
        {
          field: "baseCost",
          production: prod.baseCost,
          oracle: orc.baseCost,
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
    case "cabinet-cost-estimator": {
      const prod = production as NormalizedCabinetCostProductionOutput;
      const orc = oracle as NormalizedCabinetCostProductionOutput;
      return compareNumericFields([
        {
          field: "totalHours",
          production: prod.totalHours,
          oracle: orc.totalHours,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "wasteAdjustedHours",
          production: prod.wasteAdjustedHours,
          oracle: orc.wasteAdjustedHours,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "roofing-square-cost-check": {
      const prod = production as NormalizedRoofingSquareCostProductionOutput;
      const orc = oracle as NormalizedRoofingSquareCostProductionOutput;
      return compareNumericFields([
        {
          field: "laborCost",
          production: prod.laborCost,
          oracle: orc.laborCost,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "nrcaEstimate",
          production: prod.nrcaEstimate,
          oracle: orc.nrcaEstimate,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "laser-cutting-time-check": {
      const prod = production as NormalizedLaserCuttingTimeProductionOutput;
      const orc = oracle as NormalizedLaserCuttingTimeProductionOutput;
      return compareNumericFields([
        {
          field: "totalMinutes",
          production: prod.totalMinutes,
          oracle: orc.totalMinutes,
          tolerance: 0.05,
        },
      ]);
    }
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported slug: ${unsupported}`);
    }
  }
}

export const BATCH_FREE_BATCH2_COMPARISON_SCENARIOS: Record<
  BatchFreeBatch2OracleSlug,
  readonly BatchFreeBatch2ComparisonScenario[]
> = {
  "sample-size-calculator": [
    {
      id: "normal-survey",
      kind: "normal",
      values: { population: 5000, confidenceZ: 1.96, marginErrorPercent: 5, proportionPercent: 50 },
    },
    {
      id: "normal-large-org",
      kind: "normal",
      values: { population: 50_000, confidenceZ: 1.96, marginErrorPercent: 3, proportionPercent: 40 },
    },
    {
      id: "normal-small-team",
      kind: "normal",
      values: { population: 120, confidenceZ: 1.645, marginErrorPercent: 7, proportionPercent: 55 },
    },
    {
      id: "edge-infinite-population",
      kind: "edge",
      values: { population: 0, confidenceZ: 1.96, marginErrorPercent: 5, proportionPercent: 50 },
    },
    {
      id: "absurd-zero-margin",
      kind: "absurd",
      values: { population: 1000, confidenceZ: 1.96, marginErrorPercent: 0, proportionPercent: 50 },
      expectPass: false,
    },
  ],
  "hvac-tonnage-rule-check": [
    {
      id: "normal-office",
      kind: "normal",
      values: { squareFootage: 2400, tonnage: 4, laborHours: 16 },
    },
    {
      id: "normal-retail",
      kind: "normal",
      values: { squareFootage: 1800, tonnage: 3, laborHours: 12 },
    },
    {
      id: "normal-clinic",
      kind: "normal",
      values: { squareFootage: 3200, tonnage: 5, laborHours: 20 },
    },
    {
      id: "edge-undersized",
      kind: "edge",
      values: { squareFootage: 4000, tonnage: 2, laborHours: 32 },
    },
    {
      id: "absurd-zero-area",
      kind: "absurd",
      values: { squareFootage: 0, tonnage: 3, laborHours: 8 },
      expectPass: false,
    },
  ],
  "electrical-labor-estimator": [
    {
      id: "normal-panel-job",
      kind: "normal",
      values: { materialCost: 2800, laborHours: 10, laborRate: 78 },
    },
    {
      id: "normal-shop-work",
      kind: "normal",
      values: { materialCost: 1200, laborHours: 6, laborRate: 72 },
    },
    {
      id: "normal-commercial",
      kind: "normal",
      values: { materialCost: 5400, laborHours: 18, laborRate: 85 },
    },
    {
      id: "edge-low-ratio",
      kind: "edge",
      values: { materialCost: 6000, laborHours: 8, laborRate: 65 },
    },
    {
      id: "absurd-negative-material",
      kind: "absurd",
      values: { materialCost: -500, laborHours: 8, laborRate: 70 },
      expectPass: false,
    },
  ],
  "lawn-care-cost-check": [
    {
      id: "normal-route",
      kind: "normal",
      values: { crewHoursPerVisit: 2.5, visitsPerMonth: 4, laborRate: 28 },
    },
    {
      id: "normal-weekly",
      kind: "normal",
      values: { crewHoursPerVisit: 1.5, visitsPerMonth: 4, laborRate: 26 },
    },
    {
      id: "normal-biweekly",
      kind: "normal",
      values: { crewHoursPerVisit: 3, visitsPerMonth: 2, laborRate: 30 },
    },
    {
      id: "edge-heavy-route",
      kind: "edge",
      values: { crewHoursPerVisit: 5, visitsPerMonth: 8, laborRate: 32 },
    },
    {
      id: "absurd-negative-visits",
      kind: "absurd",
      values: { crewHoursPerVisit: 2, visitsPerMonth: -1, laborRate: 25 },
      expectPass: false,
    },
  ],
  "repair-time-vs-price-check": [
    {
      id: "normal-brake-job",
      kind: "normal",
      values: { quotedPrice: 420, repairHours: 2.5, partsCost: 180 },
    },
    {
      id: "normal-oil-service",
      kind: "normal",
      values: { quotedPrice: 95, repairHours: 0.8, partsCost: 35 },
    },
    {
      id: "normal-transmission",
      kind: "normal",
      values: { quotedPrice: 1800, repairHours: 8, partsCost: 650 },
    },
    {
      id: "edge-tight-quote",
      kind: "edge",
      values: { quotedPrice: 300, repairHours: 4, partsCost: 220 },
    },
    {
      id: "absurd-negative-hours",
      kind: "absurd",
      values: { quotedPrice: 400, repairHours: -2, partsCost: 150 },
      expectPass: false,
    },
  ],
  "print-job-cost-check": [
    {
      id: "normal-signage",
      kind: "normal",
      values: { materialCost: 450, designHours: 2, laborRate: 65 },
    },
    {
      id: "normal-banner",
      kind: "normal",
      values: { materialCost: 220, designHours: 1.5, laborRate: 58 },
    },
    {
      id: "normal-wrap",
      kind: "normal",
      values: { materialCost: 880, designHours: 3, laborRate: 72 },
    },
    {
      id: "edge-design-heavy",
      kind: "edge",
      values: { materialCost: 300, designHours: 6, laborRate: 70 },
    },
    {
      id: "absurd-negative-design",
      kind: "absurd",
      values: { materialCost: 400, designHours: -1, laborRate: 60 },
      expectPass: false,
    },
  ],
  "plumbing-job-margin-verdict": [
    {
      id: "normal-fixture-job",
      kind: "normal",
      values: {
        partsCost: 420,
        laborHours: 6,
        laborRate: 85,
        fixtureCount: 3,
        materialRunCost: 65,
        callbackRiskPercent: 8,
        targetMargin: 25,
      },
    },
    {
      id: "normal-single-fixture",
      kind: "normal",
      values: {
        partsCost: 180,
        laborHours: 3,
        laborRate: 78,
        fixtureCount: 1,
        materialRunCost: 25,
        callbackRiskPercent: 6,
        targetMargin: 22,
      },
    },
    {
      id: "normal-multi-bath",
      kind: "normal",
      values: {
        partsCost: 950,
        laborHours: 12,
        laborRate: 90,
        fixtureCount: 5,
        materialRunCost: 120,
        callbackRiskPercent: 10,
        targetMargin: 28,
      },
    },
    {
      id: "edge-high-callback",
      kind: "edge",
      values: {
        partsCost: 600,
        laborHours: 8,
        laborRate: 88,
        fixtureCount: 4,
        materialRunCost: 90,
        callbackRiskPercent: 18,
        targetMargin: 30,
      },
    },
    {
      id: "absurd-zero-rate",
      kind: "absurd",
      values: {
        partsCost: 300,
        laborHours: 4,
        laborRate: 0,
        fixtureCount: 2,
        materialRunCost: 40,
        callbackRiskPercent: 8,
        targetMargin: 25,
      },
      expectPass: false,
    },
  ],
  "cabinet-cost-estimator": [
    {
      id: "normal-cabinet-job",
      kind: "normal",
      values: { sheetMaterialCost: 2200, laborHours: 14, installHours: 8 },
    },
    {
      id: "normal-vanity",
      kind: "normal",
      values: { sheetMaterialCost: 900, laborHours: 8, installHours: 4 },
    },
    {
      id: "normal-island",
      kind: "normal",
      values: { sheetMaterialCost: 3500, laborHours: 22, installHours: 10 },
    },
    {
      id: "edge-long-install",
      kind: "edge",
      values: { sheetMaterialCost: 1800, laborHours: 16, installHours: 18 },
    },
    {
      id: "absurd-negative-hours",
      kind: "absurd",
      values: { sheetMaterialCost: 1200, laborHours: -4, installHours: 6 },
      expectPass: false,
    },
  ],
  "roofing-square-cost-check": [
    {
      id: "normal-shingle-job",
      kind: "normal",
      values: { materialCost: 4200, laborHours: 18, laborRate: 42 },
    },
    {
      id: "normal-small-roof",
      kind: "normal",
      values: { materialCost: 2800, laborHours: 12, laborRate: 40 },
    },
    {
      id: "normal-large-roof",
      kind: "normal",
      values: { materialCost: 7500, laborHours: 28, laborRate: 45 },
    },
    {
      id: "edge-long-labor",
      kind: "edge",
      values: { materialCost: 5000, laborHours: 32, laborRate: 38 },
    },
    {
      id: "absurd-negative-material",
      kind: "absurd",
      values: { materialCost: -1000, laborHours: 16, laborRate: 42 },
      expectPass: false,
    },
  ],
  "laser-cutting-time-check": [
    {
      id: "normal-batch",
      kind: "normal",
      values: {
        setupMinutes: 18,
        cutLengthM: 12,
        cutSpeedMMin: 2.5,
        pierceCount: 8,
        pierceSeconds: 2,
      },
    },
    {
      id: "normal-sheet",
      kind: "normal",
      values: {
        setupMinutes: 25,
        cutLengthM: 8,
        cutSpeedMMin: 3,
        pierceCount: 4,
        pierceSeconds: 1.5,
      },
    },
    {
      id: "normal-prototype",
      kind: "normal",
      values: {
        setupMinutes: 35,
        cutLengthM: 4,
        cutSpeedMMin: 2,
        pierceCount: 12,
        pierceSeconds: 2.5,
      },
    },
    {
      id: "edge-setup-heavy",
      kind: "edge",
      values: {
        setupMinutes: 60,
        cutLengthM: 3,
        cutSpeedMMin: 1.8,
        pierceCount: 20,
        pierceSeconds: 3,
      },
    },
    {
      id: "absurd-zero-speed",
      kind: "absurd",
      values: {
        setupMinutes: 15,
        cutLengthM: 10,
        cutSpeedMMin: 0,
        pierceCount: 5,
        pierceSeconds: 2,
      },
      expectPass: false,
    },
  ],
};

export function isBatchFreeBatch2ComparisonSlug(slug: string): slug is BatchFreeBatch2OracleSlug {
  return isBatchFreeBatch2OracleSlug(slug);
}

export function compareBatchFreeBatch2ProductionVsOracle(input: {
  readonly slug: BatchFreeBatch2OracleSlug;
  readonly scenarioId: string;
  readonly values: CalculatorInputValues | FreeTrafficInputValues | PremiumInputValues;
}): OracleComparisonResult {
  const locator = getBatchFreeBatch2ProductionFormulaLocator(input.slug);
  const toolId = locator?.toolId ?? `batch-free-batch2.${input.slug}`;

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

  const adapted = adaptProductionBatchFreeBatch2Output(input.slug, input.values);
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
    const oracleOutput = buildBatchFreeBatch2OracleOutput(input.slug, input.values);
    const comparison = compareBatchFreeBatch2Normalized(
      input.slug,
      adapted.output as NormalizedBatchFreeBatch2ProductionOutput,
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

export function runBatchFreeBatch2OracleComparisonAudit(
  slug: BatchFreeBatch2OracleSlug,
): OracleComparisonAuditSummary {
  const locator = getBatchFreeBatch2ProductionFormulaLocator(slug);
  const toolId = locator?.toolId ?? `batch-free-batch2.${slug}`;
  const scenarios = BATCH_FREE_BATCH2_COMPARISON_SCENARIOS[slug] ?? [];
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
    compareBatchFreeBatch2ProductionVsOracle({
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

export function runAllBatchFreeBatch2OracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return BATCH_FREE_BATCH2_ORACLE_SLUGS.map((slug) => runBatchFreeBatch2OracleComparisonAudit(slug));
}
