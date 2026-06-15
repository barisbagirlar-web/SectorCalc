// Auto-generated from probability-calculator-schema.json
import * as z from 'zod';

export interface Probability_calculatorInput {
  defect_count: number;
  sample_size: number;
  sigma_shift: number;
  distribution_type: string;
  confidence_level: string;
  use_historical_bias: boolean;
}

export const Probability_calculatorInputSchema = z.object({
  defect_count: z.number().min(0).max(1000000).default(10),
  sample_size: z.number().min(1).max(10000000).default(1000),
  sigma_shift: z.number().min(0).max(3).default(1.5),
  distribution_type: z.enum(['binomial', 'poisson', 'normal']).default('binomial'),
  confidence_level: z.enum(['90', '95', '99']).default('95'),
  use_historical_bias: z.boolean().default(false),
});

function evaluateAllFormulas(input: Probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["defect_rate"] = input.defect_count / input.sample_size; } catch { results["defect_rate"] = 0; }
  try { results["standard_error"] = Math.sqrt( ((results["defect_rate"] ?? 0) * (1 - (results["defect_rate"] ?? 0))) / input.sample_size ); } catch { results["standard_error"] = 0; }
  results["z_score"] = 0;
  results["confidence_interval"] = 0;
  try { results["dpm"] = (results["defect_rate"] ?? 0) * 1000000; } catch { results["dpm"] = 0; }
  try { results["sigma_level"] = normsinv(1 - (results["defect_rate"] ?? 0)) + input.sigma_shift; } catch { results["sigma_level"] = 0; }
  try { results["cpk"] = Math.min( ((results["sigma_level"] ?? 0) - input.sigma_shift) / 3, ((results["sigma_level"] ?? 0) + input.sigma_shift) / 3 ); } catch { results["cpk"] = 0; }
  return results;
}


export function calculateProbability_calculator(input: Probability_calculatorInput): Probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["failure_probability"] ?? 0;
  const breakdown = {
    defect_rate: values["defect_rate"] ?? 0,
    standard_error: values["standard_error"] ?? 0,
    confidence_interval_lower: values["confidence_interval_lower"] ?? 0,
    confidence_interval_upper: values["confidence_interval_upper"] ?? 0,
    dpm: values["dpm"] ?? 0,
    sigma_level: values["sigma_level"] ?? 0,
    cpk: values["cpk"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Sampling Error Contribution","Distribution Mismatch Risk","Historical Bias Effect"];
  const suggestedActions: string[] = ["Increase sample size to reduce standard error below 0.05.","Initiate root cause analysis and implement corrective actions to lower defect rate.","Apply DMAIC methodology to improve process capability to Cpk >= 1.33.","Re-evaluate distribution assumption; consider non-parametric methods for small samples."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Historical comparison"],
  };
}


export interface Probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: { defect_rate: number; standard_error: number; confidence_interval_lower: number; confidence_interval_upper: number; dpm: number; sigma_level: number; cpk: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
