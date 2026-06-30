/**
 * Batch premium/revenue production vs oracle comparison (Phase 5F-B).
 */

import type { CalculatorInputValues } from "@/lib/features/calculators/registry";
import type { PremiumInputValues } from "@/lib/features/tools/premium-decision-engine";
import {
  BATCH_PREMIUM_ORACLE_SLUGS,
  calculateChangeOrderImpactOracle,
  calculateMenuProfitLeakDetectorOracle,
  calculateOfficeCleaningBidOptimizerOracle,
  calculateReturnProfitErosionOracle,
  calculateWeldingBidRiskOracle,
  isBatchPremiumOracleSlug,
  type BatchPremiumOracleSlug,
} from "@/lib/features/formula-governance/oracle/batch-premium-oracles";
import {
  adaptProductionBatchPremiumOutput,
  type NormalizedBatchPremiumProductionOutput,
  type NormalizedChangeOrderImpactProductionOutput,
  type NormalizedMenuProfitLeakProductionOutput,
  type NormalizedOfficeCleaningBidProductionOutput,
  type NormalizedReturnProfitErosionProductionOutput,
  type NormalizedWeldingBidRiskProductionOutput,
} from "@/lib/features/formula-governance/oracle/production-adapters";
import {
  BATCH_PREMIUM_PRODUCTION_FORMULA_LOCATORS,
  getBatchPremiumProductionFormulaLocator,
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

export { BATCH_PREMIUM_ORACLE_SLUGS };
export { BATCH_PREMIUM_PRODUCTION_FORMULA_LOCATORS };

export type BatchPremiumComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: CalculatorInputValues | PremiumInputValues;
  readonly expectPass?: boolean;
};

