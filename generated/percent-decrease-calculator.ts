// Auto-generated from percent-decrease-calculator-schema.json
import * as z from 'zod';

export interface Percent_decrease_calculatorInput {
  initialValue: number;
  finalValue: number;
  precision: number;
  adjustmentFactor: number;
  targetDecreasePercent: number;
}

export const Percent_decrease_calculatorInputSchema = z.object({
  initialValue: z.number().default(1000),
  finalValue: z.number().default(800),
  precision: z.number().default(2),
  adjustmentFactor: z.number().default(1),
  targetDecreasePercent: z.number().default(10),
});

function evaluateAllFormulas(input: Percent_decrease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(((input.initialValue - input.finalValue) / input.initialValue * 100) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["percentDecreaseRounded"] = Number.isFinite(v) ? v : 0; } catch { results["percentDecreaseRounded"] = 0; }
  try { const v = input.initialValue - input.finalValue; results["absoluteDecrease"] = Number.isFinite(v) ? v : 0; } catch { results["absoluteDecrease"] = 0; }
  try { const v = Math.round((((input.initialValue * input.adjustmentFactor) - input.finalValue) / (input.initialValue * input.adjustmentFactor) * 100) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["adjustedPercentDecreaseRounded"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedPercentDecreaseRounded"] = 0; }
  try { const v = Math.round((input.targetDecreasePercent - ((input.initialValue - input.finalValue) / input.initialValue * 100)) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["targetVarianceRounded"] = Number.isFinite(v) ? v : 0; } catch { results["targetVarianceRounded"] = 0; }
  return results;
}


export function calculatePercent_decrease_calculator(input: Percent_decrease_calculatorInput): Percent_decrease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentDecreaseRounded"] ?? 0;
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


export interface Percent_decrease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
