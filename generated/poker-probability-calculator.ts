// Auto-generated from poker-probability-calculator-schema.json
import * as z from 'zod';

export interface Poker_probability_calculatorInput {
  knownCards: number;
  deckSize: number;
  outs: number;
  draws: number;
  dataConfidence?: number;
}

export const Poker_probability_calculatorInputSchema = z.object({
  knownCards: z.number().default(2),
  deckSize: z.number().default(52),
  outs: z.number().default(4),
  draws: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Poker_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deckSize - input.knownCards; results["remaining"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["remaining"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["remaining"])) - input.outs) / (toNumericFormulaValue(results["remaining"]))) ** input.draws; results["missProb"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["missProb"] = Number.NaN; }
  try { const v = (1 - (toNumericFormulaValue(results["missProb"]))) * 100; results["winProbability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["winProbability"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["missProb"])) * 100; results["lossProbability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossProbability"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["missProb"])) / (1 - (toNumericFormulaValue(results["missProb"]))); results["oddsAgainst"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oddsAgainst"] = Number.NaN; }
  return results;
}


export function calculatePoker_probability_calculator(input: Poker_probability_calculatorInput): Poker_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["winProbability"]);
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


export interface Poker_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
