// Auto-generated from z-score-calculator-schema.json
import * as z from 'zod';

export interface Z_score_calculatorInput {
  data_points: number;
  population_mean: number;
  population_stddev: number;
  confidence_level: string;
  tail_type: string;
  use_sample_std: boolean;
  dataConfidence?: number;
}

export const Z_score_calculatorInputSchema = z.object({
  data_points: z.number(),
  population_mean: z.number(),
  population_stddev: z.number().min(0),
  confidence_level: z.enum(['90', '95', '99']).default('95'),
  tail_type: z.enum(['two-tailed', 'one-tailed-upper', 'one-tailed-lower']).default('two-tailed'),
  use_sample_std: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Z_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.data_points * input.population_mean * input.population_stddev; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.data_points * input.population_mean * input.population_stddev; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateZ_score_calculator(input: Z_score_calculatorInput): Z_score_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Historical comparison","Multi-variable correlation"],
  };
}


export interface Z_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
