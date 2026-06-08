/**
 * Production output adapters — normalize calculator UI output for oracle comparison (Phase 5A).
 */

import type { CalculatorInputValues } from "@/lib/calculators/registry";
import { runCalculator } from "@/lib/calculators/registry";
import type { BatchFreeBatch2OracleSlug } from "@/lib/formula-governance/oracle/batch-free-batch2-oracles";
import type { BatchFreeOracleSlug } from "@/lib/formula-governance/oracle/batch-free-oracles";
import type { BatchPremiumOracleSlug } from "@/lib/formula-governance/oracle/batch-premium-oracles";
import type { BatchPremiumBatch3OracleSlug } from "@/lib/formula-governance/oracle/batch-premium-batch3-oracles";
import {
  getBatchTrafficCatalogOracleSpec,
  isBatchTrafficCatalogOracleSlug,
  type BatchTrafficCatalogOracleSlug,
} from "@/lib/formula-governance/oracle/batch-traffic-catalog-oracles";
import type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";
import { calculateFreeTrafficTool } from "@/lib/tools/free-traffic-calculators";
import type { FinanceOracleSlug } from "@/lib/formula-governance/oracle/finance-oracles";
import {
  calculateCleaningIssaFreeOracle,
  calculateProductMarginDtcFreeOracle,
  calculateProjectChangeOrderFreeOracle,
  mapDeadlinePressureToWastePercent,
} from "@/lib/formula-governance/oracle/revenue-drift-free-oracles";
import type { BusinessOperationsOracleSlug } from "@/lib/formula-governance/oracle/production-formula-locator";
import { calculatePremiumDecisionReport } from "@/lib/tools/premium-decision-engine";
import type { PremiumInputValues } from "@/lib/tools/premium-decision-engine";

export type NormalizedLoanProductionOutput = {
  readonly monthlyPayment: number;
};

export type NormalizedMortgageProductionOutput = {
  readonly monthlyPayment: number;
  readonly totalPaid: number;
  readonly totalInterest: number;
};

export type NormalizedSimpleInterestProductionOutput = {
  readonly interestAmount: number;
  readonly totalRepayment: number;
};

export type NormalizedCompoundInterestProductionOutput = {
  readonly futureValue: number;
  readonly interestEarned: number;
};

export type NormalizedProfitMarginProductionOutput = {
  readonly marginPercent: number;
  readonly markupPercent: number;
};

export type NormalizedRentVsBuyProductionOutput = {
  readonly totalRentPaid: number;
  readonly investmentValueIfRenting: number;
  readonly monthlyMortgagePayment: number;
  readonly totalMortgagePaid: number;
  readonly remainingMortgageBalance: number;
  readonly futureHomeValue: number;
  readonly estimatedOwnershipCosts: number;
  readonly estimatedSellingCosts: number;
  readonly rentNetPosition: number;
  readonly buyNetPosition: number;
  readonly netDifference: number;
};

export type NormalizedBreakEvenProductionOutput = {
  readonly breakEvenUnits: number;
  readonly contributionMargin: number;
};

export type NormalizedSalaryCostProductionOutput = {
  readonly totalEmployerCost: number;
};

export type NormalizedCashFlowGapProductionOutput = {
  readonly gapDays: number;
  readonly workingCapitalGap: number;
};

export type NormalizedMachineTimeProductionOutput = {
  readonly totalMinutes: number;
  readonly machineCost: number;
};

export type NormalizedCncQuoteRiskProductionOutput = {
  readonly baseCost: number;
};

export type NormalizedBusinessOperationsProductionOutput =
  | NormalizedBreakEvenProductionOutput
  | NormalizedSalaryCostProductionOutput
  | NormalizedCashFlowGapProductionOutput
  | NormalizedMachineTimeProductionOutput
  | NormalizedCncQuoteRiskProductionOutput;

export type NormalizedProjectCostProductionOutput = {
  readonly adjustedChange: number;
  readonly changeRatioPercent: number;
  readonly wastePercent: number;
};

export type NormalizedCleaningCostProductionOutput = {
  readonly monthlyHours: number;
  readonly workloadIndex: number;
  readonly hoursPerVisit: number;
};

export type NormalizedFoodCostProductionOutput = {
  readonly foodCostPercent: number;
};

export type NormalizedProductMarginProductionOutput = {
  readonly marginPercent: number;
  readonly grossMargin: number;
  readonly totalCost: number;
};

export type NormalizedWeldingCostProductionOutput = {
  readonly estimatedCost: number;
  readonly laborCost: number;
};

export type NormalizedBatchFreeProductionOutput =
  | NormalizedProjectCostProductionOutput
  | NormalizedCleaningCostProductionOutput
  | NormalizedFoodCostProductionOutput
  | NormalizedProductMarginProductionOutput
  | NormalizedWeldingCostProductionOutput;

export type NormalizedChangeOrderImpactProductionOutput = {
  readonly extraDirectCost: number;
  readonly minimumSafeChangePrice: number;
  readonly delayCost: number;
};

