// Auto-generated from yo-yo-diet-calculator-schema.json
import * as z from 'zod';

export interface Yo_yo_diet_calculatorInput {
  startingWeight: number;
  dailyWeightLoss: number;
  dietDuration: number;
  dailyWeightGain: number;
  postDietDuration: number;
  cycles: number;
}

export const Yo_yo_diet_calculatorInputSchema = z.object({
  startingWeight: z.number().default(70),
  dailyWeightLoss: z.number().default(0.2),
  dietDuration: z.number().default(30),
  dailyWeightGain: z.number().default(0.15),
  postDietDuration: z.number().default(60),
  cycles: z.number().default(1),
});

function evaluateAllFormulas(input: Yo_yo_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyWeightLoss * input.dietDuration * input.cycles; results["totalWeightLoss"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightLoss"] = 0; }
  try { const v = input.dailyWeightGain * input.postDietDuration * input.cycles; results["totalWeightGain"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightGain"] = 0; }
  try { const v = (results["totalWeightGain"] ?? 0) - (results["totalWeightLoss"] ?? 0); results["netWeightChange"] = Number.isFinite(v) ? v : 0; } catch { results["netWeightChange"] = 0; }
  try { const v = input.startingWeight + (results["netWeightChange"] ?? 0); results["finalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["finalWeight"] = 0; }
  return results;
}


export function calculateYo_yo_diet_calculator(input: Yo_yo_diet_calculatorInput): Yo_yo_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalWeight"] ?? 0;
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


export interface Yo_yo_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
