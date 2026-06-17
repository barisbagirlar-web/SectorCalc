// @ts-nocheck
// Auto-generated from heart-rate-variability-calculator-schema.json
import * as z from 'zod';

export interface Heart_rate_variability_calculatorInput {
  numIntervals: number;
  sumRR: number;
  sumSquaredRR: number;
  sumSuccessiveDiffsSq: number;
  countNN50: number;
}

export const Heart_rate_variability_calculatorInputSchema = z.object({
  numIntervals: z.number().default(100),
  sumRR: z.number().default(80000),
  sumSquaredRR: z.number().default(64250000),
  sumSuccessiveDiffsSq: z.number().default(89100),
  countNN50: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heart_rate_variability_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.countNN50 / (input.numIntervals - 1)) * 100; results["pNN50"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pNN50"] = 0; }
  try { const v = input.sumRR / input.numIntervals; results["meanRR"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meanRR"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHeart_rate_variability_calculator(input: Heart_rate_variability_calculatorInput): Heart_rate_variability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meanRR"]);
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


export interface Heart_rate_variability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
