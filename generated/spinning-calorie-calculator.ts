// Auto-generated from spinning-calorie-calculator-schema.json
import * as z from 'zod';

export interface Spinning_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  age: number;
  restingHR: number;
  averageHR: number;
  gender: number;
}

export const Spinning_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  met: z.number().default(8.5),
  age: z.number().default(30),
  restingHR: z.number().default(70),
  averageHR: z.number().default(150),
  gender: z.number().default(1),
});

function evaluateAllFormulas(input: Spinning_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * input.met * (input.duration / 60); results["caloriesBurned"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = input.weight * input.met * (input.duration / 60); results["metBasedCalories"] = Number.isFinite(v) ? v : 0; } catch { results["metBasedCalories"] = 0; }
  try { const v = input.gender === 1 ? ((input.age * 0.2017) + (input.weight * 0.09036) + (input.averageHR * 0.6309) - 55.0969) * input.duration / 4.184 : ((input.age * 0.074) + (input.weight * 0.05741) + (input.averageHR * 0.4472) - 20.4022) * input.duration / 4.184; results["hrBasedCalories"] = Number.isFinite(v) ? v : 0; } catch { results["hrBasedCalories"] = 0; }
  return results;
}


export function calculateSpinning_calorie_calculator(input: Spinning_calorie_calculatorInput): Spinning_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["caloriesBurned"] ?? 0;
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


export interface Spinning_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
