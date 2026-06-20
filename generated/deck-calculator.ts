// Auto-generated from deck-calculator-schema.json
import * as z from 'zod';

export interface Deck_calculatorInput {
  deckLength: number;
  deckWidth: number;
  boardLength: number;
  boardWidth: number;
  boardPrice: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Deck_calculatorInputSchema = z.object({
  deckLength: z.number().default(5),
  deckWidth: z.number().default(4),
  boardLength: z.number().default(2.4),
  boardWidth: z.number().default(0.14),
  boardPrice: z.number().default(8.5),
  wasteFactor: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Deck_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.deckLength) * (input.deckWidth) * (input.boardLength) * (input.boardWidth) * (input.boardPrice) * (input.wasteFactor); results["area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area"] = Number.NaN; }
  try { const v = (input.deckLength) * (input.deckWidth) * (input.boardLength); results["area_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area_aux"] = Number.NaN; }
  return results;
}


export function calculateDeck_calculator(input: Deck_calculatorInput): Deck_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["area_aux"]);
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


export interface Deck_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
