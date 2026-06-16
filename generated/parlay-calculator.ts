// Auto-generated from parlay-calculator-schema.json
import * as z from 'zod';

export interface Parlay_calculatorInput {
  stake: number;
  odds1: number;
  odds2: number;
  odds3: number;
  odds4: number;
  odds5: number;
}

export const Parlay_calculatorInputSchema = z.object({
  stake: z.number().default(100),
  odds1: z.number().default(1),
  odds2: z.number().default(1),
  odds3: z.number().default(1),
  odds4: z.number().default(1),
  odds5: z.number().default(1),
});

function evaluateAllFormulas(input: Parlay_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stake * input.odds1 * input.odds2 * input.odds3 * input.odds4 * input.odds5; results["totalPayout"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayout"] = 0; }
  try { const v = input.odds1 * input.odds2 * input.odds3 * input.odds4 * input.odds5; results["totalOdds"] = Number.isFinite(v) ? v : 0; } catch { results["totalOdds"] = 0; }
  try { const v = (results["totalPayout"] ?? 0) - input.stake; results["potentialProfit"] = Number.isFinite(v) ? v : 0; } catch { results["potentialProfit"] = 0; }
  return results;
}


export function calculateParlay_calculator(input: Parlay_calculatorInput): Parlay_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPayout"] ?? 0;
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


export interface Parlay_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
