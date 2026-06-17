// Auto-generated from fitbit-calorie-calculator-schema.json
import * as z from 'zod';

export interface Fitbit_calorie_calculatorInput {
  age: number;
  gender: number;
  weight: number;
  height: number;
  activityFactor: number;
}

export const Fitbit_calorie_calculatorInputSchema = z.object({
  age: z.number().default(30),
  gender: z.number().default(0),
  weight: z.number().default(70),
  height: z.number().default(170),
  activityFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Fitbit_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.gender === 1 ? (10*input.weight + 6.25*input.height - 5*input.age + 5) : (10*input.weight + 6.25*input.height - 5*input.age - 161)); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityFactor; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = input.activityFactor; results["activityFactor"] = Number.isFinite(v) ? v : 0; } catch { results["activityFactor"] = 0; }
  return results;
}


export function calculateFitbit_calorie_calculator(input: Fitbit_calorie_calculatorInput): Fitbit_calorie_calculatorOutput {
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


export interface Fitbit_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
