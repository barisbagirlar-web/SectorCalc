// Auto-generated from percent-of-calculator-schema.json
import * as z from 'zod';

export interface Percent_of_calculatorInput {
  baseAmount: number;
  percent: number;
  additionalFixed: number;
  decimalPlaces: number;
}

export const Percent_of_calculatorInputSchema = z.object({
  baseAmount: z.number().default(100),
  percent: z.number().default(20),
  additionalFixed: z.number().default(0),
  decimalPlaces: z.number().default(2),
});

function evaluateAllFormulas(input: Percent_of_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseAmount * input.percent / 100; results["rawPercentResult"] = Number.isFinite(v) ? v : 0; } catch { results["rawPercentResult"] = 0; }
  try { const v = (results["rawPercentResult"] ?? 0) + input.additionalFixed; results["totalBeforeRounding"] = Number.isFinite(v) ? v : 0; } catch { results["totalBeforeRounding"] = 0; }
  try { const v = Math.round((results["totalBeforeRounding"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["roundedResult"] = Number.isFinite(v) ? v : 0; } catch { results["roundedResult"] = 0; }
  return results;
}


export function calculatePercent_of_calculator(input: Percent_of_calculatorInput): Percent_of_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedResult"] ?? 0;
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


export interface Percent_of_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
