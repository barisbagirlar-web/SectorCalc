// Auto-generated from time-study-analyzer-schema.json
import * as z from 'zod';

export interface Time_study_analyzerInput {
  observed_time: number;
  performance_rating: number;
  allowance_percentage: number;
  frequency_per_cycle: number;
  work_measurement_method: string;
  include_learning_curve: boolean;
}

export const Time_study_analyzerInputSchema = z.object({
  observed_time: z.number().min(1).max(3600).default(60),
  performance_rating: z.number().min(50).max(150).default(100),
  allowance_percentage: z.number().min(0).max(50).default(15),
  frequency_per_cycle: z.number().min(0.1).max(100).default(1),
  work_measurement_method: z.enum(['Stopwatch', 'Predetermined Motion Time', 'Work Sampling', 'Standard Data']).default('Stopwatch'),
  include_learning_curve: z.boolean().default(false),
});

function evaluateAllFormulas(input: Time_study_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["normal_time"] = input.observed_time * (input.performance_rating / 100); } catch { results["normal_time"] = 0; }
  try { results["allowance_factor"] = 1 / (1 - (input.allowance_percentage / 100)); } catch { results["allowance_factor"] = 0; }
  try { results["standard_time_per_occurrence"] = (results["normal_time"] ?? 0) * (results["allowance_factor"] ?? 0); } catch { results["standard_time_per_occurrence"] = 0; }
  try { results["standard_time_per_cycle"] = (results["standard_time_per_occurrence"] ?? 0) * input.frequency_per_cycle; } catch { results["standard_time_per_cycle"] = 0; }
  try { results["learning_curve_factor"] = input.include_learning_curve ? (1 / (1 + 0.2 * log10(100))) : 1; } catch { results["learning_curve_factor"] = 0; }
  try { results["adjusted_standard_time"] = (results["standard_time_per_cycle"] ?? 0) * (results["learning_curve_factor"] ?? 0); } catch { results["adjusted_standard_time"] = 0; }
  results["data_confidence_adjustment"] = 0;
  try { results["primary_result"] = (results["adjusted_standard_time"] ?? 0) * (results["data_confidence_adjustment"] ?? 0); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateTime_study_analyzer(input: Time_study_analyzerInput): Time_study_analyzerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["standard_time"] ?? 0;
  const breakdown = {
    normal_time: values["normal_time"] ?? 0,
    allowance_factor: values["allowance_factor"] ?? 0,
    standard_time_per_occurrence: values["standard_time_per_occurrence"] ?? 0,
    standard_time_per_cycle: values["standard_time_per_cycle"] ?? 0,
    learning_curve_factor: values["learning_curve_factor"] ?? 0,
    adjusted_standard_time: values["adjusted_standard_time"] ?? 0,
    data_confidence_adjustment: values["data_confidence_adjustment"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Allowance","Low Performance Rating","High Frequency with Low Observed Time","Work Sampling Uncertainty"];
  const suggestedActions: string[] = ["Conduct ergonomic assessment to reduce physical strain and lower allowance.","Implement standardized work instructions and operator training program.","Decompose the work element into smaller sub-elements for more accurate measurement.","Increase number of observations to reduce confidence interval width.","Consider using Predetermined Motion Time Systems (e.g., MTM, MOST) to reduce rating bias."];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-operator comparison","Custom performance rating"],
  };
}


export interface Time_study_analyzerOutput {
  totalWasteCost: number;
  breakdown: { normal_time: number; allowance_factor: number; standard_time_per_occurrence: number; standard_time_per_cycle: number; learning_curve_factor: number; adjusted_standard_time: number; data_confidence_adjustment: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
