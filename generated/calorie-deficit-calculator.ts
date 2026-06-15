// Auto-generated from calorie-deficit-calculator-schema.json
import * as z from 'zod';

export interface Calorie_deficit_calculatorInput {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  goalRate: string;
  bodyFatPercent: number;
  isPregnant: boolean;
  isLactating: boolean;
}

export const Calorie_deficit_calculatorInputSchema = z.object({
  age: z.number().min(10).max(120).default(30),
  gender: z.enum(['male', 'female']).default('male'),
  weight: z.number().min(20).max(500).default(70),
  height: z.number().min(50).max(300).default(170),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very active']).default('moderate'),
  goalRate: z.enum(['slow', 'moderate', 'aggressive']).default('moderate'),
  bodyFatPercent: z.number().min(3).max(70).default(20),
  isPregnant: z.boolean().default(false),
  isLactating: z.boolean().default(false),
});

function evaluateAllFormulas(input: Calorie_deficit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["bmr_mifflin"] = 0;
  try { results["bmr_katch"] = 370 + 21.6 * (input.weight * (1 - input.bodyFatPercent/100)); } catch { results["bmr_katch"] = 0; }
  try { results["tdee"] = bmr * activityMultiplier; } catch { results["tdee"] = 0; }
  try { results["deficit_target"] = goalRateDeficit; } catch { results["deficit_target"] = 0; }
  try { results["target_calories"] = (results["tdee"] ?? 0) - deficit; } catch { results["target_calories"] = 0; }
  try { results["weekly_weight_loss"] = (deficit * 7) / 7700; } catch { results["weekly_weight_loss"] = 0; }
  try { results["bmi"] = input.weight / ((input.height/100)**2); } catch { results["bmi"] = 0; }
  return results;
}


export function calculateCalorie_deficit_calculator(input: Calorie_deficit_calculatorInput): Calorie_deficit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["targetCalories"] ?? 0;
  const breakdown = {
    bmr: values["bmr"] ?? 0,
    tdee: values["tdee"] ?? 0,
    deficit: values["deficit"] ?? 0,
    weeklyWeightLoss: values["weeklyWeightLoss"] ?? 0,
    bmi: values["bmi"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Metabolic Adaptation","NEAT reduction","Water Weight Fluctuation","Glycogen Depletion"];
  const suggestedActions: string[] = ["Increase Protein Intake","Incorporate Resistance Training","Track Weight Trend Over 2-4 Weeks","Reassess After 4-6 Weeks","Prioritize Micronutrient Density"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Calorie_deficit_calculatorOutput {
  totalWasteCost: number;
  breakdown: { bmr: number; tdee: number; deficit: number; weeklyWeightLoss: number; bmi: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
