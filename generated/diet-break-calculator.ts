// Auto-generated from diet-break-calculator-schema.json
import * as z from 'zod';

export interface Diet_break_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  dietDurationWeeks: number;
}

export const Diet_break_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.55),
  dietDurationWeeks: z.number().default(12),
});

function evaluateAllFormulas(input: Diet_break_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161 + 166 * input.gender; results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityLevel; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (results["tdee"] ?? 0); results["maintenanceCalories"] = Number.isFinite(v) ? v : 0; } catch { results["maintenanceCalories"] = 0; }
  try { const v = input.dietDurationWeeks / 4; results["dietBreakWeeks"] = Number.isFinite(v) ? v : 0; } catch { results["dietBreakWeeks"] = 0; }
  return results;
}


export function calculateDiet_break_calculator(input: Diet_break_calculatorInput): Diet_break_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maintenanceCalories"] ?? 0;
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


export interface Diet_break_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
