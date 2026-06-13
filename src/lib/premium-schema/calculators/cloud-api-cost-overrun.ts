import {
  validateCloudApiCostOverrunInputs,
  type CloudApiCostOverrunInputs,
} from "@/lib/premium-schema/calculators/cloud-api-cost-overrun-validation";

export type { CloudApiCostOverrunInputs };

export type CloudApiCostOverrunSummaryLevel = "low" | "warning" | "critical";

export type CloudApiCostOverrunPrimaryDriver = "totalCloudCost" | "apiCallCost";

export type CloudApiCostOverrunResult = {
  apiCallCost: number;
  totalCloudCost: number;
  revenuePressure: number;
  summaryLevel: CloudApiCostOverrunSummaryLevel;
  primaryDriver: CloudApiCostOverrunPrimaryDriver;
  decisionVerdict: {
    summaryLevel: CloudApiCostOverrunSummaryLevel;
    primaryDriver: CloudApiCostOverrunPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const REVENUE_PRESSURE_WARNING_THRESHOLD = 15;
const REVENUE_PRESSURE_CRITICAL_THRESHOLD = 30;

function resolveSummaryLevel(revenuePressure: number): CloudApiCostOverrunSummaryLevel {
  if (revenuePressure >= REVENUE_PRESSURE_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (revenuePressure >= REVENUE_PRESSURE_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolvePrimaryDriver(
  apiCallCost: number,
  totalCloudCost: number,
): CloudApiCostOverrunPrimaryDriver {
  return apiCallCost >= totalCloudCost - apiCallCost ? "apiCallCost" : "totalCloudCost";
}

function resolveDecisionMessage(summaryLevel: CloudApiCostOverrunSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Cloud cost pressure is below the warning threshold. Monitor API volume and fixed stack spend as usage scales.";
  }
  if (summaryLevel === "warning") {
    return "Cloud stack is consuming a material share of revenue. Review API unit economics and compute/storage scope.";
  }
  return "Cloud cost pressure is critical. Prioritize unit economics, rate limits and infrastructure spend before scaling traffic.";
}

export function calculateCloudApiCostOverrun(
  inputs: CloudApiCostOverrunInputs,
): CloudApiCostOverrunResult {
  const validation = validateCloudApiCostOverrunInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const apiCallCost = (inputs.monthlyApiCalls / 1000) * inputs.costPerThousandCalls;
  const totalCloudCost = apiCallCost + inputs.computeCost + inputs.storageCost;
  const revenuePressure = (totalCloudCost / inputs.monthlyRevenue) * 100;
  const summaryLevel = resolveSummaryLevel(revenuePressure);
  const primaryDriver = resolvePrimaryDriver(apiCallCost, totalCloudCost);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    apiCallCost,
    totalCloudCost,
    revenuePressure,
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
