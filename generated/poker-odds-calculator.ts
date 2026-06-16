// Auto-generated from poker-odds-calculator-schema.json
import * as z from 'zod';

export interface Poker_odds_calculatorInput {
  numberOfOuts: number;
  currentPot: number;
  betToCall: number;
  knownCards: number;
  totalCards: number;
}

export const Poker_odds_calculatorInputSchema = z.object({
  numberOfOuts: z.number().default(9),
  currentPot: z.number().default(100),
  betToCall: z.number().default(20),
  knownCards: z.number().default(5),
  totalCards: z.number().default(52),
});

function evaluateAllFormulas(input: Poker_odds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCards - input.knownCards; results["unseenCards"] = Number.isFinite(v) ? v : 0; } catch { results["unseenCards"] = 0; }
  try { const v = input.numberOfOuts / (results["unseenCards"] ?? 0); results["probabilityWin"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityWin"] = 0; }
  try { const v = input.betToCall / (input.currentPot + input.betToCall); results["potOdds"] = Number.isFinite(v) ? v : 0; } catch { results["potOdds"] = 0; }
  try { const v = (results["probabilityWin"] ?? 0) * (input.currentPot + input.betToCall) - (1 - (results["probabilityWin"] ?? 0)) * input.betToCall; results["expectedValue"] = Number.isFinite(v) ? v : 0; } catch { results["expectedValue"] = 0; }
  try { const v = (results["expectedValue"] ?? 0) > 0 ? 'Call' : 'Fold'; results["recommendation"] = Number.isFinite(v) ? v : 0; } catch { results["recommendation"] = 0; }
  try { const v = `${(results["recommendation"] ?? 0)} (EV: ${(results["expectedValue"] ?? 0).toFixed(1)} chips, Win Prob: ${((results["probabilityWin"] ?? 0) * 100).toFixed(1)}%)`; results["primaryText"] = Number.isFinite(v) ? v : 0; } catch { results["primaryText"] = 0; }
  return results;
}


export function calculatePoker_odds_calculator(input: Poker_odds_calculatorInput): Poker_odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Poker_odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
