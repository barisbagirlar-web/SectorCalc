/**
 * Batch free/revenue production vs oracle comparison (Phase 5F-A).
 */

import type { CalculatorInputValues } from "@/lib/calculators/registry";
import {
  BATCH_FREE_ORACLE_SLUGS,
  calculateFoodCostOracle,
  calculateWeldingCostOracle,
  isBatchFreeOracleSlug,
  type BatchFreeOracleSlug,
} from "@/lib/formula-governance/oracle/batch-free-oracles";
import {
  calculateCleaningIssaFreeOracle,
  calculateProductMarginDtcFreeOracle,
  calculateProjectChangeOrderFreeOracle,
  mapDeadlinePressureToWastePercent,
} from "@/lib/formula-governance/oracle/revenue-drift-free-oracles";
import {
  adaptProductionBatchFreeOutput,
  type NormalizedBatchFreeProductionOutput,
  type NormalizedCleaningCostProductionOutput,
  type NormalizedFoodCostProductionOutput,
  type NormalizedProductMarginProductionOutput,
  type NormalizedProjectCostProductionOutput,
  type NormalizedWeldingCostProductionOutput,
} from "@/lib/formula-governance/oracle/production-adapters";
import {
  BATCH_FREE_PRODUCTION_FORMULA_LOCATORS,
  getBatchFreeProductionFormulaLocator,
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
const PERCENT_TOLERANCE = 0.01;

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

export { BATCH_FREE_ORACLE_SLUGS };
export { BATCH_FREE_PRODUCTION_FORMULA_LOCATORS };

const BATCH_FREE_CURRENCY_TOLERANCE = CURRENCY_TOLERANCE;

export type BatchFreeComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: CalculatorInputValues;
  readonly expectPass?: boolean;
};

function buildBatchFreeOracleOutput(
  slug: BatchFreeOracleSlug,
  values: CalculatorInputValues,
): NormalizedBatchFreeProductionOutput {
  switch (slug) {
    case "project-cost-calculator": {
      const wastePercent =
        values.deadlinePressureWastePercent !== undefined
          ? Number(values.deadlinePressureWastePercent)
          : mapDeadlinePressureToWastePercent(
              values.deadlinePressure as string | number | undefined,
            ) ?? 5;
      return calculateProjectChangeOrderFreeOracle({
        originalBudget: Number(values.originalBudget),
        changeEstimate: Number(values.changeEstimate),
        deadlinePressureWastePercent: wastePercent,
      });
    }
    case "cleaning-cost-calculator": {
      return calculateCleaningIssaFreeOracle({
        areaSize: Number(values.areaSize),
        staffCount: Number(values.staffCount),
        visitFrequency: Number(values.visitFrequency),
      });
    }
    case "food-cost-calculator": {
      return calculateFoodCostOracle({
        ingredientCost: Number(values.ingredientCost),
        menuPrice: Number(values.menuPrice),
      });
    }
    case "product-margin-calculator": {
      const returnRateRaw = values.returnRate;
      const returnRate =
        returnRateRaw === undefined || returnRateRaw === "" ? 0 : Number(returnRateRaw);
      return calculateProductMarginDtcFreeOracle({
        productPrice: Number(values.productPrice),
        productCost: Number(values.productCost),
        returnRate,
      });
    }
    case "welding-cost-estimator": {
      return calculateWeldingCostOracle({
        materialCost: Number(values.materialCost),
        laborHours: Number(values.laborHours),
        laborRate: Number(values.laborRate),
        consumablesCost: Number(values.consumablesCost),
      });
    }
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported batch free slug: ${unsupported}`);
    }
  }
}

function compareBatchFreeNormalized(
  slug: BatchFreeOracleSlug,
  production: NormalizedBatchFreeProductionOutput,
  oracle: NormalizedBatchFreeProductionOutput,
): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  switch (slug) {
    case "project-cost-calculator": {
      const prod = production as NormalizedProjectCostProductionOutput;
      const orc = oracle as NormalizedProjectCostProductionOutput;
      return compareNumericFields([
        {
          field: "adjustedChange",
          production: prod.adjustedChange,
          oracle: orc.adjustedChange,
          tolerance: BATCH_FREE_CURRENCY_TOLERANCE,
        },
        {
          field: "changeRatioPercent",
          production: prod.changeRatioPercent,
          oracle: orc.changeRatioPercent,
          tolerance: PERCENT_TOLERANCE,
        },
        {
          field: "wastePercent",
          production: prod.wastePercent,
          oracle: orc.wastePercent,
          tolerance: PERCENT_TOLERANCE,
        },
      ]);
    }
    case "cleaning-cost-calculator": {
      const prod = production as NormalizedCleaningCostProductionOutput;
      const orc = oracle as NormalizedCleaningCostProductionOutput;
      return compareNumericFields([
        {
          field: "monthlyHours",
          production: prod.monthlyHours,
          oracle: orc.monthlyHours,
          tolerance: BATCH_FREE_CURRENCY_TOLERANCE,
        },
        {
          field: "workloadIndex",
          production: prod.workloadIndex,
          oracle: orc.workloadIndex,
          tolerance: BATCH_FREE_CURRENCY_TOLERANCE,
        },
        {
          field: "hoursPerVisit",
          production: prod.hoursPerVisit,
          oracle: orc.hoursPerVisit,
          tolerance: BATCH_FREE_CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "food-cost-calculator": {
      const prod = production as NormalizedFoodCostProductionOutput;
      const orc = oracle as NormalizedFoodCostProductionOutput;
      return compareNumericFields([
        {
          field: "foodCostPercent",
          production: prod.foodCostPercent,
          oracle: orc.foodCostPercent,
          tolerance: PERCENT_TOLERANCE,
        },
      ]);
    }
    case "product-margin-calculator": {
      const prod = production as NormalizedProductMarginProductionOutput;
      const orc = oracle as NormalizedProductMarginProductionOutput;
      return compareNumericFields([
        {
          field: "marginPercent",
          production: prod.marginPercent,
          oracle: orc.marginPercent,
          tolerance: PERCENT_TOLERANCE,
        },
        {
          field: "grossMargin",
          production: prod.grossMargin,
          oracle: orc.grossMargin,
          tolerance: BATCH_FREE_CURRENCY_TOLERANCE,
        },
        {
          field: "totalCost",
          production: prod.totalCost,
          oracle: orc.totalCost,
          tolerance: BATCH_FREE_CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "welding-cost-estimator": {
      const prod = production as NormalizedWeldingCostProductionOutput;
      const orc = oracle as NormalizedWeldingCostProductionOutput;
      return compareNumericFields([
        {
          field: "estimatedCost",
          production: prod.estimatedCost,
          oracle: orc.estimatedCost,
          tolerance: BATCH_FREE_CURRENCY_TOLERANCE,
        },
        {
          field: "laborCost",
          production: prod.laborCost,
          oracle: orc.laborCost,
          tolerance: BATCH_FREE_CURRENCY_TOLERANCE,
        },
      ]);
    }
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported slug: ${unsupported}`);
    }
  }
}

