// @ts-nocheck
// Auto-generated from t-test-calculator-schema.json
import * as z from 'zod';

export interface T_test_calculatorInput {
  sampleMean: number;
  hypothesizedMean: number;
  sampleSD: number;
  sampleSize: number;
}

export const T_test_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  hypothesizedMean: z.number().default(0),
  sampleSD: z.number().default(1),
  sampleSize: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: T_test_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.sampleMean - input.hypothesizedMean; results["meanDifference"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meanDifference"] = 0; }
  try { const v = input.sampleMean - input.hypothesizedMean; results["meanDifference_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meanDifference_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateT_test_calculator(input: T_test_calculatorInput): T_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meanDifference_aux"]);
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


export interface T_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
