// Auto-generated from chess-rating-calculator-schema.json
import * as z from 'zod';

export interface Chess_rating_calculatorInput {
  currentRating: number;
  opponentRating: number;
  result: number;
  kFactor: number;
}

export const Chess_rating_calculatorInputSchema = z.object({
  currentRating: z.number().default(1200),
  opponentRating: z.number().default(1200),
  result: z.number().default(0.5),
  kFactor: z.number().default(32),
});

function evaluateAllFormulas(input: Chess_rating_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / (1 + 10 ** ((input.opponentRating - input.currentRating) / 400)); results["expectedScore"] = Number.isFinite(v) ? v : 0; } catch { results["expectedScore"] = 0; }
  try { const v = input.kFactor * (input.result - (results["expectedScore"] ?? 0)); results["ratingChange"] = Number.isFinite(v) ? v : 0; } catch { results["ratingChange"] = 0; }
  try { const v = input.currentRating + (results["ratingChange"] ?? 0); results["newRating"] = Number.isFinite(v) ? v : 0; } catch { results["newRating"] = 0; }
  return results;
}


export function calculateChess_rating_calculator(input: Chess_rating_calculatorInput): Chess_rating_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["newRating"] ?? 0;
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


export interface Chess_rating_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
