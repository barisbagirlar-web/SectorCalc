// Auto-generated from bakers-percentage-calculator-schema.json
import * as z from 'zod';

export interface Bakers_percentage_calculatorInput {
  flourWeight: number;
  waterPercentage: number;
  yeastPercentage: number;
  saltPercentage: number;
  sugarPercentage: number;
  fatPercentage: number;
}

export const Bakers_percentage_calculatorInputSchema = z.object({
  flourWeight: z.number().default(1000),
  waterPercentage: z.number().default(60),
  yeastPercentage: z.number().default(1),
  saltPercentage: z.number().default(2),
  sugarPercentage: z.number().default(0),
  fatPercentage: z.number().default(0),
});

function evaluateAllFormulas(input: Bakers_percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flourWeight * input.waterPercentage / 100; results["waterWeight"] = Number.isFinite(v) ? v : 0; } catch { results["waterWeight"] = 0; }
  try { const v = input.flourWeight * input.yeastPercentage / 100; results["yeastWeight"] = Number.isFinite(v) ? v : 0; } catch { results["yeastWeight"] = 0; }
  try { const v = input.flourWeight * input.saltPercentage / 100; results["saltWeight"] = Number.isFinite(v) ? v : 0; } catch { results["saltWeight"] = 0; }
  try { const v = input.flourWeight * input.sugarPercentage / 100; results["sugarWeight"] = Number.isFinite(v) ? v : 0; } catch { results["sugarWeight"] = 0; }
  try { const v = input.flourWeight * input.fatPercentage / 100; results["fatWeight"] = Number.isFinite(v) ? v : 0; } catch { results["fatWeight"] = 0; }
  try { const v = input.flourWeight + (results["waterWeight"] ?? 0) + (results["yeastWeight"] ?? 0) + (results["saltWeight"] ?? 0) + (results["sugarWeight"] ?? 0) + (results["fatWeight"] ?? 0); results["totalDoughWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalDoughWeight"] = 0; }
  return results;
}


export function calculateBakers_percentage_calculator(input: Bakers_percentage_calculatorInput): Bakers_percentage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDoughWeight"] ?? 0;
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


export interface Bakers_percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
