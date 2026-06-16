// Auto-generated from cycling-calorie-calculator-schema.json
import * as z from 'zod';

export interface Cycling_calorie_calculatorInput {
  weight: number;
  distance: number;
  duration: number;
  incline: number;
}

export const Cycling_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  distance: z.number().default(10),
  duration: z.number().default(30),
  incline: z.number().default(0),
});

function evaluateAllFormulas(input: Cycling_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / (input.duration / 60); results["average_speed"] = Number.isFinite(v) ? v : 0; } catch { results["average_speed"] = 0; }
  try { const v = (results["average_speed"] ?? 0) <= 15 ? 5 : ((results["average_speed"] ?? 0) <= 20 ? 7 : ((results["average_speed"] ?? 0) <= 25 ? 10 : 12)); results["met_base"] = Number.isFinite(v) ? v : 0; } catch { results["met_base"] = 0; }
  try { const v = Math.max(1, (results["met_base"] ?? 0) + (input.incline / 100) * 2); results["met_adjusted"] = Number.isFinite(v) ? v : 0; } catch { results["met_adjusted"] = 0; }
  try { const v = (results["met_adjusted"] ?? 0) * input.weight * (input.duration / 60); results["calories_burned"] = Number.isFinite(v) ? v : 0; } catch { results["calories_burned"] = 0; }
  return results;
}


export function calculateCycling_calorie_calculator(input: Cycling_calorie_calculatorInput): Cycling_calorie_calculatorOutput {
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


export interface Cycling_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
