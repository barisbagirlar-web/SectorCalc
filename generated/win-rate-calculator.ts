// Auto-generated from win-rate-calculator-schema.json
import * as z from 'zod';

export interface Win_rate_calculatorInput {
  totalOpportunities: number;
  wonOpportunities: number;
  pendingOpportunities: number;
  targetWinRate: number;
}

export const Win_rate_calculatorInputSchema = z.object({
  totalOpportunities: z.number().default(100),
  wonOpportunities: z.number().default(25),
  pendingOpportunities: z.number().default(20),
  targetWinRate: z.number().default(25),
});

function evaluateAllFormulas(input: Win_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wonOpportunities / (input.totalOpportunities - input.pendingOpportunities)) * 100; results["winRate"] = Number.isFinite(v) ? v : 0; } catch { results["winRate"] = 0; }
  try { const v = input.wonOpportunities; results["winCount"] = Number.isFinite(v) ? v : 0; } catch { results["winCount"] = 0; }
  try { const v = input.totalOpportunities - input.pendingOpportunities - input.wonOpportunities; results["lossCount"] = Number.isFinite(v) ? v : 0; } catch { results["lossCount"] = 0; }
  try { const v = (results["winRate"] ?? 0) - input.targetWinRate; results["gap"] = Number.isFinite(v) ? v : 0; } catch { results["gap"] = 0; }
  return results;
}


export function calculateWin_rate_calculator(input: Win_rate_calculatorInput): Win_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["winRate"] ?? 0;
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


export interface Win_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
