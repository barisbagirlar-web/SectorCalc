// Auto-generated from backpacking-weight-calculator-schema.json
import * as z from 'zod';

export interface Backpacking_weight_calculatorInput {
  baseWeight: number;
  foodWeightPerDay: number;
  waterWeightPerDay: number;
  fuelWeight: number;
  clothingWeight: number;
  tripDays: number;
}

export const Backpacking_weight_calculatorInputSchema = z.object({
  baseWeight: z.number().default(5),
  foodWeightPerDay: z.number().default(0.6),
  waterWeightPerDay: z.number().default(2),
  fuelWeight: z.number().default(0.2),
  clothingWeight: z.number().default(1),
  tripDays: z.number().default(3),
});

function evaluateAllFormulas(input: Backpacking_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.foodWeightPerDay * input.tripDays + input.waterWeightPerDay * input.tripDays + input.fuelWeight; results["consumableWeight"] = Number.isFinite(v) ? v : 0; } catch { results["consumableWeight"] = 0; }
  try { const v = input.baseWeight + input.clothingWeight + (input.foodWeightPerDay + input.waterWeightPerDay) * input.tripDays + input.fuelWeight; results["totalPackWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalPackWeight"] = 0; }
  return results;
}


export function calculateBackpacking_weight_calculator(input: Backpacking_weight_calculatorInput): Backpacking_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPackWeight"] ?? 0;
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


export interface Backpacking_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
