// Auto-generated from south-beach-diet-calculator-schema.json
import * as z from 'zod';

export interface South_beach_diet_calculatorInput {
  age: number;
  weight: number;
  height: number;
  gender: number;
  activityFactor: number;
}

export const South_beach_diet_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
  gender: z.number().default(0),
  activityFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: South_beach_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender * 166 - 161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityFactor; results["dailyCalories"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCalories"] = 0; }
  try { const v = (results["dailyCalories"] ?? 0) * 0.4; results["carbsCals"] = Number.isFinite(v) ? v : 0; } catch { results["carbsCals"] = 0; }
  try { const v = (results["dailyCalories"] ?? 0) * 0.3; results["proteinCals"] = Number.isFinite(v) ? v : 0; } catch { results["proteinCals"] = 0; }
  try { const v = (results["dailyCalories"] ?? 0) * 0.3; results["fatCals"] = Number.isFinite(v) ? v : 0; } catch { results["fatCals"] = 0; }
  return results;
}


export function calculateSouth_beach_diet_calculator(input: South_beach_diet_calculatorInput): South_beach_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyCalories"] ?? 0;
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


export interface South_beach_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
