// @ts-nocheck
// Auto-generated from z-score-to-percentile-calculator-schema.json
import * as z from 'zod';

export interface Z_score_to_percentile_calculatorInput {
  zScore: number;
  mean: number;
  stdDev: number;
  rawScore: number;
  rawScoreProvided: number;
  tail: number;
}

export const Z_score_to_percentile_calculatorInputSchema = z.object({
  zScore: z.number().default(0),
  mean: z.number().default(0),
  stdDev: z.number().default(1),
  rawScore: z.number().default(0),
  rawScoreProvided: z.number().default(0),
  tail: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Z_score_to_percentile_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.rawScoreProvided === 1 ? (input.rawScore - input.mean) / input.stdDev : input.zScore) ? 1 : 0); results["zComputed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["zComputed"] = 0; }
  try { const v = ((input.rawScoreProvided === 1 ? (input.rawScore - input.mean) / input.stdDev : input.zScore) ? 1 : 0); results["zComputed_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["zComputed_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateZ_score_to_percentile_calculator(input: Z_score_to_percentile_calculatorInput): Z_score_to_percentile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["zComputed_aux"]);
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


export interface Z_score_to_percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