export const BATCH_FREE_COMPARISON_SCENARIOS: Record<
  BatchFreeOracleSlug,
  readonly BatchFreeComparisonScenario[]
> = {
  "project-cost-calculator": [
    {
      id: "normal-change",
      kind: "normal",
      values: {
        originalBudget: 500_000,
        changeEstimate: 25_000,
        deadlinePressure: "low",
      },
    },
    {
      id: "normal-medium-pressure",
      kind: "normal",
      values: {
        originalBudget: 320_000,
        changeEstimate: 18_000,
        deadlinePressure: "medium",
      },
    },
    {
      id: "edge-high-pressure",
      kind: "edge",
      values: {
        originalBudget: 200_000,
        changeEstimate: 40_000,
        deadlinePressure: "high",
      },
    },
    {
      id: "normal-low-pressure",
      kind: "normal",
      values: {
        originalBudget: 400_000,
        changeEstimate: 12_000,
        deadlinePressure: "low",
      },
    },
    {
      id: "absurd-zero-budget",
      kind: "absurd",
      values: {
        originalBudget: 0,
        changeEstimate: 10_000,
        deadlinePressure: "low",
      },
      expectPass: false,
    },
  ],
  "cleaning-cost-calculator": [
    {
      id: "normal-office",
      kind: "normal",
      values: {
        areaSize: 12_000,
        staffCount: 2,
        visitFrequency: 20,
      },
    },
    {
      id: "normal-retail",
      kind: "normal",
      values: {
        areaSize: 8_500,
        staffCount: 2,
        visitFrequency: 12,
      },
    },
    {
      id: "edge-high-frequency",
      kind: "edge",
      values: {
        areaSize: 6_000,
        staffCount: 1,
        visitFrequency: 30,
      },
    },
    {
      id: "normal-clinic",
      kind: "normal",
      values: {
        areaSize: 6_000,
        staffCount: 1,
        visitFrequency: 22,
      },
    },
    {
      id: "absurd-zero-area",
      kind: "absurd",
      values: {
        areaSize: 0,
        staffCount: 2,
        visitFrequency: 12,
      },
      expectPass: false,
    },
  ],
  "food-cost-calculator": [
    {
      id: "normal-menu-item",
      kind: "normal",
      values: { ingredientCost: 4.5, menuPrice: 16 },
    },
    {
      id: "normal-casual-dining",
      kind: "normal",
      values: { ingredientCost: 6.2, menuPrice: 22 },
    },
    {
      id: "normal-quick-service",
      kind: "normal",
      values: { ingredientCost: 2.1, menuPrice: 8.5 },
    },
    {
      id: "edge-thin-margin",
      kind: "edge",
      values: { ingredientCost: 14.5, menuPrice: 16 },
    },
    {
      id: "absurd-zero-price",
      kind: "absurd",
      values: { ingredientCost: 5, menuPrice: 0 },
      expectPass: false,
    },
  ],
  "product-margin-calculator": [
    {
      id: "normal-sku",
      kind: "normal",
      values: {
        productPrice: 79,
        productCost: 28,
        returnRate: 5,
      },
    },
    {
      id: "normal-healthy-margin",
      kind: "normal",
      values: {
        productPrice: 120,
        productCost: 35,
        returnRate: 3,
      },
    },
    {
      id: "normal-no-returns",
      kind: "normal",
      values: {
        productPrice: 45,
        productCost: 18,
      },
    },
    {
      id: "edge-high-returns",
      kind: "edge",
      values: {
        productPrice: 65,
        productCost: 22,
        returnRate: 22,
      },
    },
    {
      id: "absurd-zero-price",
      kind: "absurd",
      values: {
        productPrice: 0,
        productCost: 10,
        returnRate: 5,
      },
      expectPass: false,
    },
  ],
  "welding-cost-estimator": [
    {
      id: "normal-job",
      kind: "normal",
      values: {
        materialCost: 450,
        laborHours: 12,
        laborRate: 68,
        consumablesCost: 95,
      },
    },
    {
      id: "normal-fab-batch",
      kind: "normal",
      values: {
        materialCost: 1_200,
        laborHours: 24,
        laborRate: 72,
        consumablesCost: 180,
      },
    },
    {
      id: "normal-repair",
      kind: "normal",
      values: {
        materialCost: 180,
        laborHours: 4,
        laborRate: 65,
        consumablesCost: 35,
      },
    },
    {
      id: "edge-material-heavy",
      kind: "edge",
      values: {
        materialCost: 3_500,
        laborHours: 6,
        laborRate: 70,
        consumablesCost: 120,
      },
    },
    {
      id: "absurd-zero-hours",
      kind: "absurd",
      values: {
        materialCost: 500,
        laborHours: 0,
        laborRate: 65,
        consumablesCost: 80,
      },
      expectPass: false,
    },
  ],
};

