// Auto-generated from one-sample-t-test-calculator-schema.json
import * as z from 'zod';

export interface One_sample_t_test_calculatorInput {
  sampleMean: number;
  sampleStdDev: number;
  sampleSize: number;
  hypothesizedMean: number;
  dataConfidence?: number;
}

export const One_sample_t_test_calculatorInputSchema = z.object({
  sampleMean: z.number().default(10),
  sampleStdDev: z.number().default(2),
  sampleSize: z.number().default(30),
  hypothesizedMean: z.number().default(9),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: One_sample_t_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleSize - 1; results["degreesOfFreedom"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["degreesOfFreedom"] = 0; }
  try { const v = input.sampleMean - input.hypothesizedMean; results["meanDifference"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanDifference"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOne_sample_t_test_calculator(input: One_sample_t_test_calculatorInput): One_sample_t_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["meanDifference"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface One_sample_t_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
