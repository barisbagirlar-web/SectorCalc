// Auto-generated from meat-doneness-calculator-schema.json
import * as z from 'zod';

export interface Meat_doneness_calculatorInput {
  meat_weight: number;
  oven_temp: number;
  target_temp: number;
  starting_temp: number;
  thickness: number;
  shape_factor: number;
}

export const Meat_doneness_calculatorInputSchema = z.object({
  meat_weight: z.number().default(1),
  oven_temp: z.number().default(180),
  target_temp: z.number().default(70),
  starting_temp: z.number().default(20),
  thickness: z.number().default(5),
  shape_factor: z.number().default(1),
});

function evaluateAllFormulas(input: Meat_doneness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round((meat_weight ** 0.65) * (input.thickness ** 0.5) * ((target_temp - starting_temp) / (oven_temp - target_temp)) * 10 * shape_factor * 100) / 100; results["cookingTime"] = Number.isFinite(v) ? v : 0; } catch { results["cookingTime"] = 0; }
  try { const v = target_temp < 55 ? 'Rare' : target_temp < 65 ? 'Medium-Rare' : target_temp < 70 ? 'Medium' : target_temp < 75 ? 'Medium-Well' : 'Well-Done'; results["donenessLevel"] = Number.isFinite(v) ? v : 0; } catch { results["donenessLevel"] = 0; }
  try { const v = target_temp - starting_temp; results["tempDifference"] = Number.isFinite(v) ? v : 0; } catch { results["tempDifference"] = 0; }
  return results;
}


export function calculateMeat_doneness_calculator(input: Meat_doneness_calculatorInput): Meat_doneness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cookingTime"] ?? 0;
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


export interface Meat_doneness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
