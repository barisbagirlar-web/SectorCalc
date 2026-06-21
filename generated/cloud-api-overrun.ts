// Auto-generated from cloud-api-overrun-schema.json
import * as z from 'zod';

export interface Cloud_api_overrunInput {
  TotalRequests: number;
  IncludedRequests: number;
  OverageRate: number;
  ThrottledRequests: number;
  RetryCost: number;
  AvgRetries: number;
  DataOutGB: number;
  EgressRate: number;
  Availability: number;
  SLA: number;
  MonthlyFee: number;
  CreditPct: number;
  dataConfidence?: number;
}

export const Cloud_api_overrunInputSchema = z.object({
  TotalRequests: z.number().min(0).default(0),
  IncludedRequests: z.number().min(0).default(0),
  OverageRate: z.number().min(0).default(0),
  ThrottledRequests: z.number().min(0).default(0),
  RetryCost: z.number().min(0).default(0),
  AvgRetries: z.number().min(0).default(0),
  DataOutGB: z.number().min(0).default(0),
  EgressRate: z.number().min(0).default(0),
  Availability: z.number().min(0).default(0),
  SLA: z.number().min(0).default(0),
  MonthlyFee: z.number().min(0).default(0),
  CreditPct: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cloud_api_overrunInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.TotalRequests - input.IncludedRequests); results["OverrunRequests"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OverrunRequests"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["OverrunRequests"])) * input.OverageRate; results["OverrunCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OverrunCost"] = Number.NaN; }
  try { const v = input.ThrottledRequests * input.RetryCost * input.AvgRetries; results["ThrottlingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ThrottlingCost"] = Number.NaN; }
  try { const v = input.DataOutGB * input.EgressRate; results["DataEgressCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DataEgressCost"] = Number.NaN; }
  try { const v = ((input.Availability < input.SLA) ? (input.MonthlyFee * input.CreditPct) : (0)); results["SLABreachPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SLABreachPenalty"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["OverrunCost"])) + (toNumericFormulaValue(results["ThrottlingCost"])) + (toNumericFormulaValue(results["DataEgressCost"])) + (toNumericFormulaValue(results["SLABreachPenalty"])); results["TotalOverrunCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalOverrunCost"] = Number.NaN; }
  return results;
}


export function calculateCloud_api_overrun(input: Cloud_api_overrunInput): Cloud_api_overrunOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalOverrunCost"]);
  const breakdown = {
    OverrunRequests: toNumericFormulaValue(values["OverrunRequests"]),
    OverrunCost: toNumericFormulaValue(values["OverrunCost"]),
    ThrottlingCost: toNumericFormulaValue(values["ThrottlingCost"]),
    DataEgressCost: toNumericFormulaValue(values["DataEgressCost"]),
    SLABreachPenalty: toNumericFormulaValue(values["SLABreachPenalty"]),
    TotalOverrunCost: toNumericFormulaValue(values["TotalOverrunCost"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Cloud_api_overrunOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { OverrunRequests: number; OverrunCost: number; ThrottlingCost: number; DataEgressCost: number; SLABreachPenalty: number; TotalOverrunCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cloud_api_overrunOutputMeta = {
  primaryKey: "TotalOverrunCost",
  unit: "USD",
  breakdownKeys: ["OverrunRequests","OverrunCost","ThrottlingCost","DataEgressCost","SLABreachPenalty","TotalOverrunCost"],
} as const;

