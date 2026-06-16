// Auto-generated from meal-plan-calculator-schema.json
import * as z from 'zod';

export interface Meal_plan_calculatorInput {
  age: number;
  weight: number;
  height: number;
  gender: number;
  activityFactor: number;
  costPerCalorie: number;
}

export const Meal_plan_calculatorInputSchema = z.object({
  age: z.number().default(35),
  weight: z.number().default(70),
  height: z.number().default(170),
  gender: z.number().default(1),
  activityFactor: z.number().default(1.55),
  costPerCalorie: z.number().default(0.005),
});

function evaluateAllFormulas(input: Meal_plan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10*input.weight + 6.25*input.height - 5*input.age + (input.gender === 1 ? 5 : -161); results["BMR"] = Number.isFinite(v) ? v : 0; } catch { results["BMR"] = 0; }
  try { const v = (results["BMR"] ?? 0) * input.activityFactor; results["TDEE"] = Number.isFinite(v) ? v : 0; } catch { results["TDEE"] = 0; }
  try { const v = input.weight * 1.5; results["proteinG"] = Number.isFinite(v) ? v : 0; } catch { results["proteinG"] = 0; }
  try { const v = ((results["TDEE"] ?? 0) * 0.25) / 9; results["fatG"] = Number.isFinite(v) ? v : 0; } catch { results["fatG"] = 0; }
  try { const v = ((results["TDEE"] ?? 0) - ((results["proteinG"] ?? 0)*4 + (results["fatG"] ?? 0)*9)) / 4; results["carbsG"] = Number.isFinite(v) ? v : 0; } catch { results["carbsG"] = 0; }
  try { const v = (results["TDEE"] ?? 0) * input.costPerCalorie; results["dailyCost"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (results["dailyCost"] ?? 0) * 7; results["weeklyCost"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyCost"] = 0; }
  return results;
}


export function calculateMeal_plan_calculator(input: Meal_plan_calculatorInput): Meal_plan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyCost"] ?? 0;
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


export interface Meal_plan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
