// @ts-nocheck
// Auto-generated from sample-rate-calculator-schema.json
import * as z from 'zod';

export interface Sample_rate_calculatorInput {
  populationSize: number;
  zScore: number;
  marginOfError: number;
  estimatedProportion: number;
}

export const Sample_rate_calculatorInputSchema = z.object({
  populationSize: z.number().default(10000),
  zScore: z.number().default(1.96),
  marginOfError: z.number().default(5),
  estimatedProportion: z.number().default(0.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sample_rate_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.zScore**2 * input.estimatedProportion * (1 - input.estimatedProportion) / ((input.marginOfError / 100) ** 2); results["n0"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["n0"] = 0; }
  try { const v = (asFormulaNumber(results["n0"])) / (1 + ((asFormulaNumber(results["n0"])) - 1) / input.populationSize); results["sampleSize"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sampleSize"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSample_rate_calculator(input: Sample_rate_calculatorInput): Sample_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sampleSize"]);
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


export interface Sample_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
