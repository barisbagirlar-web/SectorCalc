// Auto-generated from thermic-effect-of-food-calculator-schema.json
import * as z from 'zod';

export interface Thermic_effect_of_food_calculatorInput {
  protein: number;
  carbohydrates: number;
  fat: number;
  alcohol: number;
}

export const Thermic_effect_of_food_calculatorInputSchema = z.object({
  protein: z.number().default(0),
  carbohydrates: z.number().default(0),
  fat: z.number().default(0),
  alcohol: z.number().default(0),
});

function evaluateAllFormulas(input: Thermic_effect_of_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.protein * 4; results["proteinEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["proteinEnergy"] = 0; }
  try { const v = input.carbohydrates * 4; results["carbsEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["carbsEnergy"] = 0; }
  try { const v = input.fat * 9; results["fatEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["fatEnergy"] = 0; }
  try { const v = input.alcohol * 7; results["alcoholEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["alcoholEnergy"] = 0; }
  try { const v = (results["proteinEnergy"] ?? 0) * 0.25; results["proteinTEF"] = Number.isFinite(v) ? v : 0; } catch { results["proteinTEF"] = 0; }
  try { const v = (results["carbsEnergy"] ?? 0) * 0.08; results["carbsTEF"] = Number.isFinite(v) ? v : 0; } catch { results["carbsTEF"] = 0; }
  try { const v = (results["fatEnergy"] ?? 0) * 0.03; results["fatTEF"] = Number.isFinite(v) ? v : 0; } catch { results["fatTEF"] = 0; }
  try { const v = (results["alcoholEnergy"] ?? 0) * 0.20; results["alcoholTEF"] = Number.isFinite(v) ? v : 0; } catch { results["alcoholTEF"] = 0; }
  try { const v = (results["proteinTEF"] ?? 0) + (results["carbsTEF"] ?? 0) + (results["fatTEF"] ?? 0) + (results["alcoholTEF"] ?? 0); results["totalTEF"] = Number.isFinite(v) ? v : 0; } catch { results["totalTEF"] = 0; }
  try { const v = 'Protein: ' + (results["proteinTEF"] ?? 0) + ' kcal'; results["breakdown0"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown0"] = 0; }
  try { const v = 'Carbohydrates: ' + (results["carbsTEF"] ?? 0) + ' kcal'; results["breakdown1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = 'Fat: ' + (results["fatTEF"] ?? 0) + ' kcal'; results["breakdown2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown2"] = 0; }
  try { const v = 'Alcohol: ' + (results["alcoholTEF"] ?? 0) + ' kcal'; results["breakdown3"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown3"] = 0; }
  return results;
}


export function calculateThermic_effect_of_food_calculator(input: Thermic_effect_of_food_calculatorInput): Thermic_effect_of_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTEF"] ?? 0;
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


export interface Thermic_effect_of_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
