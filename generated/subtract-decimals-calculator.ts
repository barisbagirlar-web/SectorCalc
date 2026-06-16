// Auto-generated from subtract-decimals-calculator-schema.json
import * as z from 'zod';

export interface Subtract_decimals_calculatorInput {
  valueA: number;
  valueB: number;
  precision: number;
  offset: number;
}

export const Subtract_decimals_calculatorInputSchema = z.object({
  valueA: z.number().default(0),
  valueB: z.number().default(0),
  precision: z.number().default(2),
  offset: z.number().default(0),
});

function evaluateAllFormulas(input: Subtract_decimals_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.valueA - input.valueB; results["rawDifference"] = Number.isFinite(v) ? v : 0; } catch { results["rawDifference"] = 0; }
  try { const v = Math.round((input.valueA - input.valueB) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedDifference"] = Number.isFinite(v) ? v : 0; } catch { results["roundedDifference"] = 0; }
  try { const v = Math.round((input.valueA - input.valueB) * Math.pow(10, input.precision)) / Math.pow(10, input.precision) + input.offset; results["finalResult"] = Number.isFinite(v) ? v : 0; } catch { results["finalResult"] = 0; }
  return results;
}


export function calculateSubtract_decimals_calculator(input: Subtract_decimals_calculatorInput): Subtract_decimals_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalResult"] ?? 0;
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


export interface Subtract_decimals_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
