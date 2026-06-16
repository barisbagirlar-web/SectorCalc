// Auto-generated from macro-nutrient-calculator-schema.json
import * as z from 'zod';

export interface Macro_nutrient_calculatorInput {
  weight: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
}

export const Macro_nutrient_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  proteinPer100: z.number().default(20),
  carbsPer100: z.number().default(10),
  fatPer100: z.number().default(5),
});

function evaluateAllFormulas(input: Macro_nutrient_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.proteinPer100 / 100) * input.weight; results["proteinGrams"] = Number.isFinite(v) ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = (input.carbsPer100 / 100) * input.weight; results["carbsGrams"] = Number.isFinite(v) ? v : 0; } catch { results["carbsGrams"] = 0; }
  try { const v = (input.fatPer100 / 100) * input.weight; results["fatGrams"] = Number.isFinite(v) ? v : 0; } catch { results["fatGrams"] = 0; }
  try { const v = 4 * (results["proteinGrams"] ?? 0) + 4 * (results["carbsGrams"] ?? 0) + 9 * (results["fatGrams"] ?? 0); results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  return results;
}


export function calculateMacro_nutrient_calculator(input: Macro_nutrient_calculatorInput): Macro_nutrient_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCalories"] ?? 0;
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


export interface Macro_nutrient_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
