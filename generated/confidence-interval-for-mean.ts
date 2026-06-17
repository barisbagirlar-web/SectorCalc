// @ts-nocheck
// Auto-generated from confidence-interval-for-mean-schema.json
import * as z from 'zod';

export interface Confidence_interval_for_meanInput {
  sampleMean: number;
  sampleStdDev: number;
  sampleSize: number;
  confidenceLevel: number;
}

export const Confidence_interval_for_meanInputSchema = z.object({
  sampleMean: z.number().default(0),
  sampleStdDev: z.number().default(1),
  sampleSize: z.number().default(30),
  confidenceLevel: z.number().default(0.95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Confidence_interval_for_meanInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.sampleMean + input.sampleStdDev + input.sampleSize; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.sampleMean + input.sampleStdDev + input.sampleSize; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConfidence_interval_for_mean(input: Confidence_interval_for_meanInput): Confidence_interval_for_meanOutput {
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


export interface Confidence_interval_for_meanOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
