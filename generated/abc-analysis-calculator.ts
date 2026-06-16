// Auto-generated from abc-analysis-calculator-schema.json
import * as z from 'zod';

export interface Abc_analysis_calculatorInput {
  annualDemand: number;
  unitCost: number;
  totalUsageValue: number;
  aClassThreshold: number;
  bClassThreshold: number;
}

export const Abc_analysis_calculatorInputSchema = z.object({
  annualDemand: z.number().default(1200),
  unitCost: z.number().default(25),
  totalUsageValue: z.number().default(100000),
  aClassThreshold: z.number().default(70),
  bClassThreshold: z.number().default(90),
});

function evaluateAllFormulas(input: Abc_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDemand * input.unitCost; results["itemUsageValue"] = Number.isFinite(v) ? v : 0; } catch { results["itemUsageValue"] = 0; }
  try { const v = ((results["itemUsageValue"] ?? 0) / input.totalUsageValue) * 100; results["percentageOfTotal"] = Number.isFinite(v) ? v : 0; } catch { results["percentageOfTotal"] = 0; }
  return results;
}


export function calculateAbc_analysis_calculator(input: Abc_analysis_calculatorInput): Abc_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["itemUsageValue"] ?? 0;
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


export interface Abc_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
