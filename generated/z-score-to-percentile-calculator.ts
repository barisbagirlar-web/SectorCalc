// Auto-generated from z-score-to-percentile-calculator-schema.json
import * as z from 'zod';

export interface Z_score_to_percentile_calculatorInput {
  zScore: number;
  mean: number;
  stdDev: number;
  rawScore: number;
  rawScoreProvided: number;
  tail: number;
  dataConfidence?: number;
}

export const Z_score_to_percentile_calculatorInputSchema = z.object({
  zScore: z.number().default(0),
  mean: z.number().default(0),
  stdDev: z.number().default(1),
  rawScore: z.number().default(0),
  rawScoreProvided: z.number().default(0),
  tail: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Z_score_to_percentile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.rawScoreProvided === 1 ? (input.rawScore - input.mean) / input.stdDev : input.zScore) ? 1 : 0); results["zComputed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zComputed"] = Number.NaN; }
  try { const v = ((input.rawScoreProvided === 1 ? (input.rawScore - input.mean) / input.stdDev : input.zScore) ? 1 : 0); results["zComputed_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zComputed_aux"] = Number.NaN; }
  return results;
}


export function calculateZ_score_to_percentile_calculator(input: Z_score_to_percentile_calculatorInput): Z_score_to_percentile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["zComputed_aux"]);
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


export interface Z_score_to_percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
