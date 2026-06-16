// Auto-generated from net-carb-calculator-schema.json
import * as z from 'zod';

export interface Net_carb_calculatorInput {
  totalCarbs: number;
  dietaryFiber: number;
  sugarAlcohols: number;
  allulose: number;
}

export const Net_carb_calculatorInputSchema = z.object({
  totalCarbs: z.number().default(0),
  dietaryFiber: z.number().default(0),
  sugarAlcohols: z.number().default(0),
  allulose: z.number().default(0),
});

function evaluateAllFormulas(input: Net_carb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCarbs - input.dietaryFiber - input.sugarAlcohols - input.allulose; results["netCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["netCarbs"] = 0; }
  return results;
}


export function calculateNet_carb_calculator(input: Net_carb_calculatorInput): Net_carb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netCarbs"] ?? 0;
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


export interface Net_carb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
