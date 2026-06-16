// Auto-generated from hiking-calorie-calculator-schema.json
import * as z from 'zod';

export interface Hiking_calorie_calculatorInput {
  bodyWeight: number;
  packWeight: number;
  distance: number;
  elevationGain: number;
  terrainFactor: number;
}

export const Hiking_calorie_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(70),
  packWeight: z.number().default(10),
  distance: z.number().default(10),
  elevationGain: z.number().default(500),
  terrainFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Hiking_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bodyWeight + input.packWeight) * (input.distance * 0.8 + input.elevationGain * 0.0094) * input.terrainFactor; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (input.bodyWeight + input.packWeight) * input.distance * 0.8 * input.terrainFactor; results["horizontalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["horizontalCalories"] = 0; }
  try { const v = (input.bodyWeight + input.packWeight) * input.elevationGain * 0.0094 * input.terrainFactor; results["verticalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["verticalCalories"] = 0; }
  return results;
}


export function calculateHiking_calorie_calculator(input: Hiking_calorie_calculatorInput): Hiking_calorie_calculatorOutput {
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


export interface Hiking_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
