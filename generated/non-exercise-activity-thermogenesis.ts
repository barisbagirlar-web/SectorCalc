// Auto-generated from non-exercise-activity-thermogenesis-schema.json
import * as z from 'zod';

export interface Non_exercise_activity_thermogenesisInput {
  weight: number;
  met: number;
  duration: number;
}

export const Non_exercise_activity_thermogenesisInputSchema = z.object({
  weight: z.number().default(70),
  met: z.number().default(1.5),
  duration: z.number().default(1),
});

function evaluateAllFormulas(input: Non_exercise_activity_thermogenesisInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * input.weight * input.duration; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.met * input.weight / 60; results["caloriesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = input.met * input.duration * 60; results["metMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["metMinutes"] = 0; }
  return results;
}


export function calculateNon_exercise_activity_thermogenesis(input: Non_exercise_activity_thermogenesisInput): Non_exercise_activity_thermogenesisOutput {
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


export interface Non_exercise_activity_thermogenesisOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
