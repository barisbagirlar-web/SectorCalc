// Auto-generated from quick-ratio-calculator-schema.json
import * as z from 'zod';

export interface Quick_ratio_calculatorInput {
  cashEquivalents: number;
  marketableSecurities: number;
  accountsReceivable: number;
  currentLiabilities: number;
}

export const Quick_ratio_calculatorInputSchema = z.object({
  cashEquivalents: z.number().default(0),
  marketableSecurities: z.number().default(0),
  accountsReceivable: z.number().default(0),
  currentLiabilities: z.number().default(0),
});

function evaluateAllFormulas(input: Quick_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.cashEquivalents + input.marketableSecurities + input.accountsReceivable) / input.currentLiabilities) || 0; results["quickRatio"] = Number.isFinite(v) ? v : 0; } catch { results["quickRatio"] = 0; }
  return results;
}


export function calculateQuick_ratio_calculator(input: Quick_ratio_calculatorInput): Quick_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["quickRatio"] ?? 0;
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


export interface Quick_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
