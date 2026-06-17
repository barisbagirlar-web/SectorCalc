// @ts-nocheck
// Auto-generated from linear-progression-calculator-schema.json
import * as z from 'zod';

export interface Linear_progression_calculatorInput {
  firstTerm: number;
  commonDifference: number;
  numberOfTerms: number;
  termPosition: number;
  decimals: number;
}

export const Linear_progression_calculatorInputSchema = z.object({
  firstTerm: z.number().default(0),
  commonDifference: z.number().default(0),
  numberOfTerms: z.number().default(1),
  termPosition: z.number().default(1),
  decimals: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Linear_progression_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.firstTerm + input.commonDifference + input.numberOfTerms; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.firstTerm + input.commonDifference + input.numberOfTerms; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLinear_progression_calculator(input: Linear_progression_calculatorInput): Linear_progression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Linear_progression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