export type NormalizedOfficeCleaningBidProductionOutput = {
  readonly monthlyDirectCost: number;
  readonly minimumSafeMonthlyBid: number;
};

export type NormalizedMenuProfitLeakProductionOutput = {
  readonly totalCostPerItem: number;
  readonly actualMargin: number;
  readonly minimumSafePrice: number;
};

export type NormalizedReturnProfitErosionProductionOutput = {
  readonly netProfit: number;
  readonly netMargin: number;
  readonly returnImpact: number;
};

export type NormalizedWeldingBidRiskProductionOutput = {
  readonly baseCost: number;
  readonly p90Cost: number;
  readonly minimumSafePrice: number;
};

export type NormalizedBatchPremiumProductionOutput =
  | NormalizedChangeOrderImpactProductionOutput
  | NormalizedOfficeCleaningBidProductionOutput
  | NormalizedMenuProfitLeakProductionOutput
  | NormalizedReturnProfitErosionProductionOutput
  | NormalizedWeldingBidRiskProductionOutput;

export type NormalizedSampleSizeProductionOutput = {
  readonly requiredSample: number;
  readonly infinitePopulationEstimate: number;
};

export type NormalizedHvacTonnageProductionOutput = {
  readonly totalBtu: number;
  readonly totalTons: number;
  readonly recommendedTons: number;
};

export type NormalizedElectricalLaborProductionOutput = {
  readonly laborCost: number;
  readonly laborMaterialRatio: number;
};

export type NormalizedLawnCareCostProductionOutput = {
  readonly monthlyLoad: number;
  readonly monthlyLaborCost: number;
};

export type NormalizedRepairTimeVsPriceProductionOutput = {
  readonly visibleCost: number;
  readonly burdenedCost: number;
  readonly mitchellTotalHours: number;
};

export type NormalizedPrintJobCostProductionOutput = {
  readonly designCost: number;
  readonly designMaterialRatio: number;
};

export type NormalizedPlumbingJobMarginProductionOutput = {
  readonly baseCost: number;
  readonly p90Cost: number;
  readonly minimumSafePrice: number;
};

export type NormalizedCabinetCostProductionOutput = {
  readonly totalHours: number;
  readonly wasteAdjustedHours: number;
};

export type NormalizedRoofingSquareCostProductionOutput = {
  readonly laborCost: number;
  readonly nrcaEstimate: number;
  readonly laborMaterialRatio: number;
};

export type NormalizedLaserCuttingTimeProductionOutput = {
  readonly totalMinutes: number;
  readonly cutMinutes: number;
};

export type NormalizedBatchFreeBatch2ProductionOutput =
  | NormalizedSampleSizeProductionOutput
  | NormalizedHvacTonnageProductionOutput
  | NormalizedElectricalLaborProductionOutput
  | NormalizedLawnCareCostProductionOutput
  | NormalizedRepairTimeVsPriceProductionOutput
  | NormalizedPrintJobCostProductionOutput
  | NormalizedPlumbingJobMarginProductionOutput
  | NormalizedCabinetCostProductionOutput
  | NormalizedRoofingSquareCostProductionOutput
  | NormalizedLaserCuttingTimeProductionOutput;

export type NormalizedPremiumMarginProductionOutput = {
  readonly baseCost: number;
  readonly p90Cost: number;
  readonly minimumSafePrice: number;
};

export type Normalized3dPrintCostProductionOutput = {
  readonly estimatedCost: number;
  readonly machineTimeCost: number;
};

export type NormalizedBatchPremiumBatch3ProductionOutput =
  | NormalizedPremiumMarginProductionOutput
  | Normalized3dPrintCostProductionOutput;

export type NormalizedFinanceProductionOutput =
  | NormalizedLoanProductionOutput
  | NormalizedMortgageProductionOutput
  | NormalizedSimpleInterestProductionOutput
  | NormalizedCompoundInterestProductionOutput
  | NormalizedProfitMarginProductionOutput
  | NormalizedRentVsBuyProductionOutput;

export type ProductionAdapterResult =
  | {
      readonly status: "ok";
      readonly output:
        | NormalizedFinanceProductionOutput
        | NormalizedBusinessOperationsProductionOutput
        | NormalizedBatchFreeProductionOutput
        | NormalizedBatchPremiumProductionOutput
        | NormalizedBatchFreeBatch2ProductionOutput
        | NormalizedBatchPremiumBatch3ProductionOutput
        | NormalizedBatchTrafficCatalogProductionOutput;
    }
  | { readonly status: "needs_adapter"; readonly reason: string }
  | { readonly status: "error"; readonly reason: string };

function extractCalculatorResultValue(
  results: readonly { readonly id: string; readonly value: number }[],
  id: string,
): number | null {
  const entry = results.find((item) => item.id === id);
  if (!entry || !Number.isFinite(entry.value)) {
    return null;
  }
  return entry.value;
}

