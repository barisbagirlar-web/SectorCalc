// Auto-generated from troy-ounces-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Troy_ounces_to_grams_calculatorInput {
  troyOunces: number;
  conversionFactor: number;
  precision: number;
  quantity: number;
}

export const Troy_ounces_to_grams_calculatorInputSchema = z.object({
  troyOunces: z.number().default(1),
  conversionFactor: z.number().default(31.1034768),
  precision: z.number().default(2),
  quantity: z.number().default(1),
});

function evaluateAllFormulas(input: Troy_ounces_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.troyOunces * input.conversionFactor * input.quantity; results["rawGrams"] = Number.isFinite(v) ? v : 0; } catch { results["rawGrams"] = 0; }
  try { const v = Math.round((input.troyOunces * input.conversionFactor * input.quantity) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["grams"] = Number.isFinite(v) ? v : 0; } catch { results["grams"] = 0; }
  return results;
}


export function calculateTroy_ounces_to_grams_calculator(input: Troy_ounces_to_grams_calculatorInput): Troy_ounces_to_grams_calculatorOutput {
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


export interface Troy_ounces_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