function buildBatchPremiumOracleOutput(
  slug: BatchPremiumOracleSlug,
  values: CalculatorInputValues | PremiumInputValues,
): NormalizedBatchPremiumProductionOutput {
  switch (slug) {
    case "change-order-impact-analyzer": {
      return calculateChangeOrderImpactOracle({
        originalContractValue: Number(values.originalContractValue),
        originalEstimatedCost: Number(values.originalEstimatedCost),
        extraLaborHours: Number(values.extraLaborHours),
        laborHourlyRate: Number(values.laborHourlyRate),
        extraMaterialCost: Number(values.extraMaterialCost),
        extraEquipmentCost: Number(values.extraEquipmentCost),
        delayDays: Number(values.delayDays),
        dailyOverheadCost: Number(values.dailyOverheadCost),
        targetChangeMargin: Number(values.targetChangeMargin),
        customerOfferedPrice: Number(values.customerOfferedPrice),
      });
    }
    case "office-cleaning-bid-optimizer": {
      return calculateOfficeCleaningBidOptimizerOracle({
        area: Number(values.area),
        frequencyPerMonth: Number(values.frequencyPerMonth),
        hoursPerVisit: Number(values.hoursPerVisit),
        crewSize: Number(values.crewSize),
        laborHourlyCost: Number(values.laborHourlyCost),
        suppliesCostPerVisit: Number(values.suppliesCostPerVisit),
        travelCostPerVisit: Number(values.travelCostPerVisit),
        monthlyOverhead: Number(values.monthlyOverhead),
        targetMargin: Number(values.targetMargin),
        customerBudget: Number(values.customerBudget),
      });
    }
    case "menu-profit-leak-detector": {
      return calculateMenuProfitLeakDetectorOracle({
        sellingPrice: Number(values.sellingPrice),
        ingredientCost: Number(values.ingredientCost),
        wasteRate: Number(values.wasteRate),
        packagingCost: Number(values.packagingCost),
        laborCostPerItem: Number(values.laborCostPerItem),
        deliveryCommissionRate: Number(values.deliveryCommissionRate),
        targetMargin: Number(values.targetMargin),
        monthlyUnitsSold: Number(values.monthlyUnitsSold),
      });
    }
    case "return-profit-erosion-tool": {
      return calculateReturnProfitErosionOracle({
        sellingPrice: Number(values.sellingPrice),
        productCost: Number(values.productCost),
        shippingCost: Number(values.shippingCost),
        platformFeeRate: Number(values.platformFeeRate),
        paymentFeeRate: Number(values.paymentFeeRate),
        returnRate: Number(values.returnRate),
        returnHandlingCost: Number(values.returnHandlingCost),
        adCostPerOrder: Number(values.adCostPerOrder),
        targetMargin: Number(values.targetMargin),
      });
    }
    case "welding-bid-risk-analyzer": {
      return calculateWeldingBidRiskOracle({
        materialCost: Number(values.materialCost),
        laborHours: Number(values.laborHours),
        laborRate: Number(values.laborRate),
        gasConsumableCost: Number(values.gasConsumableCost),
        fitUpHours: Number(values.fitUpHours),
        reworkRiskPercent: Number(values.reworkRiskPercent),
        targetMargin: Number(values.targetMargin),
      });
    }
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported batch premium slug: ${unsupported}`);
    }
  }
}

function compareBatchPremiumNormalized(
  slug: BatchPremiumOracleSlug,
  production: NormalizedBatchPremiumProductionOutput,
  oracle: NormalizedBatchPremiumProductionOutput,
): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  switch (slug) {
    case "change-order-impact-analyzer": {
      const prod = production as NormalizedChangeOrderImpactProductionOutput;
      const orc = oracle as NormalizedChangeOrderImpactProductionOutput;
      return compareNumericFields([
        {
          field: "extraDirectCost",
          production: prod.extraDirectCost,
          oracle: orc.extraDirectCost,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "minimumSafeChangePrice",
          production: prod.minimumSafeChangePrice,
          oracle: orc.minimumSafeChangePrice,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "delayCost",
          production: prod.delayCost,
          oracle: orc.delayCost,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "office-cleaning-bid-optimizer": {
      const prod = production as NormalizedOfficeCleaningBidProductionOutput;
      const orc = oracle as NormalizedOfficeCleaningBidProductionOutput;
      return compareNumericFields([
        {
          field: "monthlyDirectCost",
          production: prod.monthlyDirectCost,
          oracle: orc.monthlyDirectCost,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "minimumSafeMonthlyBid",
          production: prod.minimumSafeMonthlyBid,
          oracle: orc.minimumSafeMonthlyBid,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "menu-profit-leak-detector": {
      const prod = production as NormalizedMenuProfitLeakProductionOutput;
      const orc = oracle as NormalizedMenuProfitLeakProductionOutput;
      return compareNumericFields([
        {
          field: "totalCostPerItem",
          production: prod.totalCostPerItem,
          oracle: orc.totalCostPerItem,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "actualMargin",
          production: prod.actualMargin,
          oracle: orc.actualMargin,
          tolerance: PERCENT_TOLERANCE,
        },
        {
          field: "minimumSafePrice",
          production: prod.minimumSafePrice,
          oracle: orc.minimumSafePrice,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "return-profit-erosion-tool": {
      const prod = production as NormalizedReturnProfitErosionProductionOutput;
      const orc = oracle as NormalizedReturnProfitErosionProductionOutput;
      return compareNumericFields([
        {
          field: "netProfit",
          production: prod.netProfit,
          oracle: orc.netProfit,
          tolerance: CURRENCY_TOLERANCE,
        },
        {
          field: "netMargin",
          production: prod.netMargin,
          oracle: orc.netMargin,
          tolerance: PERCENT_TOLERANCE,
        },
        {
          field: "returnImpact",
          production: prod.returnImpact,
          oracle: orc.returnImpact,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    case "welding-bid-risk-analyzer": {
      const prod = production as NormalizedWeldingBidRiskProductionOutput;
      const orc = oracle as NormalizedWeldingBidRiskProductionOutput;
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
        {
          field: "p90Cost",
          production: prod.p90Cost,
          oracle: orc.p90Cost,
          tolerance: CURRENCY_TOLERANCE,
        },
      ]);
    }
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported slug: ${unsupported}`);
    }
  }
}

