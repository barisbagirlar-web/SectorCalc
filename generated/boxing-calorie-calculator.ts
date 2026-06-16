// Auto-generated from boxing-calorie-calculator-schema.json
import * as z from 'zod';

export interface Boxing_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  intensity: number;
}

export const Boxing_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  met: z.number().default(7.8),
  intensity: z.number().default(100),
});

function evaluateAllFormulas(input: Boxing_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.duration / 60; results["duration_hours"] = Number.isFinite(v) ? v : 0; } catch { results["duration_hours"] = 0; }
  try { const v = input.met * input.weight * (results["duration_hours"] ?? 0) * (input.intensity / 100); results["calories_burned"] = Number.isFinite(v) ? v : 0; } catch { results["calories_burned"] = 0; }
  try { const v = (results["calories_burned"] ?? 0) / input.duration; results["calories_per_minute"] = Number.isFinite(v) ? v : 0; } catch { results["calories_per_minute"] = 0; }
  return results;
}


export function calculateBoxing_calorie_calculator(input: Boxing_calorie_calculatorInput): Boxing_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calories_burned"] ?? 0;
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


export interface Boxing_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
