// Auto-generated from wine-pairing-calculator-schema.json
import * as z from 'zod';

export interface Wine_pairing_calculatorInput {
  wine_acidity: number;
  wine_sweetness: number;
  wine_body: number;
  food_acidity: number;
  food_sweetness: number;
  food_richness: number;
}

export const Wine_pairing_calculatorInputSchema = z.object({
  wine_acidity: z.number().default(5),
  wine_sweetness: z.number().default(5),
  wine_body: z.number().default(5),
  food_acidity: z.number().default(5),
  food_sweetness: z.number().default(5),
  food_richness: z.number().default(5),
});

function evaluateAllFormulas(input: Wine_pairing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, Math.min(100, 100 - (Math.abs(input.wine_acidity - input.food_acidity) * 8 + Math.abs(input.wine_sweetness - input.food_sweetness) * 8 + Math.abs(input.wine_body - input.food_richness) * 6))); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateWine_pairing_calculator(input: Wine_pairing_calculatorInput): Wine_pairing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Pairing"] ?? 0;
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


export interface Wine_pairing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
