// Auto-generated from poker-odds-calculator-schema.json
import * as z from 'zod';

export interface Poker_odds_calculatorInput {
  numberOfOuts: number;
  currentPot: number;
  betToCall: number;
  knownCards: number;
  totalCards: number;
  dataConfidence?: number;
}

export const Poker_odds_calculatorInputSchema = z.object({
  numberOfOuts: z.number().default(9),
  currentPot: z.number().default(100),
  betToCall: z.number().default(20),
  knownCards: z.number().default(5),
  totalCards: z.number().default(52),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Poker_odds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCards - input.knownCards; results["unseenCards"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["unseenCards"] = Number.NaN; }
  try { const v = input.numberOfOuts / (toNumericFormulaValue(results["unseenCards"])); results["probabilityWin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["probabilityWin"] = Number.NaN; }
  try { const v = input.betToCall / (input.currentPot + input.betToCall); results["potOdds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["potOdds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["probabilityWin"])) * (input.currentPot + input.betToCall) - (1 - (toNumericFormulaValue(results["probabilityWin"]))) * input.betToCall; results["expectedValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedValue"] = Number.NaN; }
  return results;
}


export function calculatePoker_odds_calculator(input: Poker_odds_calculatorInput): Poker_odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["unseenCards"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
