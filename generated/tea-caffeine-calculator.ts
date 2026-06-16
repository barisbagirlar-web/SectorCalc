// Auto-generated from tea-caffeine-calculator-schema.json
import * as z from 'zod';

export interface Tea_caffeine_calculatorInput {
  teaCaffeinePerGram: number;
  teaAmount: number;
  steepingTime: number;
  waterTemperature: number;
}

export const Tea_caffeine_calculatorInputSchema = z.object({
  teaCaffeinePerGram: z.number().default(25),
  teaAmount: z.number().default(2.5),
  steepingTime: z.number().default(3),
  waterTemperature: z.number().default(90),
});

function evaluateAllFormulas(input: Tea_caffeine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(1, (input.steepingTime / 5) * (input.waterTemperature / 100)); results["efficiency"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency"] = 0; }
  try { const v = input.teaCaffeinePerGram * input.teaAmount * (results["efficiency"] ?? 0); results["totalCaffeine"] = Number.isFinite(v) ? v : 0; } catch { results["totalCaffeine"] = 0; }
  return results;
}


export function calculateTea_caffeine_calculator(input: Tea_caffeine_calculatorInput): Tea_caffeine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCaffeine"] ?? 0;
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


export interface Tea_caffeine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
