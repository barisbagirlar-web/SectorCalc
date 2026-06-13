import {
  validateDairyFeedEfficiencyLossInputs,
  type DairyFeedEfficiencyLossInputs,
} from "@/lib/premium-schema/calculators/dairy-feed-efficiency-loss-validation";

export type { DairyFeedEfficiencyLossInputs };

export type DairyFeedEfficiencyLossSummaryLevel = "low" | "warning" | "critical";

export type DairyFeedEfficiencyLossPrimaryDriver = "feedCost" | "milkRevenueGap";

export type DairyFeedEfficiencyLossResult = {
  feedCost: number;
  milkRevenueGap: number;
  totalExposure: number;
  summaryLevel: DairyFeedEfficiencyLossSummaryLevel;
  primaryDriver: DairyFeedEfficiencyLossPrimaryDriver;
  decisionVerdict: {
    summaryLevel: DairyFeedEfficiencyLossSummaryLevel;
    primaryDriver: DairyFeedEfficiencyLossPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const MILK_YIELD_WARNING_THRESHOLD = 22;
const MILK_YIELD_CRITICAL_THRESHOLD = 18;

function resolveSummaryLevel(milkLitersPerCowPerDay: number): DairyFeedEfficiencyLossSummaryLevel {
  if (milkLitersPerCowPerDay <= MILK_YIELD_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (milkLitersPerCowPerDay <= MILK_YIELD_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolvePrimaryDriver(
  feedCost: number,
  milkRevenueGap: number,
): DairyFeedEfficiencyLossPrimaryDriver {
  return feedCost >= milkRevenueGap ? "feedCost" : "milkRevenueGap";
}

function resolveDecisionMessage(summaryLevel: DairyFeedEfficiencyLossSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Milk yield is above the warning band. Continue monitoring feed cost and yield assumptions against herd targets.";
  }
  if (summaryLevel === "warning") {
    return "Milk yield is below target band. Review feed efficiency, ration cost and yield recovery before expanding herd spend.";
  }
  return "Critical yield gap detected. Feed cost may exceed milk revenue recovery — validate nutrition and milk price assumptions immediately.";
}

export function calculateDairyFeedEfficiencyLoss(
  inputs: DairyFeedEfficiencyLossInputs,
): DairyFeedEfficiencyLossResult {
  const validation = validateDairyFeedEfficiencyLossInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const feedCost = inputs.cows * inputs.feedCostPerCowPerDay * inputs.days;
  const milkRevenueGap =
    inputs.cows *
    Math.max(inputs.targetMilkLitersPerCowPerDay - inputs.milkLitersPerCowPerDay, 0) *
    inputs.milkPricePerLiter *
    inputs.days;
  const totalExposure = feedCost + milkRevenueGap;
  const summaryLevel = resolveSummaryLevel(inputs.milkLitersPerCowPerDay);
  const primaryDriver = resolvePrimaryDriver(feedCost, milkRevenueGap);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    feedCost,
    milkRevenueGap,
    totalExposure,
    summaryLevel,
    primaryDriver,
    decisionVerdict: {
      summaryLevel,
      primaryDriver,
      message,
    },
    warnings: [...validation.warnings],
  };
}
