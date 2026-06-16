// Auto-generated from calorie-burn-by-activity-calculator-schema.json
import * as z from 'zod';

export interface Calorie_burn_by_activity_calculatorInput {
  weight_kg: number;
  duration_min: number;
  met_value: number;
  efficiency_factor: number;
}

export const Calorie_burn_by_activity_calculatorInputSchema = z.object({
  weight_kg: z.number().default(70),
  duration_min: z.number().default(30),
  met_value: z.number().default(5),
  efficiency_factor: z.number().default(1),
});

function evaluateAllFormulas(input: Calorie_burn_by_activity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight_kg * input.met_value * (input.duration_min / 60) * input.efficiency_factor; results["total_calories_burned"] = Number.isFinite(v) ? v : 0; } catch { results["total_calories_burned"] = 0; }
  try { const v = input.duration_min / 60; results["duration_hours"] = Number.isFinite(v) ? v : 0; } catch { results["duration_hours"] = 0; }
  try { const v = input.met_value * (input.duration_min / 60); results["met_hours"] = Number.isFinite(v) ? v : 0; } catch { results["met_hours"] = 0; }
  try { const v = input.met_value * input.weight_kg * input.efficiency_factor; results["calories_per_hour"] = Number.isFinite(v) ? v : 0; } catch { results["calories_per_hour"] = 0; }
  return results;
}


export function calculateCalorie_burn_by_activity_calculator(input: Calorie_burn_by_activity_calculatorInput): Calorie_burn_by_activity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_calories_burned"] ?? 0;
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


export interface Calorie_burn_by_activity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