export const BATCH_PREMIUM_COMPARISON_SCENARIOS: Record<
  BatchPremiumOracleSlug,
  readonly BatchPremiumComparisonScenario[]
> = {
  "change-order-impact-analyzer": [
    {
      id: "normal-change",
      kind: "normal",
      values: {
        originalContractValue: 25000,
        originalEstimatedCost: 18500,
        extraLaborHours: 24,
        laborHourlyRate: 42,
        extraMaterialCost: 1800,
        extraEquipmentCost: 450,
        delayDays: 5,
        dailyOverheadCost: 350,
        targetChangeMargin: 18,
        customerOfferedPrice: 4500,
      },
    },
    {
      id: "normal-renovation",
      kind: "normal",
      values: {
        originalContractValue: 85000,
        originalEstimatedCost: 62000,
        extraLaborHours: 40,
        laborHourlyRate: 48,
        extraMaterialCost: 3200,
        extraEquipmentCost: 900,
        delayDays: 3,
        dailyOverheadCost: 420,
        targetChangeMargin: 20,
        customerOfferedPrice: 7200,
      },
    },
    {
      id: "normal-small-co",
      kind: "normal",
      values: {
        originalContractValue: 12000,
        originalEstimatedCost: 9200,
        extraLaborHours: 12,
        laborHourlyRate: 38,
        extraMaterialCost: 650,
        extraEquipmentCost: 200,
        delayDays: 2,
        dailyOverheadCost: 180,
        targetChangeMargin: 15,
        customerOfferedPrice: 1800,
      },
    },
    {
      id: "edge-zero-delay",
      kind: "edge",
      values: {
        originalContractValue: 40000,
        originalEstimatedCost: 30000,
        extraLaborHours: 16,
        laborHourlyRate: 45,
        extraMaterialCost: 2200,
        extraEquipmentCost: 600,
        delayDays: 0,
        dailyOverheadCost: 300,
        targetChangeMargin: 22,
        customerOfferedPrice: 5200,
      },
    },
    {
      id: "absurd-negative-delay",
      kind: "absurd",
      values: {
        originalContractValue: 20000,
        originalEstimatedCost: 15000,
        extraLaborHours: 10,
        laborHourlyRate: 40,
        extraMaterialCost: 500,
        extraEquipmentCost: 100,
        delayDays: -2,
        dailyOverheadCost: 200,
        targetChangeMargin: 18,
        customerOfferedPrice: 2000,
      },
      expectPass: false,
    },
  ],
  "office-cleaning-bid-optimizer": [
    {
      id: "normal-contract",
      kind: "normal",
      values: {
        area: 6000,
        frequencyPerMonth: 12,
        hoursPerVisit: 3,
        crewSize: 2,
        laborHourlyCost: 19,
        suppliesCostPerVisit: 18,
        travelCostPerVisit: 22,
        monthlyOverhead: 180,
        targetMargin: 30,
        customerBudget: 1800,
      },
    },
    {
      id: "normal-large-office",
      kind: "normal",
      values: {
        area: 15000,
        frequencyPerMonth: 20,
        hoursPerVisit: 4,
        crewSize: 3,
        laborHourlyCost: 21,
        suppliesCostPerVisit: 25,
        travelCostPerVisit: 30,
        monthlyOverhead: 350,
        targetMargin: 28,
        customerBudget: 4200,
      },
    },
    {
      id: "normal-clinic",
      kind: "normal",
      values: {
        area: 4500,
        frequencyPerMonth: 8,
        hoursPerVisit: 2.5,
        crewSize: 2,
        laborHourlyCost: 22,
        suppliesCostPerVisit: 28,
        travelCostPerVisit: 18,
        monthlyOverhead: 120,
        targetMargin: 25,
        customerBudget: 1100,
      },
    },
    {
      id: "edge-high-frequency",
      kind: "edge",
      values: {
        area: 8000,
        frequencyPerMonth: 22,
        hoursPerVisit: 2,
        crewSize: 2,
        laborHourlyCost: 20,
        suppliesCostPerVisit: 15,
        travelCostPerVisit: 20,
        monthlyOverhead: 200,
        targetMargin: 22,
        customerBudget: 2500,
      },
    },
    {
      id: "absurd-zero-visits",
      kind: "absurd",
      values: {
        area: 5000,
        frequencyPerMonth: 0,
        hoursPerVisit: 3,
        crewSize: 2,
        laborHourlyCost: 19,
        suppliesCostPerVisit: 18,
        travelCostPerVisit: 22,
        monthlyOverhead: 180,
        targetMargin: 30,
        customerBudget: 1800,
      },
      expectPass: false,
    },
  ],
  "menu-profit-leak-detector": [
    {
      id: "normal-item",
      kind: "normal",
      values: {
        sellingPrice: 14.5,
        ingredientCost: 3.8,
        wasteRate: 8,
        packagingCost: 0.45,
        laborCostPerItem: 1.2,
        deliveryCommissionRate: 22,
        targetMargin: 55,
        monthlyUnitsSold: 420,
      },
    },
    {
      id: "normal-dine-in",
      kind: "normal",
      values: {
        sellingPrice: 18,
        ingredientCost: 4.2,
        wasteRate: 5,
        packagingCost: 0.2,
        laborCostPerItem: 1.5,
        deliveryCommissionRate: 0,
        targetMargin: 60,
        monthlyUnitsSold: 280,
      },
    },
    {
      id: "normal-delivery",
      kind: "normal",
      values: {
        sellingPrice: 16.5,
        ingredientCost: 4.5,
        wasteRate: 10,
        packagingCost: 0.65,
        laborCostPerItem: 1.1,
        deliveryCommissionRate: 28,
        targetMargin: 50,
        monthlyUnitsSold: 350,
      },
    },
    {
      id: "edge-high-delivery",
      kind: "edge",
      values: {
        sellingPrice: 15,
        ingredientCost: 3.5,
        wasteRate: 6,
        packagingCost: 0.5,
        laborCostPerItem: 1,
        deliveryCommissionRate: 32,
        targetMargin: 52,
        monthlyUnitsSold: 500,
      },
    },
    {
      id: "absurd-waste",
      kind: "absurd",
      values: {
        sellingPrice: 12,
        ingredientCost: 3,
        wasteRate: 150,
        packagingCost: 0.3,
        laborCostPerItem: 0.9,
        deliveryCommissionRate: 15,
        targetMargin: 50,
        monthlyUnitsSold: 200,
      },
      expectPass: false,
    },
  ],
  "return-profit-erosion-tool": [
    {
      id: "normal-sku",
      kind: "normal",
      values: {
        sellingPrice: 79,
        productCost: 28,
        shippingCost: 6.5,
        platformFeeRate: 12,
        paymentFeeRate: 2.9,
        returnRate: 8,
        returnHandlingCost: 4.5,
        adCostPerOrder: 9,
        targetMargin: 25,
      },
    },
    {
      id: "normal-marketplace",
      kind: "normal",
      values: {
        sellingPrice: 45,
        productCost: 16,
        shippingCost: 4.25,
        platformFeeRate: 15,
        paymentFeeRate: 3.2,
        returnRate: 12,
        returnHandlingCost: 3,
        adCostPerOrder: 6.5,
        targetMargin: 22,
      },
    },
    {
      id: "normal-healthy",
      kind: "normal",
      values: {
        sellingPrice: 120,
        productCost: 35,
        shippingCost: 8,
        platformFeeRate: 8,
        paymentFeeRate: 2.5,
        returnRate: 5,
        returnHandlingCost: 5,
        adCostPerOrder: 12,
        targetMargin: 30,
      },
    },
    {
      id: "edge-high-returns",
      kind: "edge",
      values: {
        sellingPrice: 65,
        productCost: 22,
        shippingCost: 7,
        platformFeeRate: 10,
        paymentFeeRate: 2.9,
        returnRate: 22,
        returnHandlingCost: 6,
        adCostPerOrder: 11,
        targetMargin: 20,
      },
    },
    {
      id: "absurd-return-rate",
      kind: "absurd",
      values: {
        sellingPrice: 50,
        productCost: 18,
        shippingCost: 5,
        platformFeeRate: 10,
        paymentFeeRate: 3,
        returnRate: 110,
        returnHandlingCost: 4,
        adCostPerOrder: 8,
        targetMargin: 25,
      },
      expectPass: false,
    },
  ],
  "welding-bid-risk-analyzer": [
    {
      id: "normal-fab",
      kind: "normal",
      values: {
        materialCost: 850,
        laborHours: 14,
        laborRate: 72,
        gasConsumableCost: 95,
        fitUpHours: 3,
        reworkRiskPercent: 10,
        targetMargin: 25,
      },
    },
    {
      id: "normal-repair",
      kind: "normal",
      values: {
        materialCost: 220,
        laborHours: 5,
        laborRate: 68,
        gasConsumableCost: 35,
        fitUpHours: 1.5,
        reworkRiskPercent: 8,
        targetMargin: 22,
      },
    },
    {
      id: "normal-batch",
      kind: "normal",
      values: {
        materialCost: 1400,
        laborHours: 28,
        laborRate: 75,
        gasConsumableCost: 160,
        fitUpHours: 6,
        reworkRiskPercent: 12,
        targetMargin: 28,
      },
    },
    {
      id: "edge-fit-up-heavy",
      kind: "edge",
      values: {
        materialCost: 600,
        laborHours: 8,
        laborRate: 70,
        gasConsumableCost: 80,
        fitUpHours: 12,
        reworkRiskPercent: 15,
        targetMargin: 25,
      },
    },
    {
      id: "absurd-zero-rate",
      kind: "absurd",
      values: {
        materialCost: 500,
        laborHours: 10,
        laborRate: 0,
        gasConsumableCost: 60,
        fitUpHours: 2,
        reworkRiskPercent: 10,
        targetMargin: 25,
      },
      expectPass: false,
    },
  ],
};

