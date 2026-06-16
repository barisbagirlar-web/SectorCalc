// Auto-generated from deck-railing-calculator-schema.json
import * as z from 'zod';

export interface Deck_railing_calculatorInput {
  totalLength: number;
  postWidth: number;
  numberOfPosts: number;
  balusterWidth: number;
  maxGap: number;
}

export const Deck_railing_calculatorInputSchema = z.object({
  totalLength: z.number().default(5),
  postWidth: z.number().default(0.1),
  numberOfPosts: z.number().default(2),
  balusterWidth: z.number().default(0.02),
  maxGap: z.number().default(0.1),
});

function evaluateAllFormulas(input: Deck_railing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalLength - input.numberOfPosts * input.postWidth; results["availableLength"] = Number.isFinite(v) ? v : 0; } catch { results["availableLength"] = 0; }
  try { const v = Math.max(0, Math.ceil(((results["availableLength"] ?? 0) - input.maxGap) / (input.maxGap + input.balusterWidth))); results["numberOfBalusters"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfBalusters"] = 0; }
  try { const v = ((results["availableLength"] ?? 0) - (results["numberOfBalusters"] ?? 0) * input.balusterWidth) / ((results["numberOfBalusters"] ?? 0) + 1); results["actualSpacing"] = Number.isFinite(v) ? v : 0; } catch { results["actualSpacing"] = 0; }
  return results;
}


export function calculateDeck_railing_calculator(input: Deck_railing_calculatorInput): Deck_railing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["numberOfBalusters"] ?? 0;
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


export interface Deck_railing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
