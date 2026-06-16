// Auto-generated from percent-increase-calculator-schema.json
import * as z from 'zod';

export interface Percent_increase_calculatorInput {
  originalValue: number;
  newValue: number;
  decimalPlaces: number;
  thresholdPercent: number;
}

export const Percent_increase_calculatorInputSchema = z.object({
  originalValue: z.number().default(100),
  newValue: z.number().default(120),
  decimalPlaces: z.number().default(2),
  thresholdPercent: z.number().default(10),
});

function evaluateAllFormulas(input: Percent_increase_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.newValue - input.originalValue; results["absoluteIncrease"] = Number.isFinite(v) ? v : 0; } catch { results["absoluteIncrease"] = 0; }
  try { const v = ((input.newValue - input.originalValue) / input.originalValue) * 100; results["percentIncrease"] = Number.isFinite(v) ? v : 0; } catch { results["percentIncrease"] = 0; }
  try { const v = Math.round((results["percentIncrease"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["roundedPercentIncrease"] = Number.isFinite(v) ? v : 0; } catch { results["roundedPercentIncrease"] = 0; }
  try { const v = (results["percentIncrease"] ?? 0) > input.thresholdPercent; results["thresholdExceeded"] = Number.isFinite(v) ? v : 0; } catch { results["thresholdExceeded"] = 0; }
  return results;
}


export function calculatePercent_increase_calculator(input: Percent_increase_calculatorInput): Percent_increase_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedPercentIncrease"] ?? 0;
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


export interface Percent_increase_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
