// Auto-generated from wilcoxon-signed-rank-z-calculator-schema.json
import * as z from 'zod';

export interface Wilcoxon_signed_rank_z_calculatorInput {
  n: number;
  T: number;
  continuity: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Wilcoxon_signed_rank_z_calculatorInputSchema = z.object({
  n: z.number().default(10),
  T: z.number().default(25),
  continuity: z.number().default(0),
  decimalPlaces: z.number().default(4),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wilcoxon_signed_rank_z_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.n * (input.n + 1) / 4; results["expectedValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedValue"] = 0; }
  try { const v = input.n * (input.n + 1) / 4; results["expectedValue_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedValue_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWilcoxon_signed_rank_z_calculator(input: Wilcoxon_signed_rank_z_calculatorInput): Wilcoxon_signed_rank_z_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["expectedValue_aux"]);
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


export interface Wilcoxon_signed_rank_z_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
