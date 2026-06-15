// Auto-generated from standard-deviation-calculator-schema.json
import * as z from 'zod';

export interface Standard_deviation_calculatorInput {
  data_points: string;
  sample_size: number;
  data_type: string;
  population_flag: string;
  unit_of_measure: string;
  specification_limit_lower: number;
  specification_limit_upper: number;
  target_value: number;
}

export const Standard_deviation_calculatorInputSchema = z.object({
  data_points: z.string().default(''),
  sample_size: z.number().min(2).max(10000).default(10),
  data_type: z.enum(['continuous', 'discrete']).default('continuous'),
  population_flag: z.enum(['population', 'sample']).default('sample'),
  unit_of_measure: z.string().default(''),
  specification_limit_lower: z.number(),
  specification_limit_upper: z.number(),
  target_value: z.number(),
});

function evaluateAllFormulas(input: Standard_deviation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["mean"] = μ = (1/n) * Σ(x_i); } catch { results["mean"] = 0; }
  try { results["sum_squared_deviations"] = Σ(x_i - μ)**2; } catch { results["sum_squared_deviations"] = 0; }
  results["variance"] = 0;
  results["standard_deviation"] = 0;
  results["relative_standard_deviation"] = 0;
  try { results["process_capability_cp"] = (USL - LSL) / (6 * sigma); } catch { results["process_capability_cp"] = 0; }
  results["process_capability_cpk"] = 0;
  return results;
}


export function calculateStandard_deviation_calculator(input: Standard_deviation_calculatorInput): Standard_deviation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["standard_deviation"] ?? 0;
  const breakdown = {
    mean: values["mean"] ?? 0,
    variance: values["variance"] ?? 0,
    sample_size: values["sample_size"] ?? 0,
    sum_squared_deviations: values["sum_squared_deviations"] ?? 0,
    relative_standard_deviation: values["relative_standard_deviation"] ?? 0,
    cp: values["cp"] ?? 0,
    cpk: values["cpk"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Process Variation","Off-Center Process Mean","Insufficient Sample Size"];
  const suggestedActions: string[] = ["Reduce Process Variation","Center Process on Target","Increase Sample Size","Review Specification Limits"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Historical comparison","Control chart generation"],
  };
}


export interface Standard_deviation_calculatorOutput {
  totalWasteCost: number;
  breakdown: { mean: number; variance: number; sample_size: number; sum_squared_deviations: number; relative_standard_deviation: number; cp: number; cpk: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
