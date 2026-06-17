// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sloan_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.netIncome - input.cashFlowOperations - input.cashFlowInvesting; results["netAccruals"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netAccruals"] = 0; }
  try { const v = ((asFormulaNumber(results["netAccruals"])) / input.totalAssets) * 100; results["sloanRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sloanRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSloan_ratio_calculator(input: Sloan_ratio_calculatorInput): Sloan_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sloanRatio"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
