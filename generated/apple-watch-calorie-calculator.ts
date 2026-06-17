// Auto-generated from apple-watch-calorie-calculator-schema.json
import * as z from 'zod';

export interface Apple_watch_calorie_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  met: number;
  durationMinutes: number;
}

export const Apple_watch_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  met: z.number().default(8),
  durationMinutes: z.number().default(30),
});

function evaluateAllFormulas(input: Apple_watch_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.met * input.weight * 3.5 / 200) * input.durationMinutes; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.met; results["met"] = Number.isFinite(v) ? v : 0; } catch { results["met"] = 0; }
  try { const v = input.weight; results["weight"] = Number.isFinite(v) ? v : 0; } catch { results["weight"] = 0; }
  try { const v = input.durationMinutes; results["durationMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["durationMinutes"] = 0; }
  return results;
}


export function calculateApple_watch_calorie_calculator(input: Apple_watch_calorie_calculatorInput): Apple_watch_calorie_calculatorOutput {
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


export interface Apple_watch_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
