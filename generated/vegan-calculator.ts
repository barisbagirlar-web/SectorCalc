// Auto-generated from vegan-calculator-schema.json
import * as z from 'zod';

export interface Vegan_calculatorInput {
  mealsPerDay: number;
  daysPerYear: number;
  waterSavedPerMeal: number;
  co2SavedPerMeal: number;
  landSavedPerMeal: number;
}

export const Vegan_calculatorInputSchema = z.object({
  mealsPerDay: z.number().default(1),
  daysPerYear: z.number().default(365),
  waterSavedPerMeal: z.number().default(1500),
  co2SavedPerMeal: z.number().default(2.5),
  landSavedPerMeal: z.number().default(5),
});

function evaluateAllFormulas(input: Vegan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mealsPerDay * input.daysPerYear * input.waterSavedPerMeal; results["totalWater"] = Number.isFinite(v) ? v : 0; } catch { results["totalWater"] = 0; }
  try { const v = input.mealsPerDay * input.daysPerYear * input.co2SavedPerMeal; results["totalCO2"] = Number.isFinite(v) ? v : 0; } catch { results["totalCO2"] = 0; }
  try { const v = input.mealsPerDay * input.daysPerYear * input.landSavedPerMeal; results["totalLand"] = Number.isFinite(v) ? v : 0; } catch { results["totalLand"] = 0; }
  try { const v = (results["totalCO2"] ?? 0) / 20; results["treesEquivalent"] = Number.isFinite(v) ? v : 0; } catch { results["treesEquivalent"] = 0; }
  try { const v = (results["totalCO2"] ?? 0) / 0.4; results["carMilesSaved"] = Number.isFinite(v) ? v : 0; } catch { results["carMilesSaved"] = 0; }
  return results;
}


export function calculateVegan_calculator(input: Vegan_calculatorInput): Vegan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWater"] ?? 0;
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


export interface Vegan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
