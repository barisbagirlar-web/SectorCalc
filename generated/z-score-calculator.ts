// Auto-generated from z-score-calculator-schema.json
import * as z from 'zod';

export interface Z_score_calculatorInput {
  data_points: number;
  population_mean: number;
  population_stddev: number;
  confidence_level: string;
  tail_type: string;
  use_sample_std: boolean;
}

export const Z_score_calculatorInputSchema = z.object({
  data_points: z.number(),
  population_mean: z.number(),
  population_stddev: z.number().min(0),
  confidence_level: z.enum(['90', '95', '99']).default('95'),
  tail_type: z.enum(['two-tailed', 'one-tailed-upper', 'one-tailed-lower']).default('two-tailed'),
  use_sample_std: z.boolean().default(true),
});

function evaluateAllFormulas(input: Z_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["sample_mean"] = 0;
  try { const v = Math.sqrt( Σ (xi - x̄)**2 / (n - 1) ); results["sample_stddev"] = Number.isFinite(v) ? v : 0; } catch { results["sample_stddev"] = 0; }
  try { const v = ((input.population_stddev != null) ? (input.population_stddev) : ((results["sample_stddev"] ?? 0))); results["effective_stddev"] = Number.isFinite(v) ? v : 0; } catch { results["effective_stddev"] = 0; }
  try { const v = ((input.population_mean != null) ? (input.population_mean) : ((results["sample_mean"] ?? 0))); results["effective_mean"] = Number.isFinite(v) ? v : 0; } catch { results["effective_mean"] = 0; }
  try { const v = (x̄ - μ_eff) / ((results["effective_stddev"] ?? 0) / Math.sqrt(n)); results["z_score"] = Number.isFinite(v) ? v : 0; } catch { results["z_score"] = 0; }
  results["p_value"] = 0;
  try { const v = x̄ + z_critical * ((results["effective_stddev"] ?? 0) / Math.sqrt(n)); results["confidence_interval"] = Number.isFinite(v) ? v : 0; } catch { results["confidence_interval"] = 0; }
  return results;
}


export function calculateZ_score_calculator(input: Z_score_calculatorInput): Z_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["z_score"] ?? 0;
  const breakdown = {
    sample_size: values["sample_size"] ?? 0,
    sample_mean: values["sample_mean"] ?? 0,
    sample_stddev: values["sample_stddev"] ?? 0,
    effective_mean: values["effective_mean"] ?? 0,
    effective_stddev: values["effective_stddev"] ?? 0,
    p_value: values["p_value"] ?? 0,
    confidence_interval_lower: values["confidence_interval_lower"] ?? 0,
    confidence_interval_upper: values["confidence_interval_upper"] ?? 0,
    confidence_level_used: values["confidence_level_used"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Small Sample Size","High Variability","Non-Normal Data","Outlier Presence"];
  const suggestedActions: string[] = ["Increase Sample Size","Check Process Stability","Transform Data","Use t-Test Instead","Investigate Outliers"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
  breakdown: { sample_size: number; sample_mean: number; sample_stddev: number; effective_mean: number; effective_stddev: number; p_value: number; confidence_interval_lower: number; confidence_interval_upper: number; confidence_level_used: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
