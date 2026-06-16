// Auto-generated from piotroski-f-score-schema.json
import * as z from 'zod';

export interface Piotroski_f_scoreInput {
  netIncome: number;
  netIncomePrev: number;
  operatingCashFlow: number;
  totalAssets: number;
  totalAssetsPrev: number;
  longTermDebt: number;
  longTermDebtPrev: number;
  grossMargin: number;
  grossMarginPrev: number;
  assetTurnover: number;
  assetTurnoverPrev: number;
  sharesOutstanding: number;
  sharesOutstandingPrev: number;
}

export const Piotroski_f_scoreInputSchema = z.object({
  netIncome: z.number().default(0),
  netIncomePrev: z.number().default(0),
  operatingCashFlow: z.number().default(0),
  totalAssets: z.number().default(0),
  totalAssetsPrev: z.number().default(0),
  longTermDebt: z.number().default(0),
  longTermDebtPrev: z.number().default(0),
  grossMargin: z.number().default(0),
  grossMarginPrev: z.number().default(0),
  assetTurnover: z.number().default(0),
  assetTurnoverPrev: z.number().default(0),
  sharesOutstanding: z.number().default(0),
  sharesOutstandingPrev: z.number().default(0),
});

function evaluateAllFormulas(input: Piotroski_f_scoreInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.netIncome > 0) ? 1 : 0) + ((input.operatingCashFlow > 0) ? 1 : 0) + ((input.netIncome > input.netIncomePrev) ? 1 : 0) + ((input.operatingCashFlow > input.netIncome) ? 1 : 0); results["profitabilityScore"] = Number.isFinite(v) ? v : 0; } catch { results["profitabilityScore"] = 0; }
  try { const v = ((input.longTermDebt < input.longTermDebtPrev) ? 1 : 0) + ((input.totalAssets > input.totalAssetsPrev) ? 1 : 0); results["leverageScore"] = Number.isFinite(v) ? v : 0; } catch { results["leverageScore"] = 0; }
  try { const v = ((input.grossMargin > input.grossMarginPrev) ? 1 : 0) + ((input.assetTurnover > input.assetTurnoverPrev) ? 1 : 0); results["operatingEfficiencyScore"] = Number.isFinite(v) ? v : 0; } catch { results["operatingEfficiencyScore"] = 0; }
  try { const v = (results["profitabilityScore"] ?? 0) + (results["leverageScore"] ?? 0) + (results["operatingEfficiencyScore"] ?? 0); results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  return results;
}


export function calculatePiotroski_f_score(input: Piotroski_f_scoreInput): Piotroski_f_scoreOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalScore"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Piotroski_f_scoreOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
