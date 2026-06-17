// Auto-generated from hiit-calorie-calculator-schema.json
import * as z from 'zod';

export interface Hiit_calorie_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  duration: number;
  met: number;
}

export const Hiit_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  duration: z.number().default(30),
  met: z.number().default(8),
});

function evaluateAllFormulas(input: Hiit_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 88.362 + (13.397 * input.weight) + (4.799 * input.height) - (5.677 * input.age); results["bmr_male"] = Number.isFinite(v) ? v : 0; } catch { results["bmr_male"] = 0; }
  try { const v = 447.593 + (9.247 * input.weight) + (3.098 * input.height) - (4.330 * input.age); results["bmr_female"] = Number.isFinite(v) ? v : 0; } catch { results["bmr_female"] = 0; }
  try { const v = input.gender === 1 ? (results["bmr_male"] ?? 0) : (results["bmr_female"] ?? 0); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) / 24; results["hourlyBmr"] = Number.isFinite(v) ? v : 0; } catch { results["hourlyBmr"] = 0; }
  try { const v = (results["hourlyBmr"] ?? 0) * input.met * (input.duration / 60); results["calories"] = Number.isFinite(v) ? v : 0; } catch { results["calories"] = 0; }
  try { const v = (results["calories"] ?? 0) / input.duration; results["caloriesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  return results;
}


export function calculateHiit_calorie_calculator(input: Hiit_calorie_calculatorInput): Hiit_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calories"] ?? 0;
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


export interface Hiit_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
