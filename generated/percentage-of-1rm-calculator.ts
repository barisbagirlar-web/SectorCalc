// Auto-generated from percentage-of-1rm-calculator-schema.json
import * as z from 'zod';

export interface Percentage_of_1rm_calculatorInput {
  oneRepMax: number;
  targetPercentage: number;
  roundingIncrement: number;
  bodyWeight: number;
}

export const Percentage_of_1rm_calculatorInputSchema = z.object({
  oneRepMax: z.number().default(100),
  targetPercentage: z.number().default(90),
  roundingIncrement: z.number().default(2.5),
  bodyWeight: z.number().default(80),
});

function evaluateAllFormulas(input: Percentage_of_1rm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roundingIncrement > 0 ? Math.round((input.oneRepMax * input.targetPercentage / 100) / input.roundingIncrement) * input.roundingIncrement : (input.oneRepMax * input.targetPercentage / 100); results["targetWeight"] = Number.isFinite(v) ? v : 0; } catch { results["targetWeight"] = 0; }
  try { const v = input.oneRepMax * input.targetPercentage / 100; results["rawWeight"] = Number.isFinite(v) ? v : 0; } catch { results["rawWeight"] = 0; }
  try { const v = ((input.roundingIncrement > 0 ? Math.round((input.oneRepMax * input.targetPercentage / 100) / input.roundingIncrement) * input.roundingIncrement : (input.oneRepMax * input.targetPercentage / 100)) / input.bodyWeight) * 100; results["bodyWeightPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["bodyWeightPercentage"] = 0; }
  return results;
}


export function calculatePercentage_of_1rm_calculator(input: Percentage_of_1rm_calculatorInput): Percentage_of_1rm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["targetWeight"] ?? 0;
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


export interface Percentage_of_1rm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
