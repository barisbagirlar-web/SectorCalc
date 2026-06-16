// Auto-generated from snowboarding-calorie-calculator-schema.json
import * as z from 'zod';

export interface Snowboarding_calorie_calculatorInput {
  weight: number;
  duration: number;
  intensity: number;
  altitude: number;
  correctionFactor: number;
}

export const Snowboarding_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(60),
  intensity: z.number().default(5),
  altitude: z.number().default(0),
  correctionFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Snowboarding_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 4.0 + input.intensity * 0.4; results["met"] = Number.isFinite(v) ? v : 0; } catch { results["met"] = 0; }
  try { const v = 1 + input.altitude * 0.00002; results["altFactor"] = Number.isFinite(v) ? v : 0; } catch { results["altFactor"] = 0; }
  try { const v = input.weight * (results["met"] ?? 0) * (input.duration / 60); results["baseCalories"] = Number.isFinite(v) ? v : 0; } catch { results["baseCalories"] = 0; }
  try { const v = (results["baseCalories"] ?? 0) * (results["altFactor"] ?? 0) * input.correctionFactor; results["caloriesBurned"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  return results;
}


export function calculateSnowboarding_calorie_calculator(input: Snowboarding_calorie_calculatorInput): Snowboarding_calorie_calculatorOutput {
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


export interface Snowboarding_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
