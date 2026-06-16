// Auto-generated from garmin-calorie-calculator-schema.json
import * as z from 'zod';

export interface Garmin_calorie_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  duration: number;
  met: number;
}

export const Garmin_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  duration: z.number().default(30),
  met: z.number().default(8),
});

function evaluateAllFormulas(input: Garmin_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender == 0 ? 447.593 + 9.247 * input.weight + 3.098 * input.height - 4.330 * input.age : 88.362 + 13.397 * input.weight + 4.799 * input.height - 5.677 * input.age; results["bmrPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["bmrPerDay"] = 0; }
  try { const v = input.met * input.weight * (input.duration / 60); results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = ((results["bmrPerDay"] ?? 0) / 1440) * input.duration; results["restingCalories"] = Number.isFinite(v) ? v : 0; } catch { results["restingCalories"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) - (results["restingCalories"] ?? 0); results["activeCalories"] = Number.isFinite(v) ? v : 0; } catch { results["activeCalories"] = 0; }
  return results;
}


export function calculateGarmin_calorie_calculator(input: Garmin_calorie_calculatorInput): Garmin_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCalories"] ?? 0;
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


export interface Garmin_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
