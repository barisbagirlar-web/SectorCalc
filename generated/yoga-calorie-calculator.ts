// Auto-generated from yoga-calorie-calculator-schema.json
import * as z from 'zod';

export interface Yoga_calorie_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  duration: number;
  met: number;
}

export const Yoga_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  duration: z.number().default(60),
  met: z.number().default(3),
});

function evaluateAllFormulas(input: Yoga_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender === 0 ? (10 * input.weight + 6.25 * input.height - 5 * input.age + 5) : (10 * input.weight + 6.25 * input.height - 5 * input.age - 161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = input.met * input.weight * (input.duration / 60); results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (results["bmr"] ?? 0) * (input.duration / 1440); results["restingDuring"] = Number.isFinite(v) ? v : 0; } catch { results["restingDuring"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) - (results["restingDuring"] ?? 0); results["netCalories"] = Number.isFinite(v) ? v : 0; } catch { results["netCalories"] = 0; }
  return results;
}


export function calculateYoga_calorie_calculator(input: Yoga_calorie_calculatorInput): Yoga_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netCalories"] ?? 0;
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


export interface Yoga_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