function parseCurrency(value: string): number | null {
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  if (!cleaned) {
    return null;
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePercent(value: string): number | null {
  const match = value.match(/-?\d[\d,]*(?:\.\d+)?/);
  if (!match) {
    return null;
  }
  const parsed = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function findSecondaryValue(
  secondaryValues: readonly { readonly label: string; readonly value: string }[],
  labelIncludes: string,
): string | undefined {
  const entry = secondaryValues.find((item) =>
    item.label.toLowerCase().includes(labelIncludes.toLowerCase()),
  );
  return entry?.value;
}

function adaptLoanProduction(slug: FinanceOracleSlug, values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const monthlyPayment = parseCurrency(result.primaryValue);
  if (monthlyPayment === null) {
    return { status: "needs_adapter", reason: "Could not parse loan payment from primaryValue." };
  }
  return { status: "ok", output: { monthlyPayment } };
}

function adaptMortgageProduction(slug: FinanceOracleSlug, values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const monthlyPayment = parseCurrency(result.primaryValue);
  const totalPaid = parseCurrency(findSecondaryValue(result.secondaryValues, "total paid") ?? "");
  const totalInterest = parseCurrency(findSecondaryValue(result.secondaryValues, "total interest") ?? "");
  if (monthlyPayment === null || totalPaid === null || totalInterest === null) {
    return {
      status: "needs_adapter",
      reason: "Could not parse mortgage payment, total paid, or total interest from production output.",
    };
  }
  return { status: "ok", output: { monthlyPayment, totalPaid, totalInterest } };
}

function adaptSimpleInterestProduction(
  slug: FinanceOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const totalRepayment = parseCurrency(result.primaryValue);
  const interestAmount = parseCurrency(findSecondaryValue(result.secondaryValues, "interest") ?? "");
  if (totalRepayment === null || interestAmount === null) {
    return {
      status: "needs_adapter",
      reason: "Could not parse simple interest totals from production output.",
    };
  }
  return { status: "ok", output: { interestAmount, totalRepayment } };
}

function adaptCompoundInterestProduction(
  slug: FinanceOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const futureValue = parseCurrency(result.primaryValue);
  const interestEarned = parseCurrency(findSecondaryValue(result.secondaryValues, "interest earned") ?? "");
  if (futureValue === null || interestEarned === null) {
    return {
      status: "needs_adapter",
      reason: "Could not parse compound interest future value from production output.",
    };
  }
  return { status: "ok", output: { futureValue, interestEarned } };
}

function adaptProfitMarginProduction(
  slug: FinanceOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(slug, values, "en");
  const marginPercent = parsePercent(result.primaryValue);
  const markupPercent = parsePercent(findSecondaryValue(result.secondaryValues, "markup") ?? "");
  if (marginPercent === null || markupPercent === null) {
    return {
      status: "needs_adapter",
      reason: "Could not parse margin or markup percent from production output.",
    };
  }
  return { status: "ok", output: { marginPercent, markupPercent } };
}

function adaptRentVsBuyProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("rent-vs-buy-calculator", values, "en");
  if (result.primaryValue === "—") {
    return { status: "error", reason: result.explanation };
  }

  const rentNetPosition = parseCurrency(findSecondaryValue(result.secondaryValues, "rent net position") ?? "");
  const buyNetPosition = parseCurrency(findSecondaryValue(result.secondaryValues, "buy net position") ?? "");
  const netDifference = parseCurrency(findSecondaryValue(result.secondaryValues, "net difference") ?? "");
  const totalRentPaid = parseCurrency(findSecondaryValue(result.secondaryValues, "total rent paid") ?? "");
  const investmentValueIfRenting = parseCurrency(
    findSecondaryValue(result.secondaryValues, "investment value if renting") ?? "",
  );
  const monthlyMortgagePayment = parseCurrency(
    findSecondaryValue(result.secondaryValues, "monthly mortgage payment") ?? "",
  );
  const totalMortgagePaid = parseCurrency(findSecondaryValue(result.secondaryValues, "total mortgage paid") ?? "");
  const remainingMortgageBalance = parseCurrency(
    findSecondaryValue(result.secondaryValues, "remaining mortgage balance") ?? "",
  );
  const futureHomeValue = parseCurrency(findSecondaryValue(result.secondaryValues, "future home value") ?? "");
  const estimatedOwnershipCosts = parseCurrency(
    findSecondaryValue(result.secondaryValues, "estimated ownership costs") ?? "",
  );
  const estimatedSellingCosts = parseCurrency(
    findSecondaryValue(result.secondaryValues, "estimated selling costs") ?? "",
  );

  if (
    rentNetPosition === null ||
    buyNetPosition === null ||
    netDifference === null ||
    totalRentPaid === null ||
    investmentValueIfRenting === null ||
    monthlyMortgagePayment === null ||
    totalMortgagePaid === null ||
    remainingMortgageBalance === null ||
    futureHomeValue === null ||
    estimatedOwnershipCosts === null ||
    estimatedSellingCosts === null
  ) {
    return {
      status: "needs_adapter",
      reason: "Could not parse rent vs buy numeric outputs from production result.",
    };
  }

  return {
    status: "ok",
    output: {
      totalRentPaid,
      investmentValueIfRenting,
      monthlyMortgagePayment,
      totalMortgagePaid,
      remainingMortgageBalance,
      futureHomeValue,
      estimatedOwnershipCosts,
      estimatedSellingCosts,
      rentNetPosition,
      buyNetPosition,
      netDifference,
    },
  };
}

export function adaptProductionRentVsBuyOutput(
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  try {
    return adaptRentVsBuyProduction(values);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

function parsePlainNumber(value: string): number | null {
  const match = value.match(/-?\d[\d,]*(?:\.\d+)?/);
  if (!match) {
    return null;
  }
  const parsed = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseMinutes(value: string): number | null {
  const parsed = parsePlainNumber(value);
  return parsed;
}

function adaptBreakEvenProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("break-even-calculator", values, "en");
  if (result.primaryValue === "—") {
    return { status: "error", reason: result.explanation };
  }
  const breakEvenUnits = parsePlainNumber(result.primaryValue);
  const contributionMargin = parsePlainNumber(
    findSecondaryValue(result.secondaryValues, "contribution margin") ?? "",
  );
  if (breakEvenUnits === null || contributionMargin === null) {
    return { status: "needs_adapter", reason: "Could not parse break-even units or contribution margin." };
  }
  return { status: "ok", output: { breakEvenUnits, contributionMargin } };
}

function adaptSalaryCostProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("salary-cost-calculator", values, "en");
  const totalEmployerCost = parseCurrency(result.primaryValue);
  if (totalEmployerCost === null) {
    return { status: "needs_adapter", reason: "Could not parse total employer cost." };
  }
  return { status: "ok", output: { totalEmployerCost } };
}

function adaptCashFlowGapProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("cash-flow-gap-calculator", values, "en");
  const workingCapitalGap = parseCurrency(result.primaryValue);
  const gapDays = parsePlainNumber(findSecondaryValue(result.secondaryValues, "day difference") ?? "");
  if (workingCapitalGap === null || gapDays === null) {
    return { status: "needs_adapter", reason: "Could not parse working capital gap or day difference." };
  }
  return { status: "ok", output: { gapDays, workingCapitalGap } };
}

function adaptMachineTimeProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("machine-time-calculator", values, "en");
  const machineCost = parseCurrency(result.primaryValue);
  const totalMinutes = parseMinutes(findSecondaryValue(result.secondaryValues, "total time") ?? "");
  if (machineCost === null || totalMinutes === null) {
    return { status: "needs_adapter", reason: "Could not parse machine cost or total minutes." };
  }
  return { status: "ok", output: { totalMinutes, machineCost } };
}

function adaptCncQuoteRiskProduction(values: PremiumInputValues): ProductionAdapterResult {
  const report = calculatePremiumDecisionReport("cnc-quote-risk-analyzer", values);
  if (!Number.isFinite(report.baseCost)) {
    return { status: "needs_adapter", reason: "Could not read numeric baseCost from premium report." };
  }
  return { status: "ok", output: { baseCost: report.baseCost } };
}

export function adaptProductionBusinessOperationsOutput(
  slug: BusinessOperationsOracleSlug,
  values: FreeTrafficInputValues | PremiumInputValues,
): ProductionAdapterResult {
  try {
    switch (slug) {
      case "break-even-calculator":
        return adaptBreakEvenProduction(values as FreeTrafficInputValues);
      case "salary-cost-calculator":
        return adaptSalaryCostProduction(values as FreeTrafficInputValues);
      case "cash-flow-gap-calculator":
        return adaptCashFlowGapProduction(values as FreeTrafficInputValues);
      case "machine-time-calculator":
        return adaptMachineTimeProduction(values as FreeTrafficInputValues);
      case "cnc-quote-risk-analyzer":
        return adaptCncQuoteRiskProduction(values as PremiumInputValues);
      default: {
        const unsupported: never = slug;
        return { status: "needs_adapter", reason: `No production adapter for slug "${unsupported}".` };
      }
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

function adaptProjectCostProduction(values: CalculatorInputValues): ProductionAdapterResult {
  try {
    const wastePercent =
      values.deadlinePressureWastePercent !== undefined
        ? Number(values.deadlinePressureWastePercent)
        : mapDeadlinePressureToWastePercent(
            values.deadlinePressure as string | number | undefined,
          ) ?? 5;
    const output = calculateProjectChangeOrderFreeOracle({
      originalBudget: Number(values.originalBudget),
      changeEstimate: Number(values.changeEstimate),
      deadlinePressureWastePercent: wastePercent,
    });
    return { status: "ok", output };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

function adaptCleaningCostProduction(values: CalculatorInputValues): ProductionAdapterResult {
  try {
    const output = calculateCleaningIssaFreeOracle({
      areaSize: Number(values.areaSize),
      staffCount: Number(values.staffCount),
      visitFrequency: Number(values.visitFrequency),
    });
    return { status: "ok", output };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

function adaptFoodCostProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(
    "food-cost-calculator",
    values as FreeTrafficInputValues,
    "en",
  );
  const foodCostPercent = parsePercent(result.primaryValue);
  if (foodCostPercent === null) {
    return { status: "needs_adapter", reason: "Could not parse food cost percent from production output." };
  }
  return { status: "ok", output: { foodCostPercent } };
}

function adaptProductMarginProduction(values: CalculatorInputValues): ProductionAdapterResult {
  try {
    const returnRateRaw = values.returnRate;
    const returnRate =
      returnRateRaw === undefined || returnRateRaw === ""
        ? 0
        : Number(returnRateRaw);
    const output = calculateProductMarginDtcFreeOracle({
      productPrice: Number(values.productPrice),
      productCost: Number(values.productCost),
      returnRate,
    });
    return { status: "ok", output };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

function adaptWeldingCostProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool(
    "welding-cost-estimator",
    values as FreeTrafficInputValues,
    "en",
  );
  const estimatedCost = parseCurrency(result.primaryValue);
  const laborCost = parseCurrency(findSecondaryValue(result.secondaryValues, "labor") ?? "");
  if (estimatedCost === null || laborCost === null) {
    return { status: "needs_adapter", reason: "Could not parse welding cost from production output." };
  }
  return { status: "ok", output: { estimatedCost, laborCost } };
}

function adaptChangeOrderImpactProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const run = runCalculator("change-order-impact-analyzer", values);
  if (!run) {
    return { status: "error", reason: "Change order calculator returned no result." };
  }
  if (Object.keys(run.errors).length > 0) {
    return { status: "error", reason: Object.values(run.errors).join(" ") };
  }
  const extraDirectCost = extractCalculatorResultValue(run.results, "extraDirectCost");
  const minimumSafeChangePrice = extractCalculatorResultValue(run.results, "minimumSafeChangePrice");
  const delayCost = extractCalculatorResultValue(run.results, "delayCost");
  if (extraDirectCost === null || minimumSafeChangePrice === null || delayCost === null) {
    return { status: "needs_adapter", reason: "Could not parse change order calculator outputs." };
  }
  return { status: "ok", output: { extraDirectCost, minimumSafeChangePrice, delayCost } };
}

function adaptOfficeCleaningBidProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const run = runCalculator("office-cleaning-bid-optimizer", values);
  if (!run) {
    return { status: "error", reason: "Office cleaning bid calculator returned no result." };
  }
  if (Object.keys(run.errors).length > 0) {
    return { status: "error", reason: Object.values(run.errors).join(" ") };
  }
  const monthlyDirectCost = extractCalculatorResultValue(run.results, "monthlyDirectCost");
  const minimumSafeMonthlyBid = extractCalculatorResultValue(run.results, "minimumSafeMonthlyBid");
  if (monthlyDirectCost === null || minimumSafeMonthlyBid === null) {
    return { status: "needs_adapter", reason: "Could not parse office cleaning bid outputs." };
  }
  return { status: "ok", output: { monthlyDirectCost, minimumSafeMonthlyBid } };
}

function adaptMenuProfitLeakProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const run = runCalculator("menu-profit-leak-detector", values);
  if (!run) {
    return { status: "error", reason: "Menu profit leak calculator returned no result." };
  }
  if (Object.keys(run.errors).length > 0) {
    return { status: "error", reason: Object.values(run.errors).join(" ") };
  }
  const actualMargin = extractCalculatorResultValue(run.results, "actualMargin");
  const minimumSafePrice = extractCalculatorResultValue(run.results, "minimumSafePrice");
  if (actualMargin === null || minimumSafePrice === null) {
    return { status: "needs_adapter", reason: "Could not parse menu profit leak margin outputs." };
  }
  const grossProfitPerItem = extractCalculatorResultValue(run.results, "grossProfitPerItem");
  const sellingPrice = Number(values.sellingPrice);
  const totalCostPerItem =
    grossProfitPerItem !== null && Number.isFinite(sellingPrice)
      ? sellingPrice - grossProfitPerItem
      : null;
  if (totalCostPerItem === null) {
    return { status: "needs_adapter", reason: "Could not derive menu total cost per item." };
  }
  return { status: "ok", output: { totalCostPerItem, actualMargin, minimumSafePrice } };
}

function adaptReturnProfitErosionProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const run = runCalculator("return-rate-profit-erosion-tool", values);
  if (!run) {
    return { status: "error", reason: "Return profit erosion calculator returned no result." };
  }
  if (Object.keys(run.errors).length > 0) {
    return { status: "error", reason: Object.values(run.errors).join(" ") };
  }
  const netProfit = extractCalculatorResultValue(run.results, "netProfit");
  const netMargin = extractCalculatorResultValue(run.results, "netMargin");
  const returnImpact = extractCalculatorResultValue(run.results, "returnImpact");
  if (netProfit === null || netMargin === null || returnImpact === null) {
    return { status: "needs_adapter", reason: "Could not parse return profit erosion outputs." };
  }
  return { status: "ok", output: { netProfit, netMargin, returnImpact } };
}

function adaptWeldingBidRiskProduction(values: PremiumInputValues): ProductionAdapterResult {
  const report = calculatePremiumDecisionReport("welding-bid-risk-analyzer", values);
  if (
    !Number.isFinite(report.baseCost) ||
    !Number.isFinite(report.p90Cost) ||
    !Number.isFinite(report.minimumSafePrice)
  ) {
    return { status: "needs_adapter", reason: "Could not read numeric welding bid report outputs." };
  }
  return {
    status: "ok",
    output: {
      baseCost: report.baseCost,
      p90Cost: report.p90Cost,
      minimumSafePrice: report.minimumSafePrice,
    },
  };
}

export function adaptProductionBatchPremiumOutput(
  slug: BatchPremiumOracleSlug,
  values: CalculatorInputValues | PremiumInputValues,
): ProductionAdapterResult {
  try {
    switch (slug) {
      case "change-order-impact-analyzer":
        return adaptChangeOrderImpactProduction(values as CalculatorInputValues);
      case "office-cleaning-bid-optimizer":
        return adaptOfficeCleaningBidProduction(values as CalculatorInputValues);
      case "menu-profit-leak-detector":
        return adaptMenuProfitLeakProduction(values as CalculatorInputValues);
      case "return-profit-erosion-tool":
        return adaptReturnProfitErosionProduction(values as CalculatorInputValues);
      case "welding-bid-risk-analyzer":
        return adaptWeldingBidRiskProduction(values as PremiumInputValues);
      default: {
        const unsupported: never = slug;
        return { status: "needs_adapter", reason: `No production adapter for slug "${unsupported}".` };
      }
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

function adaptSampleSizeProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("sample-size-calculator", values, "en");
  const requiredSample = parsePlainNumber(result.primaryValue);
  const infinitePopulationEstimate = parsePlainNumber(
    findSecondaryValue(result.secondaryValues, "infinite population") ?? "",
  );
  if (requiredSample === null || infinitePopulationEstimate === null) {
    return { status: "needs_adapter", reason: "Could not parse sample size outputs." };
  }
  return { status: "ok", output: { requiredSample, infinitePopulationEstimate } };
}

function adaptHvacTonnageProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const squareFootage = Number(values.squareFootage);
  if (squareFootage <= 0) {
    return { status: "error", reason: "Square footage must be greater than zero." };
  }
  const occupancyCount = Math.max(2, Math.round(squareFootage / 400));
  const buildingLoad = squareFootage * 25;
  const windowLoad = squareFootage * 0.15 * 100;
  const occupancyLoad = occupancyCount * 600;
  const totalBtu = Math.round(buildingLoad + windowLoad + occupancyLoad);
  const totalTons = Math.round((totalBtu / 12000) * 100) / 100;
  const recommendedTons = Math.ceil(totalTons);
  return { status: "ok", output: { totalBtu, totalTons, recommendedTons } };
}

function adaptElectricalLaborProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const laborHours = Number(values.laborHours);
  const laborRate = Number(values.laborRate);
  const materialCost = Number(values.materialCost);
  if (laborHours < 0 || materialCost < 0) {
    return { status: "error", reason: "Hours and material cost cannot be negative." };
  }
  const effectiveRate = Math.max(laborRate, 1);
  const laborCost = laborHours * effectiveRate;
  const laborMaterialRatio = materialCost > 0 ? (laborCost / materialCost) * 100 : 0;
  return { status: "ok", output: { laborCost, laborMaterialRatio } };
}

function adaptLawnCareCostProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const crewHoursPerVisit = Number(values.crewHoursPerVisit);
  const visitsPerMonth = Number(values.visitsPerMonth);
  const laborRate = Number(values.laborRate);
  if (crewHoursPerVisit < 0 || visitsPerMonth < 0) {
    return { status: "error", reason: "Crew hours and visits cannot be negative." };
  }
  const monthlyLoad = crewHoursPerVisit * visitsPerMonth;
  const monthlyLaborCost = monthlyLoad * Math.max(laborRate, 0);
  return { status: "ok", output: { monthlyLoad, monthlyLaborCost } };
}

function adaptRepairTimeVsPriceProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const repairHours = Number(values.repairHours);
  const partsCost = Number(values.partsCost);
  const quotedPrice = Number(values.quotedPrice);
  if (repairHours < 0 || partsCost < 0) {
    return { status: "error", reason: "Repair hours and parts cost cannot be negative." };
  }
  const shopRate = 80;
  const mitchellTotalHours = 1.2;
  const visibleCost = repairHours * shopRate + partsCost;
  const burdenedCost = visibleCost + shopRate * 0.75;
  if (!Number.isFinite(quotedPrice)) {
    return { status: "error", reason: "Quoted price must be numeric." };
  }
  return { status: "ok", output: { visibleCost, burdenedCost, mitchellTotalHours } };
}

function adaptPrintJobCostProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const designHours = Number(values.designHours);
  const laborRate = Number(values.laborRate);
  const materialCost = Number(values.materialCost);
  const designCost = designHours * Math.max(laborRate, 1);
  const designMaterialRatio = materialCost > 0 ? designCost / materialCost : 0;
  return { status: "ok", output: { designCost, designMaterialRatio } };
}

function adaptPlumbingJobMarginProduction(values: PremiumInputValues): ProductionAdapterResult {
  const report = calculatePremiumDecisionReport("plumbing-job-margin-verdict", values);
  if (
    !Number.isFinite(report.baseCost) ||
    !Number.isFinite(report.p90Cost) ||
    !Number.isFinite(report.minimumSafePrice)
  ) {
    return { status: "needs_adapter", reason: "Could not read numeric plumbing premium report outputs." };
  }
  return {
    status: "ok",
    output: {
      baseCost: report.baseCost,
      p90Cost: report.p90Cost,
      minimumSafePrice: report.minimumSafePrice,
    },
  };
}

function adaptCabinetCostProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const laborHours = Number(values.laborHours);
  const installHours = Number(values.installHours);
  const totalHours = laborHours + installHours;
  const wasteAdjustedHours = totalHours * 1.12;
  return { status: "ok", output: { totalHours, wasteAdjustedHours } };
}

