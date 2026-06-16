// Auto-generated from percentage-point-calculator-schema.json
import * as z from 'zod';

export interface Percentage_point_calculatorInput {
  percentageA: number;
  percentageB: number;
  absolute: number;
  decimalPlaces: number;
}

export const Percentage_point_calculatorInputSchema = z.object({
  percentageA: z.number().default(0),
  percentageB: z.number().default(0),
  absolute: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function evaluateAllFormulas(input: Percentage_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.absolute === 1 ? Math.abs(input.percentageA - input.percentageB) : (input.percentageA - input.percentageB)); results["difference"] = Number.isFinite(v) ? v : 0; } catch { results["difference"] = 0; }
  try { const v = Math.round((input.absolute === 1 ? Math.abs(input.percentageA - input.percentageB) : (input.percentageA - input.percentageB)) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["differenceRounded"] = Number.isFinite(v) ? v : 0; } catch { results["differenceRounded"] = 0; }
  return results;
}


export function calculatePercentage_point_calculator(input: Percentage_point_calculatorInput): Percentage_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["differenceRounded"] ?? 0;
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


export interface Percentage_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
