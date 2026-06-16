// Auto-generated from apple-watch-calorie-calculator-schema.json
import * as z from 'zod';

export interface Apple_watch_calorie_calculatorInput {
  weight: number;
  duration: number;
  age: number;
  heartRate: number;
  gender: number;
}

export const Apple_watch_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  age: z.number().default(30),
  heartRate: z.number().default(120),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Apple_watch_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.gender === 0 ? ((input.age * 0.2017) + (input.weight * 0.1992) + (input.heartRate * 0.6309) - 55.0969) : ((input.age * 0.074) + (input.weight * 0.1266) + (input.heartRate * 0.4472) - 20.4022)) * input.duration / 4.184); results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) / input.duration; results["calorieBurnRate"] = Number.isFinite(v) ? v : 0; } catch { results["calorieBurnRate"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) * 4.184; results["energyKj"] = Number.isFinite(v) ? v : 0; } catch { results["energyKj"] = 0; }
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
