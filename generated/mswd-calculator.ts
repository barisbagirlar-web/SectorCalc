// Auto-generated from mswd-calculator-schema.json
import * as z from 'zod';

export interface Mswd_calculatorInput {
  sumWeightedSquaredResiduals: number;
  numberOfDataPoints: number;
  numberOfParameters: number;
  significanceLevel: number;
}

export const Mswd_calculatorInputSchema = z.object({
  sumWeightedSquaredResiduals: z.number().default(8),
  numberOfDataPoints: z.number().default(10),
  numberOfParameters: z.number().default(2),
  significanceLevel: z.number().default(0.05),
});

function evaluateAllFormulas(input: Mswd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sumWeightedSquaredResiduals / (input.numberOfDataPoints - input.numberOfParameters); results["mswd"] = Number.isFinite(v) ? v : 0; } catch { results["mswd"] = 0; }
  return results;
}


export function calculateMswd_calculator(input: Mswd_calculatorInput): Mswd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mswd"] ?? 0;
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


export interface Mswd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
