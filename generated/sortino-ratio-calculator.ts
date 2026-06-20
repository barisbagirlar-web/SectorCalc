// Auto-generated from sortino-ratio-calculator-schema.json
import * as z from 'zod';

export interface Sortino_ratio_calculatorInput {
  averageReturn: number;
  riskFreeRate: number;
  targetReturn: number;
  downsideDeviation: number;
  dataConfidence?: number;
}

export const Sortino_ratio_calculatorInputSchema = z.object({
  averageReturn: z.number().default(0.1),
  riskFreeRate: z.number().default(0.03),
  targetReturn: z.number().default(0.03),
  downsideDeviation: z.number().default(0.05),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sortino_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageReturn * input.riskFreeRate * input.targetReturn * input.downsideDeviation; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.averageReturn * input.riskFreeRate * input.targetReturn * input.downsideDeviation; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSortino_ratio_calculator(input: Sortino_ratio_calculatorInput): Sortino_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Sortino_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
