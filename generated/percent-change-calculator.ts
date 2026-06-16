// Auto-generated from percent-change-calculator-schema.json
import * as z from 'zod';

export interface Percent_change_calculatorInput {
  initialValue: number;
  finalValue: number;
  decimalPlaces: number;
  multiplier: number;
}

export const Percent_change_calculatorInputSchema = z.object({
  initialValue: z.number().default(100),
  finalValue: z.number().default(110),
  decimalPlaces: z.number().default(2),
  multiplier: z.number().default(100),
});

function evaluateAllFormulas(input: Percent_change_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.finalValue - input.initialValue; results["absoluteChange"] = Number.isFinite(v) ? v : 0; } catch { results["absoluteChange"] = 0; }
  try { const v = (input.finalValue - input.initialValue) / input.initialValue; results["relativeChange"] = Number.isFinite(v) ? v : 0; } catch { results["relativeChange"] = 0; }
  try { const v = Math.round(((input.finalValue - input.initialValue) / input.initialValue) * input.multiplier * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["percentChange"] = Number.isFinite(v) ? v : 0; } catch { results["percentChange"] = 0; }
  return results;
}


export function calculatePercent_change_calculator(input: Percent_change_calculatorInput): Percent_change_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentChange"] ?? 0;
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


export interface Percent_change_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
