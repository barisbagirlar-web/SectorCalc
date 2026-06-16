// Auto-generated from learning-curve-time-estimator-schema.json
import * as z from 'zod';

export interface Learning_curve_time_estimatorInput {
  first_unit_time: number;
  learning_rate: number;
  cumulative_units: number;
  target_units: number;
  shift_length: number;
  learning_model: string;
  include_break_in: boolean;
  break_in_penalty: number;
}

export const Learning_curve_time_estimatorInputSchema = z.object({
  first_unit_time: z.number().min(0.1).max(10000).default(100),
  learning_rate: z.number().min(50).max(100).default(85),
  cumulative_units: z.number().min(1).max(1000000).default(100),
  target_units: z.number().min(1).max(1000000).default(200),
  shift_length: z.number().min(1).max(24).default(8),
  learning_model: z.enum(['wright', 'crawford', 'dejong']).default('wright'),
  include_break_in: z.boolean().default(false),
  break_in_penalty: z.number().min(0).max(50).default(10),
});

function evaluateAllFormulas(input: Learning_curve_time_estimatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log(input.learning_rate/100) / Math.log(2); results["learning_exponent"] = Number.isFinite(v) ? v : 0; } catch { results["learning_exponent"] = 0; }
  try { const v = input.first_unit_time * (input.target_units ^ b); results["time_for_target_unit"] = Number.isFinite(v) ? v : 0; } catch { results["time_for_target_unit"] = 0; }
  try { const v = input.first_unit_time * (input.target_units ^ b) / (1 + b); results["cumulative_average_time"] = Number.isFinite(v) ? v : 0; } catch { results["cumulative_average_time"] = 0; }
  try { const v = input.first_unit_time * (input.target_units ^ (1+b)) / (1+b); results["total_time_for_target"] = Number.isFinite(v) ? v : 0; } catch { results["total_time_for_target"] = 0; }
  try { const v = ((input.include_break_in) ? (factor = 1 + (input.break_in_penalty/100)) : (factor = 1)); results["break_in_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["break_in_adjustment"] = 0; }
  try { const v = (results["time_for_target_unit"] ?? 0) * (results["break_in_adjustment"] ?? 0); results["adjusted_time_for_target"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_time_for_target"] = 0; }
  try { const v = (results["total_time_for_target"] ?? 0) / input.shift_length; results["calendar_days_estimate"] = Number.isFinite(v) ? v : 0; } catch { results["calendar_days_estimate"] = 0; }
  return results;
}


export function calculateLearning_curve_time_estimator(input: Learning_curve_time_estimatorInput): Learning_curve_time_estimatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimated_time_target_unit"] ?? 0;
  const breakdown = {
    learning_exponent: values["learning_exponent"] ?? 0,
    time_for_target_unit_raw: values["time_for_target_unit_raw"] ?? 0,
    cumulative_average_time: values["cumulative_average_time"] ?? 0,
    total_time_for_target: values["total_time_for_target"] ?? 0,
    calendar_days_estimate: values["calendar_days_estimate"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Low Learning Rate","High First Unit Time","Break-In Penalty Applied"];
  const suggestedActions: string[] = ["Improve Operator Training","Reduce First Unit Time","Minimize Production Breaks"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-scenario comparison"],
  };
}


export interface Learning_curve_time_estimatorOutput {
  totalWasteCost: number;
  breakdown: { learning_exponent: number; time_for_target_unit_raw: number; cumulative_average_time: number; total_time_for_target: number; calendar_days_estimate: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