export function isBatchFreeComparisonSlug(slug: string): slug is BatchFreeOracleSlug {
  return isBatchFreeOracleSlug(slug);
}

export function compareBatchFreeProductionVsOracle(input: {
  readonly slug: BatchFreeOracleSlug;
  readonly scenarioId: string;
  readonly values: CalculatorInputValues;
}): OracleComparisonResult {
  const locator = getBatchFreeProductionFormulaLocator(input.slug);
  const toolId = locator?.toolId ?? `batch-free.${input.slug}`;

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

  const adapted = adaptProductionBatchFreeOutput(input.slug, input.values);
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
    const oracleOutput = buildBatchFreeOracleOutput(input.slug, input.values);
    const comparison = compareBatchFreeNormalized(
      input.slug,
      adapted.output as NormalizedBatchFreeProductionOutput,
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

export function runBatchFreeOracleComparisonAudit(
  slug: BatchFreeOracleSlug,
): OracleComparisonAuditSummary {
  const locator = getBatchFreeProductionFormulaLocator(slug);
  const toolId = locator?.toolId ?? `batch-free.${slug}`;
  const scenarios = BATCH_FREE_COMPARISON_SCENARIOS[slug] ?? [];
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
    compareBatchFreeProductionVsOracle({
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

export function runAllBatchFreeOracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return BATCH_FREE_ORACLE_SLUGS.map((slug) => runBatchFreeOracleComparisonAudit(slug));
}
