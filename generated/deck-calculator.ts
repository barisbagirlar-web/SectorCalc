// Auto-generated from deck-calculator-schema.json
import * as z from 'zod';

export interface Deck_calculatorInput {
  deckLength: number;
  deckWidth: number;
  boardLength: number;
  boardWidth: number;
  boardPrice: number;
  wasteFactor: number;
}

export const Deck_calculatorInputSchema = z.object({
  deckLength: z.number().default(5),
  deckWidth: z.number().default(4),
  boardLength: z.number().default(2.4),
  boardWidth: z.number().default(0.14),
  boardPrice: z.number().default(8.5),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Deck_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deckLength * input.deckWidth; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = Math.ceil((input.deckLength * input.deckWidth) / (input.boardLength * input.boardWidth) * (1 + input.wasteFactor / 100)); results["boardsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["boardsNeeded"] = 0; }
  try { const v = (results["boardsNeeded"] ?? 0) * input.boardPrice; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateDeck_calculator(input: Deck_calculatorInput): Deck_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Deck_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
