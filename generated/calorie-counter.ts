// Auto-generated from calorie-counter-schema.json
import * as z from 'zod';

export interface Calorie_counterInput {
  weight_kg: number;
  height_cm: number;
  age_years: number;
  activity_factor: number;
  gender: number;
  calorie_adjustment: number;
}

export const Calorie_counterInputSchema = z.object({
  weight_kg: z.number().default(70),
  height_cm: z.number().default(170),
  age_years: z.number().default(30),
  activity_factor: z.number().default(1.2),
  gender: z.number().default(0),
  calorie_adjustment: z.number().default(0),
});

function evaluateAllFormulas(input: Calorie_counterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender === 1 ? (10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age_years + 5) : (10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age_years - 161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activity_factor; results["maintenance_calories"] = Number.isFinite(v) ? v : 0; } catch { results["maintenance_calories"] = 0; }
  try { const v = (results["maintenance_calories"] ?? 0) + input.calorie_adjustment; results["adjusted_calories"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_calories"] = 0; }
  return results;
}


export function calculateCalorie_counter(input: Calorie_counterInput): Calorie_counterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjusted_calories"] ?? 0;
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


export interface Calorie_counterOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
