// Auto-generated from taguchi-quality-loss-function-schema.json
import * as z from 'zod';

export interface Taguchi_quality_loss_functionInput {
  target_value: number;
  lower_spec_limit: number;
  upper_spec_limit: number;
  process_mean: number;
  process_std_dev: number;
  cost_at_limit: number;
  deviation_at_limit: number;
  production_volume: number;
  inspection_rate: number;
  loss_function_type: string;
  include_hidden_factory: boolean;
}

export const Taguchi_quality_loss_functionInputSchema = z.object({
  target_value: z.number().min(0).max(1000).default(10),
  lower_spec_limit: z.number().min(0).max(1000).default(9.5),
  upper_spec_limit: z.number().min(0).max(1000).default(10.5),
  process_mean: z.number().min(0).max(1000).default(10.2),
  process_std_dev: z.number().min(0.001).max(100).default(0.15),
  cost_at_limit: z.number().min(0).max(100000).default(50),
  deviation_at_limit: z.number().min(0.001).max(100).default(0.5),
  production_volume: z.number().min(1).max(100000000).default(10000),
  inspection_rate: z.number().min(0).max(100).default(100),
  loss_function_type: z.enum(['nominal-is-best', 'smaller-is-better', 'larger-is-better']).default('nominal-is-best'),
  include_hidden_factory: z.boolean().default(true),
});

function evaluateAllFormulas(input: Taguchi_quality_loss_functionInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["loss_coefficient_k"] = 0;
  results["mean_squared_deviation_msd"] = 0;
  try { const v = k * MSD; results["loss_per_unit_lpu"] = Number.isFinite(v) ? v : 0; } catch { results["loss_per_unit_lpu"] = 0; }
  try { const v = L * N; results["total_loss_basic"] = Number.isFinite(v) ? v : 0; } catch { results["total_loss_basic"] = 0; }
  try { const v = (1 - input.inspection_rate/100) * TotalBasicLoss * 0.15 + (Cpk < 1.33 ? TotalBasicLoss * 0.10 : 0); results["hidden_factory_loss"] = Number.isFinite(v) ? v : 0; } catch { results["hidden_factory_loss"] = 0; }
  results["process_capability_cpk"] = 0;
  try { const v = TotalBasicLoss + (input.include_hidden_factory ? HiddenLoss : 0); results["total_loss_adjusted"] = Number.isFinite(v) ? v : 0; } catch { results["total_loss_adjusted"] = 0; }
  return results;
}


export function calculateTaguchi_quality_loss_function(input: Taguchi_quality_loss_functionInput): Taguchi_quality_loss_functionOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_adjusted_loss"] ?? 0;
  const breakdown = {
    loss_coefficient_k: values["loss_coefficient_k"] ?? 0,
    mean_squared_deviation_msd: values["mean_squared_deviation_msd"] ?? 0,
    loss_per_unit_lpu: values["loss_per_unit_lpu"] ?? 0,
    total_basic_loss: values["total_basic_loss"] ?? 0,
    hidden_factory_loss: values["hidden_factory_loss"] ?? 0,
    process_capability_cpk: values["process_capability_cpk"] ?? 0,
    process_sigma_level: values["process_sigma_level"] ?? 0
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Center the process mean to target value","Reduce process standard deviation by 20%","Increase inspection rate to 100%","Conduct Design of Experiments (DOE) to identify key factors"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-parameter simulation","Custom specification limits"],
  };
}


export interface Taguchi_quality_loss_functionOutput {
  totalWasteCost: number;
  breakdown: { loss_coefficient_k: number; mean_squared_deviation_msd: number; loss_per_unit_lpu: number; total_basic_loss: number; hidden_factory_loss: number; process_capability_cpk: number; process_sigma_level: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
