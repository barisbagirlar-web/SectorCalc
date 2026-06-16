// Auto-generated from deck-stain-calculator-schema.json
import * as z from 'zod';

export interface Deck_stain_calculatorInput {
  length: number;
  width: number;
  coverage: number;
  coats: number;
  waste: number;
}

export const Deck_stain_calculatorInputSchema = z.object({
  length: z.number().default(20),
  width: z.number().default(12),
  coverage: z.number().default(250),
  coats: z.number().default(2),
  waste: z.number().default(10),
});

function evaluateAllFormulas(input: Deck_stain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["deckArea"] = Number.isFinite(v) ? v : 0; } catch { results["deckArea"] = 0; }
  try { const v = (results["deckArea"] ?? 0) * input.coats; results["totalAreaToCover"] = Number.isFinite(v) ? v : 0; } catch { results["totalAreaToCover"] = 0; }
  try { const v = (results["totalAreaToCover"] ?? 0) * (1 + input.waste / 100); results["adjustedArea"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedArea"] = 0; }
  try { const v = (results["adjustedArea"] ?? 0) / input.coverage; results["totalGallons"] = Number.isFinite(v) ? v : 0; } catch { results["totalGallons"] = 0; }
  return results;
}


export function calculateDeck_stain_calculator(input: Deck_stain_calculatorInput): Deck_stain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalGallons"] ?? 0;
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


export interface Deck_stain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
