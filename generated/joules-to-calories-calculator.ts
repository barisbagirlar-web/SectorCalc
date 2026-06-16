// Auto-generated from joules-to-calories-calculator-schema.json
import * as z from 'zod';

export interface Joules_to_calories_calculatorInput {
  joules: number;
  calorie_type: number;
  precision: number;
  round_method: number;
}

export const Joules_to_calories_calculatorInputSchema = z.object({
  joules: z.number().default(1000),
  calorie_type: z.number().default(1),
  precision: z.number().default(2),
  round_method: z.number().default(0),
});

function evaluateAllFormulas(input: Joules_to_calories_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.calorie_type == 1 ? 4.184 : (input.calorie_type == 2 ? 4.204 : (input.calorie_type == 3 ? 4.1855 : (input.calorie_type == 4 ? 4.1868 : 4.190))); results["conversion_factor"] = Number.isFinite(v) ? v : 0; } catch { results["conversion_factor"] = 0; }
  try { const v = input.joules / (results["conversion_factor"] ?? 0); results["calories_precise"] = Number.isFinite(v) ? v : 0; } catch { results["calories_precise"] = 0; }
  try { const v = input.round_method == 0 ? Math.round((results["calories_precise"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision) : (input.round_method == 1 ? Math.floor((results["calories_precise"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision) : Math.ceil((results["calories_precise"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision)); results["calories"] = Number.isFinite(v) ? v : 0; } catch { results["calories"] = 0; }
  return results;
}


export function calculateJoules_to_calories_calculator(input: Joules_to_calories_calculatorInput): Joules_to_calories_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calories"] ?? 0;
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


export interface Joules_to_calories_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
