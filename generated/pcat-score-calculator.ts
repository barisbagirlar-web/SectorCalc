// Auto-generated from pcat-score-calculator-schema.json
import * as z from 'zod';

export interface Pcat_score_calculatorInput {
  usl: number;
  lsl: number;
  mean: number;
  stddev: number;
  dataConfidence?: number;
}

export const Pcat_score_calculatorInputSchema = z.object({
  usl: z.number().default(10),
  lsl: z.number().default(5),
  mean: z.number().default(7.5),
  stddev: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pcat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.usl - input.lsl) / (6 * input.stddev); results["cp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cp"] = Number.NaN; }
  try { const v = (input.usl - input.lsl) / (6 * input.stddev); results["cp_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cp_aux"] = Number.NaN; }
  return results;
}


export function calculatePcat_score_calculator(input: Pcat_score_calculatorInput): Pcat_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cp_aux"]);
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


export interface Pcat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
