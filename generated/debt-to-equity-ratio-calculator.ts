// Auto-generated from debt-to-equity-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_to_equity_ratio_calculatorInput {
  totalAssets: number;
  longTermDebt: number;
  currentLiabilities: number;
  otherLiabilities: number;
}

export const Debt_to_equity_ratio_calculatorInputSchema = z.object({
  totalAssets: z.number().default(200000),
  longTermDebt: z.number().default(40000),
  currentLiabilities: z.number().default(60000),
  otherLiabilities: z.number().default(10000),
});

function evaluateAllFormulas(input: Debt_to_equity_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.longTermDebt + input.currentLiabilities + input.otherLiabilities) / (input.totalAssets - (input.longTermDebt + input.currentLiabilities + input.otherLiabilities)); results["debtToEquity"] = Number.isFinite(v) ? v : 0; } catch { results["debtToEquity"] = 0; }
  try { const v = input.longTermDebt + input.currentLiabilities + input.otherLiabilities; results["totalLiabilities"] = Number.isFinite(v) ? v : 0; } catch { results["totalLiabilities"] = 0; }
  try { const v = input.totalAssets - (input.longTermDebt + input.currentLiabilities + input.otherLiabilities); results["shareholdersEquity"] = Number.isFinite(v) ? v : 0; } catch { results["shareholdersEquity"] = 0; }
  return results;
}


export function calculateDebt_to_equity_ratio_calculator(input: Debt_to_equity_ratio_calculatorInput): Debt_to_equity_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["debtToEquity"] ?? 0;
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


export interface Debt_to_equity_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
