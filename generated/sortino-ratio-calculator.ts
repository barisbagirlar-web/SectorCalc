// Auto-generated from sortino-ratio-calculator-schema.json
import * as z from 'zod';

export interface Sortino_ratio_calculatorInput {
  averageReturn: number;
  riskFreeRate: number;
  targetReturn: number;
  downsideDeviation: number;
}

export const Sortino_ratio_calculatorInputSchema = z.object({
  averageReturn: z.number().default(0.1),
  riskFreeRate: z.number().default(0.03),
  targetReturn: z.number().default(0.03),
  downsideDeviation: z.number().default(0.05),
});

function evaluateAllFormulas(input: Sortino_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageReturn - input.targetReturn; results["excessReturn"] = Number.isFinite(v) ? v : 0; } catch { results["excessReturn"] = 0; }
  try { const v = (results["excessReturn"] ?? 0) / input.downsideDeviation; results["sortinoRatio"] = Number.isFinite(v) ? v : 0; } catch { results["sortinoRatio"] = 0; }
  return results;
}


export function calculateSortino_ratio_calculator(input: Sortino_ratio_calculatorInput): Sortino_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sortinoRatio"] ?? 0;
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


export interface Sortino_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
