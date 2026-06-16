// Auto-generated from backpacking-calculator-schema.json
import * as z from 'zod';

export interface Backpacking_calculatorInput {
  days: number;
  distancePerDay: number;
  elevationGain: number;
  baseWeight: number;
  foodPerDay: number;
  waterPerDay: number;
  hikerWeight: number;
}

export const Backpacking_calculatorInputSchema = z.object({
  days: z.number().default(3),
  distancePerDay: z.number().default(15),
  elevationGain: z.number().default(500),
  baseWeight: z.number().default(10),
  foodPerDay: z.number().default(0.8),
  waterPerDay: z.number().default(2),
  hikerWeight: z.number().default(70),
});

function evaluateAllFormulas(input: Backpacking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseWeight + (input.foodPerDay + input.waterPerDay) * input.days; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = 0.726 * input.hikerWeight * input.distancePerDay + 0.1 * input.hikerWeight * input.elevationGain; results["dailyCalories"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCalories"] = 0; }
  try { const v = (input.foodPerDay + input.waterPerDay) * input.days; results["consumablesWeight"] = Number.isFinite(v) ? v : 0; } catch { results["consumablesWeight"] = 0; }
  return results;
}


export function calculateBackpacking_calculator(input: Backpacking_calculatorInput): Backpacking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeight"] ?? 0;
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


export interface Backpacking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