export function isBatchPremiumComparisonSlug(slug: string): slug is BatchPremiumOracleSlug {
  return isBatchPremiumOracleSlug(slug);
}

export function compareBatchPremiumProductionVsOracle(input: {
  readonly slug: BatchPremiumOracleSlug;
  readonly scenarioId: string;
  readonly values: CalculatorInputValues | PremiumInputValues;
}): OracleComparisonResult {
  const locator = getBatchPremiumProductionFormulaLocator(input.slug);
  const toolId = locator?.toolId ?? `batch-premium.${input.slug}`;

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

  const adapted = adaptProductionBatchPremiumOutput(input.slug, input.values);
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
    const oracleOutput = buildBatchPremiumOracleOutput(input.slug, input.values);
    const comparison = compareBatchPremiumNormalized(
      input.slug,
      adapted.output as NormalizedBatchPremiumProductionOutput,
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

export function runBatchPremiumOracleComparisonAudit(
  slug: BatchPremiumOracleSlug,
): OracleComparisonAuditSummary {
  const locator = getBatchPremiumProductionFormulaLocator(slug);
  const toolId = locator?.toolId ?? `batch-premium.${slug}`;
  const scenarios = BATCH_PREMIUM_COMPARISON_SCENARIOS[slug] ?? [];
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
    compareBatchPremiumProductionVsOracle({
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

export function runAllBatchPremiumOracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return BATCH_PREMIUM_ORACLE_SLUGS.map((slug) => runBatchPremiumOracleComparisonAudit(slug));
}