function adaptRoofingSquareCostProduction(values: CalculatorInputValues): ProductionAdapterResult {
  const laborHours = Number(values.laborHours);
  const laborRate = Number(values.laborRate);
  const materialCost = Number(values.materialCost);
  const effectiveRate = Math.max(laborRate, 1);
  const laborCost = laborHours * effectiveRate;
  const estimatedSqFt =
    materialCost > 0 ? (materialCost / 350) * 100 : Math.max(1000, laborHours * 80);
  const squares = estimatedSqFt / 100;
  const pitchFactor = 1.1;
  const materialNrca = squares * 350 * pitchFactor;
  const laborNrca = squares * 300 * pitchFactor;
  const removalCost = squares * 100;
  const wasteAllowance = (materialNrca + laborNrca) * 0.1;
  const nrcaEstimate = materialNrca + laborNrca + removalCost + wasteAllowance;
  const laborMaterialRatio = materialCost > 0 ? (laborCost / materialCost) * 100 : 0;
  return {
    status: "ok",
    output: {
      laborCost,
      nrcaEstimate: Math.round(nrcaEstimate * 100) / 100,
      laborMaterialRatio,
    },
  };
}

function adaptLaserCuttingTimeProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("laser-cutting-time-check", values, "en");
  const totalMinutes = parseMinutes(result.primaryValue);
  const cutMinutes = parseMinutes(findSecondaryValue(result.secondaryValues, "cut path") ?? "");
  if (totalMinutes === null) {
    return { status: "needs_adapter", reason: "Could not parse laser cutting total minutes." };
  }
  return {
    status: "ok",
    output: {
      totalMinutes,
      cutMinutes: cutMinutes ?? 0,
    },
  };
}

