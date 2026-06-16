// Auto-generated from cash-ratio-calculator-schema.json
import * as z from 'zod';

export interface Cash_ratio_calculatorInput {
  cash: number;
  bankDeposits: number;
  shortTermInvestments: number;
  currentLiabilities: number;
}

export const Cash_ratio_calculatorInputSchema = z.object({
  cash: z.number().default(0),
  bankDeposits: z.number().default(0),
  shortTermInvestments: z.number().default(0),
  currentLiabilities: z.number().default(0),
});

function evaluateAllFormulas(input: Cash_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cash + input.bankDeposits + input.shortTermInvestments; results["totalCash"] = Number.isFinite(v) ? v : 0; } catch { results["totalCash"] = 0; }
  try { const v = (results["totalCash"] ?? 0) / input.currentLiabilities; results["cashRatio"] = Number.isFinite(v) ? v : 0; } catch { results["cashRatio"] = 0; }
  try { const v = input.currentLiabilities; results["currentLiabilities"] = Number.isFinite(v) ? v : 0; } catch { results["currentLiabilities"] = 0; }
  return results;
}


export function calculateCash_ratio_calculator(input: Cash_ratio_calculatorInput): Cash_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cashRatio"] ?? 0;
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


export interface Cash_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
