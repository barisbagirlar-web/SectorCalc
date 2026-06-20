// Auto-generated from sloan-ratio-calculator-schema.json
import * as z from 'zod';

export interface Sloan_ratio_calculatorInput {
  netIncome: number;
  cashFlowOperations: number;
  cashFlowInvesting: number;
  totalAssets: number;
  dataConfidence?: number;
}

export const Sloan_ratio_calculatorInputSchema = z.object({
  netIncome: z.number().default(0),
  cashFlowOperations: z.number().default(0),
  cashFlowInvesting: z.number().default(0),
  totalAssets: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sloan_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netIncome - input.cashFlowOperations - input.cashFlowInvesting; results["netAccruals"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAccruals"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["netAccruals"])) / input.totalAssets) * 100; results["sloanRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sloanRatio"] = Number.NaN; }
  return results;
}


export function calculateSloan_ratio_calculator(input: Sloan_ratio_calculatorInput): Sloan_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sloanRatio"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