export function adaptProductionBatchFreeBatch2Output(
  slug: BatchFreeBatch2OracleSlug,
  values: CalculatorInputValues | FreeTrafficInputValues | PremiumInputValues,
): ProductionAdapterResult {
  try {
    switch (slug) {
      case "sample-size-calculator":
        return adaptSampleSizeProduction(values as FreeTrafficInputValues);
      case "hvac-tonnage-rule-check":
        return adaptHvacTonnageProduction(values as CalculatorInputValues);
      case "electrical-labor-estimator":
        return adaptElectricalLaborProduction(values as CalculatorInputValues);
      case "lawn-care-cost-check":
        return adaptLawnCareCostProduction(values as CalculatorInputValues);
      case "repair-time-vs-price-check":
        return adaptRepairTimeVsPriceProduction(values as CalculatorInputValues);
      case "print-job-cost-check":
        return adaptPrintJobCostProduction(values as CalculatorInputValues);
      case "plumbing-job-margin-verdict":
        return adaptPlumbingJobMarginProduction(values as PremiumInputValues);
      case "cabinet-cost-estimator":
        return adaptCabinetCostProduction(values as CalculatorInputValues);
      case "roofing-square-cost-check":
        return adaptRoofingSquareCostProduction(values as CalculatorInputValues);
      case "laser-cutting-time-check":
        return adaptLaserCuttingTimeProduction(values as FreeTrafficInputValues);
      default: {
        const unsupported: never = slug;
        return { status: "needs_adapter", reason: `No production adapter for slug "${unsupported}".` };
      }
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

function adaptPremiumMarginProduction(
  slug: string,
  values: PremiumInputValues,
): ProductionAdapterResult {
  const report = calculatePremiumDecisionReport(slug, values);
  if (
    !Number.isFinite(report.baseCost) ||
    !Number.isFinite(report.p90Cost) ||
    !Number.isFinite(report.minimumSafePrice)
  ) {
    return { status: "needs_adapter", reason: `Could not read numeric premium report outputs for ${slug}.` };
  }
  return {
    status: "ok",
    output: {
      baseCost: report.baseCost,
      p90Cost: report.p90Cost,
      minimumSafePrice: report.minimumSafePrice,
    },
  };
}

function adapt3dPrintCostProduction(values: FreeTrafficInputValues): ProductionAdapterResult {
  const result = calculateFreeTrafficTool("3d-print-cost-check", values, "en");
  const estimatedCost = parseCurrency(result.primaryValue);
  const machineTimeCost = parseCurrency(
    findSecondaryValue(result.secondaryValues, "machine time") ?? "",
  );
  if (estimatedCost === null || machineTimeCost === null) {
    return { status: "needs_adapter", reason: "Could not parse 3D print cost outputs." };
  }
  return { status: "ok", output: { estimatedCost, machineTimeCost } };
}

export function adaptProductionBatchPremiumBatch3Output(
  slug: BatchPremiumBatch3OracleSlug,
  values: CalculatorInputValues | FreeTrafficInputValues | PremiumInputValues,
): ProductionAdapterResult {
  try {
    switch (slug) {
      case "hvac-project-margin-guard":
      case "panel-shop-margin-verdict":
      case "landscaping-contract-profit-tool":
      case "auto-shop-margin-leak-detector":
      case "signage-bid-safe-price-tool":
      case "millwork-bid-risk-analyzer":
      case "roofing-contract-margin-guard":
      case "painting-job-profit-verdict":
      case "sheet-metal-quote-risk-tool":
        return adaptPremiumMarginProduction(slug, values as PremiumInputValues);
      case "3d-print-cost-check":
        return adapt3dPrintCostProduction(values as FreeTrafficInputValues);
      default: {
        const unsupported: never = slug;
        return { status: "needs_adapter", reason: `No production adapter for slug "${unsupported}".` };
      }
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

export function adaptProductionBatchFreeOutput(
  slug: BatchFreeOracleSlug,
  values: CalculatorInputValues,
): ProductionAdapterResult {
  try {
    switch (slug) {
      case "project-cost-calculator":
        return adaptProjectCostProduction(values);
      case "cleaning-cost-calculator":
        return adaptCleaningCostProduction(values);
      case "food-cost-calculator":
        return adaptFoodCostProduction(values);
      case "product-margin-calculator":
        return adaptProductMarginProduction(values);
      case "welding-cost-estimator":
        return adaptWeldingCostProduction(values);
      default: {
        const unsupported: never = slug;
        return { status: "needs_adapter", reason: `No production adapter for slug "${unsupported}".` };
      }
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

export type NormalizedBatchTrafficCatalogProductionOutput = Readonly<Record<string, number>>;

function parseTrafficCatalogPrimaryValue(
  value: string,
  parseKind: "plain" | "currency" | "percent" | "integer",
): number | null {
  switch (parseKind) {
    case "currency":
      return parseCurrency(value);
    case "percent":
      return parsePercent(value);
    case "integer":
      return parsePlainNumber(value);
    case "plain":
    default:
      return parsePlainNumber(value);
  }
}

function adaptBatchTrafficCatalogProduction(
  slug: BatchTrafficCatalogOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  const spec = getBatchTrafficCatalogOracleSpec(slug);
  const result = calculateFreeTrafficTool(slug, values, "en");
  if (result.primaryValue === "—") {
    return { status: "error", reason: "Production returned unavailable output for invalid inputs." };
  }

  let primary = parseTrafficCatalogPrimaryValue(result.primaryValue, spec.parseKind);
  if (primary === null && slug === "time-duration-calculator") {
    primary = parsePlainNumber(findSecondaryValue(result.secondaryValues, "total minutes") ?? "");
  }
  if (primary === null && slug === "cnc-cycle-time-calculator") {
    primary = parsePlainNumber(result.primaryValue.replace(/[^\d.]/g, ""));
  }
  if (primary === null) {
    return {
      status: "needs_adapter",
      reason: `Could not parse ${spec.primaryKey} from production primaryValue.`,
    };
  }

  const output: Record<string, number> = { [spec.primaryKey]: primary };
  return { status: "ok", output };
}

export function adaptProductionBatchTrafficCatalogOutput(
  slug: BatchTrafficCatalogOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  if (!isBatchTrafficCatalogOracleSlug(slug)) {
    return { status: "needs_adapter", reason: `Slug "${slug}" is not a traffic catalog oracle slug.` };
  }
  try {
    return adaptBatchTrafficCatalogProduction(slug, values);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

export function adaptProductionFinanceOutput(
  slug: FinanceOracleSlug,
  values: FreeTrafficInputValues,
): ProductionAdapterResult {
  try {
    switch (slug) {
      case "loan-payment-calculator":
        return adaptLoanProduction(slug, values);
      case "mortgage-calculator":
        return adaptMortgageProduction(slug, values);
      case "interest-calculator":
        return adaptSimpleInterestProduction(slug, values);
      case "compound-interest-calculator":
        return adaptCompoundInterestProduction(slug, values);
      case "profit-margin-calculator":
        return adaptProfitMarginProduction(slug, values);
      default:
        return { status: "needs_adapter", reason: `No production adapter for slug "${slug}".` };
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: "error", reason };
  }
}

export const PRODUCTION_ADAPTER_EXPORTS = {
  parseCurrency,
  parsePercent,
} as const;
