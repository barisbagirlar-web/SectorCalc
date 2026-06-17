// Auto-generated from ounce-to-gram-calculator-schema.json
import * as z from 'zod';

export interface Ounce_to_gram_calculatorInput {
  ounces: number;
  conversionFactor: number;
  itemCount: number;
  decimalPlaces: number;
}

export const Ounce_to_gram_calculatorInputSchema = z.object({
  ounces: z.number().default(1),
  conversionFactor: z.number().default(28.349523125),
  itemCount: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function evaluateAllFormulas(input: Ounce_to_gram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(input.ounces * input.conversionFactor * input.itemCount * 10**input.decimalPlaces) / 10**input.decimalPlaces; results["grams"] = Number.isFinite(v) ? v : 0; } catch { results["grams"] = 0; }
  try { const v = input.ounces * input.itemCount; results["totalOunces"] = Number.isFinite(v) ? v : 0; } catch { results["totalOunces"] = 0; }
  try { const v = input.ounces * input.conversionFactor * input.itemCount; results["unroundedGrams"] = Number.isFinite(v) ? v : 0; } catch { results["unroundedGrams"] = 0; }
  return results;
}


export function calculateOunce_to_gram_calculator(input: Ounce_to_gram_calculatorInput): Ounce_to_gram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grams"] ?? 0;
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


export interface Ounce_to_gram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
