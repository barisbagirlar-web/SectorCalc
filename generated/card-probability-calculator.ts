// Auto-generated from card-probability-calculator-schema.json
import * as z from 'zod';

export interface Card_probability_calculatorInput {
  deckSize: number;
  successesInDeck: number;
  draws: number;
  successesWanted: number;
}

export const Card_probability_calculatorInputSchema = z.object({
  deckSize: z.number().default(52),
  successesInDeck: z.number().default(4),
  draws: z.number().default(5),
  successesWanted: z.number().default(1),
});

function evaluateAllFormulas(input: Card_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { function combination(n, k) { if (k < 0 || k > n) return 0; if (k === 0 || k === n) return 1; if (k > n - k) k = n - k; let result = 1; for (let i = 1; i <= k; i++) { result *= (n - k + i) / i; } return result; } })(); results["combination"] = Number.isFinite(v) ? v : 0; } catch { results["combination"] = 0; }
  try { const v = (results["combination"] ?? 0)(input.successesInDeck, input.successesWanted) * (results["combination"] ?? 0)(input.deckSize - input.successesInDeck, input.draws - input.successesWanted); results["numerator"] = Number.isFinite(v) ? v : 0; } catch { results["numerator"] = 0; }
  try { const v = (results["combination"] ?? 0)(input.deckSize, input.draws); results["denominator"] = Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = (results["numerator"] ?? 0) / (results["denominator"] ?? 0); results["probability"] = Number.isFinite(v) ? v : 0; } catch { results["probability"] = 0; }
  try { const v = (results["probability"] ?? 0) * 100; results["probabilityPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityPercentage"] = 0; }
  return results;
}


export function calculateCard_probability_calculator(input: Card_probability_calculatorInput): Card_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probability"] ?? 0;
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


export interface Card_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
