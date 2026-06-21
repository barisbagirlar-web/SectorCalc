// Auto-generated from teklif-risk-analizoru-schema.json
import * as z from 'zod';

export interface Teklif_risk_analizoruInput {
  DirectCosts: number;
  Overhead: number;
  RiskFactor: number;
  BidPrice: number;
  CompetitorIndex: number;
  HistoricalWinRate: number;
  TargetMargin: number;
  RiskPremium: number;
  dataConfidence?: number;
}

export const Teklif_risk_analizoruInputSchema = z.object({
  DirectCosts: z.number().min(0).default(0),
  Overhead: z.number().min(0).default(0),
  RiskFactor: z.number().min(0).default(0),
  BidPrice: z.number().min(0).default(0),
  CompetitorIndex: z.number().min(0).default(0),
  HistoricalWinRate: z.number().min(0).default(0),
  TargetMargin: z.number().min(0).default(0),
  RiskPremium: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Teklif_risk_analizoruInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["BaseEstimate"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["BaseEstimate"])) * input.RiskFactor; results["Contingency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Contingency"] = Number.NaN; }
  try { const v = (input.BidPrice - ((toNumericFormulaValue(results["BaseEstimate"])) + (toNumericFormulaValue(results["Contingency"])))) / input.BidPrice; results["ExpectedMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ExpectedMargin"] = Number.NaN; }
  results["WinProbability"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["WinProbability"])) * (toNumericFormulaValue(results["ExpectedMargin"])) * input.BidPrice; results["ExpectedValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ExpectedValue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["BaseEstimate"])) / (1 - input.TargetMargin - input.RiskPremium); results["RiskAdjustedBid"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RiskAdjustedBid"] = Number.NaN; }
  return results;
}


export function calculateTeklif_risk_analizoru(input: Teklif_risk_analizoruInput): Teklif_risk_analizoruOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["RiskAdjustedBid"]);
  const breakdown = {
    BaseEstimate: toNumericFormulaValue(values["BaseEstimate"]),
    Contingency: toNumericFormulaValue(values["Contingency"]),
    ExpectedMargin: toNumericFormulaValue(values["ExpectedMargin"]),
    WinProbability: toNumericFormulaValue(values["WinProbability"]),
    ExpectedValue: toNumericFormulaValue(values["ExpectedValue"]),
    RiskAdjustedBid: toNumericFormulaValue(values["RiskAdjustedBid"])
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


export interface Teklif_risk_analizoruOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { BaseEstimate: number; Contingency: number; ExpectedMargin: number; WinProbability: number; ExpectedValue: number; RiskAdjustedBid: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Teklif_risk_analizoruOutputMeta = {
  primaryKey: "RiskAdjustedBid",
  unit: "USD",
  breakdownKeys: ["BaseEstimate","Contingency","ExpectedMargin","WinProbability","ExpectedValue","RiskAdjustedBid"],
} as const;

