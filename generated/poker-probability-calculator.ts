// Auto-generated from poker-probability-calculator-schema.json
import * as z from 'zod';

export interface Poker_probability_calculatorInput {
  knownCards: number;
  deckSize: number;
  outs: number;
  draws: number;
}

export const Poker_probability_calculatorInputSchema = z.object({
  knownCards: z.number().default(2),
  deckSize: z.number().default(52),
  outs: z.number().default(4),
  draws: z.number().default(1),
});

function evaluateAllFormulas(input: Poker_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deckSize - input.knownCards; results["remaining"] = Number.isFinite(v) ? v : 0; } catch { results["remaining"] = 0; }
  try { const v = (((results["remaining"] ?? 0) - input.outs) / (results["remaining"] ?? 0)) ** input.draws; results["missProb"] = Number.isFinite(v) ? v : 0; } catch { results["missProb"] = 0; }
  try { const v = (1 - (results["missProb"] ?? 0)) * 100; results["winProbability"] = Number.isFinite(v) ? v : 0; } catch { results["winProbability"] = 0; }
  try { const v = (results["missProb"] ?? 0) * 100; results["lossProbability"] = Number.isFinite(v) ? v : 0; } catch { results["lossProbability"] = 0; }
  try { const v = (results["missProb"] ?? 0) / (1 - (results["missProb"] ?? 0)); results["oddsAgainst"] = Number.isFinite(v) ? v : 0; } catch { results["oddsAgainst"] = 0; }
  return results;
}


export function calculatePoker_probability_calculator(input: Poker_probability_calculatorInput): Poker_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["winProbability"] ?? 0;
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


export interface Poker_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
