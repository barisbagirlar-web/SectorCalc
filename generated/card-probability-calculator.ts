// Auto-generated from card-probability-calculator-schema.json
import * as z from 'zod';

export interface Card_probability_calculatorInput {
  deckSize: number;
  successesInDeck: number;
  draws: number;
  successesWanted: number;
  dataConfidence?: number;
}

export const Card_probability_calculatorInputSchema = z.object({
  deckSize: z.number().default(52),
  successesInDeck: z.number().default(4),
  draws: z.number().default(5),
  successesWanted: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Card_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deckSize * input.successesInDeck * input.draws * input.successesWanted; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.deckSize * input.successesInDeck * input.draws * input.successesWanted; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCard_probability_calculator(input: Card_probability_calculatorInput): Card_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
