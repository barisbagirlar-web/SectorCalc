// Auto-generated from sloan-ratio-calculator-schema.json
import * as z from 'zod';

export interface Sloan_ratio_calculatorInput {
  netIncome: number;
  cashFlowOperations: number;
  cashFlowInvesting: number;
  totalAssets: number;
}

export const Sloan_ratio_calculatorInputSchema = z.object({
  netIncome: z.number().default(0),
  cashFlowOperations: z.number().default(0),
  cashFlowInvesting: z.number().default(0),
  totalAssets: z.number().default(0),
});

function evaluateAllFormulas(input: Sloan_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netIncome - input.cashFlowOperations - input.cashFlowInvesting; results["netAccruals"] = Number.isFinite(v) ? v : 0; } catch { results["netAccruals"] = 0; }
  try { const v = ((results["netAccruals"] ?? 0) / input.totalAssets) * 100; results["sloanRatio"] = Number.isFinite(v) ? v : 0; } catch { results["sloanRatio"] = 0; }
  return results;
}


export function calculateSloan_ratio_calculator(input: Sloan_ratio_calculatorInput): Sloan_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sloanRatio"] ?? 0;
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


export interface Sloan_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
