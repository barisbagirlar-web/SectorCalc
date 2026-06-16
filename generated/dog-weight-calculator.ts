// Auto-generated from dog-weight-calculator-schema.json
import * as z from 'zod';

export interface Dog_weight_calculatorInput {
  age: number;
  currentWeight: number;
  growthRate: number;
  bcs: number;
}

export const Dog_weight_calculatorInputSchema = z.object({
  age: z.number().default(6),
  currentWeight: z.number().default(10),
  growthRate: z.number().default(0.2),
  bcs: z.number().default(5),
});

function evaluateAllFormulas(input: Dog_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight / (1 - Math.exp(-input.growthRate * input.age)); results["predictedAdultWeight"] = Number.isFinite(v) ? v : 0; } catch { results["predictedAdultWeight"] = 0; }
  try { const v = input.currentWeight * (1 - (input.bcs - 5) * 0.1); results["idealWeightBasedOnBCS"] = Number.isFinite(v) ? v : 0; } catch { results["idealWeightBasedOnBCS"] = 0; }
  try { const v = input.currentWeight / (1 - Math.exp(-input.growthRate * input.age)) * (1 - Math.exp(-input.growthRate * 12)); results["weightProjectionAt12Months"] = Number.isFinite(v) ? v : 0; } catch { results["weightProjectionAt12Months"] = 0; }
  return results;
}


export function calculateDog_weight_calculator(input: Dog_weight_calculatorInput): Dog_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["predictedAdultWeight"] ?? 0;
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


export interface Dog_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
