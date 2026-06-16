// Auto-generated from dash-diet-calculator-schema.json
import * as z from 'zod';

export interface Dash_diet_calculatorInput {
  age: number;
  gender: number;
  height_cm: number;
  weight_kg: number;
  activity_level: number;
}

export const Dash_diet_calculatorInputSchema = z.object({
  age: z.number().default(30),
  gender: z.number().default(1),
  height_cm: z.number().default(170),
  weight_kg: z.number().default(70),
  activity_level: z.number().default(3),
});

function evaluateAllFormulas(input: Dash_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender === 1 ? 10*input.weight_kg + 6.25*input.height_cm - 5*input.age + 5 : 10*input.weight_kg + 6.25*input.height_cm - 5*input.age - 161; results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * (input.activity_level === 1 ? 1.2 : input.activity_level === 2 ? 1.375 : input.activity_level === 3 ? 1.55 : input.activity_level === 4 ? 1.725 : 1.9); results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = ((results["tdee"] ?? 0) * 0.55) / 4; results["carb_g"] = Number.isFinite(v) ? v : 0; } catch { results["carb_g"] = 0; }
  try { const v = ((results["tdee"] ?? 0) * 0.18) / 4; results["protein_g"] = Number.isFinite(v) ? v : 0; } catch { results["protein_g"] = 0; }
  try { const v = ((results["tdee"] ?? 0) * 0.27) / 9; results["fat_g"] = Number.isFinite(v) ? v : 0; } catch { results["fat_g"] = 0; }
  return results;
}


export function calculateDash_diet_calculator(input: Dash_diet_calculatorInput): Dash_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tdee"] ?? 0;
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


export interface Dash_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
