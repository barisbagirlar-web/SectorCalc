// @ts-nocheck
// Auto-generated from paired-t-test-calculator-schema.json
import * as z from 'zod';

export interface Paired_t_test_calculatorInput {
  meanDifference: number;
  standardDeviationDifference: number;
  sampleSize: number;
  hypothesizedDifference: number;
}

export const Paired_t_test_calculatorInputSchema = z.object({
  meanDifference: z.number().default(0),
  standardDeviationDifference: z.number().default(1),
  sampleSize: z.number().default(10),
  hypothesizedDifference: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Paired_t_test_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.meanDifference + input.standardDeviationDifference + input.sampleSize; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.meanDifference + input.standardDeviationDifference + input.sampleSize; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePaired_t_test_calculator(input: Paired_t_test_calculatorInput): Paired_t_test_calculatorOutput {
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


export interface Paired_t_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
