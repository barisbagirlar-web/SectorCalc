// Auto-generated from thermic-effect-of-food-schema.json
import * as z from 'zod';

export interface Thermic_effect_of_foodInput {
  protein: number;
  carbs: number;
  fat: number;
  proteinTEF: number;
  carbsTEF: number;
  fatTEF: number;
}

export const Thermic_effect_of_foodInputSchema = z.object({
  protein: z.number().default(150),
  carbs: z.number().default(250),
  fat: z.number().default(70),
  proteinTEF: z.number().default(25),
  carbsTEF: z.number().default(8),
  fatTEF: z.number().default(3),
});

function evaluateAllFormulas(input: Thermic_effect_of_foodInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.protein * 4 + input.carbs * 4 + input.fat * 9; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.protein * 4 * (input.proteinTEF / 100); results["tefProtein"] = Number.isFinite(v) ? v : 0; } catch { results["tefProtein"] = 0; }
  try { const v = input.carbs * 4 * (input.carbsTEF / 100); results["tefCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["tefCarbs"] = 0; }
  try { const v = input.fat * 9 * (input.fatTEF / 100); results["tefFat"] = Number.isFinite(v) ? v : 0; } catch { results["tefFat"] = 0; }
  try { const v = (results["tefProtein"] ?? 0) + (results["tefCarbs"] ?? 0) + (results["tefFat"] ?? 0); results["tefTotal"] = Number.isFinite(v) ? v : 0; } catch { results["tefTotal"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) !== 0 ? ((results["tefTotal"] ?? 0) / (results["totalCalories"] ?? 0)) * 100 : 0; results["tefPercent"] = Number.isFinite(v) ? v : 0; } catch { results["tefPercent"] = 0; }
  try { const v = `Thermic Effect: ${(results["tefTotal"] ?? 0).toFixed(0)} kcal (${(results["tefPercent"] ?? 0).toFixed(1)}% of total calories)`; results["tefSummary"] = Number.isFinite(v) ? v : 0; } catch { results["tefSummary"] = 0; }
  return results;
}


export function calculateThermic_effect_of_food(input: Thermic_effect_of_foodInput): Thermic_effect_of_foodOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tefSummary"] ?? 0;
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


export interface Thermic_effect_of_foodOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
