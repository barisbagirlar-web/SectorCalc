// Auto-generated from rowing-calorie-calculator-schema.json
import * as z from 'zod';

export interface Rowing_calorie_calculatorInput {
  weight: number;
  active_duration: number;
  rest_duration: number;
  met: number;
}

export const Rowing_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  active_duration: z.number().default(30),
  rest_duration: z.number().default(5),
  met: z.number().default(7),
});

function evaluateAllFormulas(input: Rowing_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.active_duration / 60; results["active_hours"] = Number.isFinite(v) ? v : 0; } catch { results["active_hours"] = 0; }
  try { const v = input.rest_duration / 60; results["rest_hours"] = Number.isFinite(v) ? v : 0; } catch { results["rest_hours"] = 0; }
  try { const v = input.met * input.weight * (results["active_hours"] ?? 0); results["calories_active"] = Number.isFinite(v) ? v : 0; } catch { results["calories_active"] = 0; }
  try { const v = 1.0 * input.weight * (results["rest_hours"] ?? 0); results["calories_rest"] = Number.isFinite(v) ? v : 0; } catch { results["calories_rest"] = 0; }
  try { const v = (results["calories_active"] ?? 0) + (results["calories_rest"] ?? 0); results["total_calories"] = Number.isFinite(v) ? v : 0; } catch { results["total_calories"] = 0; }
  return results;
}


export function calculateRowing_calorie_calculator(input: Rowing_calorie_calculatorInput): Rowing_calorie_calculatorOutput {
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


export interface Rowing_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
