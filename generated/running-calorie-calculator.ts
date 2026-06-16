// Auto-generated from running-calorie-calculator-schema.json
import * as z from 'zod';

export interface Running_calorie_calculatorInput {
  weight: number;
  distance: number;
  elevation_gain: number;
  load_kg: number;
}

export const Running_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  distance: z.number().default(10),
  elevation_gain: z.number().default(0),
  load_kg: z.number().default(0),
});

function evaluateAllFormulas(input: Running_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight + input.load_kg; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = input.elevation_gain / (input.distance * 1000); results["gradient"] = Number.isFinite(v) ? v : 0; } catch { results["gradient"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) * input.distance * 1.036; results["flat_calories"] = Number.isFinite(v) ? v : 0; } catch { results["flat_calories"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) * input.elevation_gain * 0.0008; results["elevation_calories"] = Number.isFinite(v) ? v : 0; } catch { results["elevation_calories"] = 0; }
  try { const v = (results["flat_calories"] ?? 0) + (results["elevation_calories"] ?? 0); results["total_calories"] = Number.isFinite(v) ? v : 0; } catch { results["total_calories"] = 0; }
  return results;
}


export function calculateRunning_calorie_calculator(input: Running_calorie_calculatorInput): Running_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_calories"] ?? 0;
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


export interface Running_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
