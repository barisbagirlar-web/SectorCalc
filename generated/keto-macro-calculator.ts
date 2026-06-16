// Auto-generated from keto-macro-calculator-schema.json
import * as z from 'zod';

export interface Keto_macro_calculatorInput {
  weight_kg: number;
  height_cm: number;
  age_years: number;
  is_male: number;
  activity_factor: number;
  bodyfat_percent: number;
}

export const Keto_macro_calculatorInputSchema = z.object({
  weight_kg: z.number().default(70),
  height_cm: z.number().default(170),
  age_years: z.number().default(30),
  is_male: z.number().default(1),
  activity_factor: z.number().default(1.2),
  bodyfat_percent: z.number().default(0),
});

function evaluateAllFormulas(input: Keto_macro_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.is_male === 1) ? (10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age_years + 5) : (10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age_years - 161); results["BMR"] = Number.isFinite(v) ? v : 0; } catch { results["BMR"] = 0; }
  try { const v = input.bodyfat_percent > 0 ? input.weight_kg * (1 - input.bodyfat_percent / 100) : input.weight_kg; results["lean_mass"] = Number.isFinite(v) ? v : 0; } catch { results["lean_mass"] = 0; }
  try { const v = (results["BMR"] ?? 0) * input.activity_factor; results["daily_kcal"] = Number.isFinite(v) ? v : 0; } catch { results["daily_kcal"] = 0; }
  try { const v = 20; results["net_carbs_g"] = Number.isFinite(v) ? v : 0; } catch { results["net_carbs_g"] = 0; }
  try { const v = (results["lean_mass"] ?? 0) * 1.6; results["protein_g"] = Number.isFinite(v) ? v : 0; } catch { results["protein_g"] = 0; }
  try { const v = ((results["daily_kcal"] ?? 0) - ((results["net_carbs_g"] ?? 0) * 4 + (results["protein_g"] ?? 0) * 4)) / 9; results["fat_g"] = Number.isFinite(v) ? v : 0; } catch { results["fat_g"] = 0; }
  return results;
}


export function calculateKeto_macro_calculator(input: Keto_macro_calculatorInput): Keto_macro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["daily_kcal"] ?? 0;
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


export interface Keto_macro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
