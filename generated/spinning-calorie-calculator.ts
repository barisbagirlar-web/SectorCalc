// Auto-generated from spinning-calorie-calculator-schema.json
import * as z from 'zod';

export interface Spinning_calorie_calculatorInput {
  duration_min: number;
  speed_kmh: number;
  resistance_level: number;
  weight_kg: number;
  age_years: number;
}

export const Spinning_calorie_calculatorInputSchema = z.object({
  duration_min: z.number().default(30),
  speed_kmh: z.number().default(20),
  resistance_level: z.number().default(5),
  weight_kg: z.number().default(70),
  age_years: z.number().default(30),
});

function evaluateAllFormulas(input: Spinning_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 3.5 + (input.speed_kmh * 0.2) + (input.resistance_level * 0.5); results["met_value"] = Number.isFinite(v) ? v : 0; } catch { results["met_value"] = 0; }
  try { const v = (results["met_value"] ?? 0) * input.weight_kg * (input.duration_min / 60); results["total_calories"] = Number.isFinite(v) ? v : 0; } catch { results["total_calories"] = 0; }
  try { const v = (results["total_calories"] ?? 0) / input.duration_min; results["calories_per_minute"] = Number.isFinite(v) ? v : 0; } catch { results["calories_per_minute"] = 0; }
  return results;
}


export function calculateSpinning_calorie_calculator(input: Spinning_calorie_calculatorInput): Spinning_calorie_calculatorOutput {
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


export interface Spinning_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
