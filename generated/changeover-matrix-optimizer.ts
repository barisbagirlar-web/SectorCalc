// Auto-generated from changeover-matrix-optimizer-schema.json
import * as z from 'zod';

export interface Changeover_matrix_optimizerInput {
  changeover_time_matrix: number;
  number_of_changeovers_per_month: number;
  setup_external_time: number;
  setup_internal_time: number;
  product_family_count: number;
  standard_deviation_changeover_time: number;
  shift_pattern: string;
  lean_smed_implemented: boolean;
  target_changeover_time: number;
}

export const Changeover_matrix_optimizerInputSchema = z.object({
  changeover_time_matrix: z.number().min(0).max(480).default(45),
  number_of_changeovers_per_month: z.number().min(1).max(1000).default(120),
  setup_external_time: z.number().min(0).max(240).default(15),
  setup_internal_time: z.number().min(0).max(480).default(30),
  product_family_count: z.number().min(2).max(50).default(5),
  standard_deviation_changeover_time: z.number().min(0).max(120).default(8),
  shift_pattern: z.enum(['1-shift', '2-shift', '3-shift', 'continuous']).default('2-shift'),
  lean_smed_implemented: z.boolean().default(false),
  target_changeover_time: z.number().min(0).max(120).default(10),
});

function evaluateAllFormulas(input: Changeover_matrix_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["total_changeover_downtime"] = input.number_of_changeovers_per_month * input.changeover_time_matrix; } catch { results["total_changeover_downtime"] = 0; }
  try { results["internal_setup_ratio"] = input.setup_internal_time / (input.setup_internal_time + input.setup_external_time); } catch { results["internal_setup_ratio"] = 0; }
  try { results["smed_potential_savings"] = input.setup_internal_time * (1 - (input.target_changeover_time - input.setup_external_time) / input.setup_internal_time); } catch { results["smed_potential_savings"] = 0; }
  try { results["process_capability_index"] = Math.Math.min((input.changeover_time_matrix - input.target_changeover_time) / (3 * input.standard_deviation_changeover_time), (input.changeover_time_matrix - 0) / (3 * input.standard_deviation_changeover_time)); } catch { results["process_capability_index"] = 0; }
  try { results["changeover_frequency_impact"] = (results["total_changeover_downtime"] ?? 0) / ((results["total_changeover_downtime"] ?? 0) + (input.number_of_changeovers_per_month * (480 - input.changeover_time_matrix))); } catch { results["changeover_frequency_impact"] = 0; }
  try { results["optimized_changeover_time"] = input.setup_external_time + (input.setup_internal_time - (results["smed_potential_savings"] ?? 0)); } catch { results["optimized_changeover_time"] = 0; }
  try { results["annual_cost_savings"] = ((results["total_changeover_downtime"] ?? 0) - (input.number_of_changeovers_per_month * (results["optimized_changeover_time"] ?? 0))) * 12 * 0.85; } catch { results["annual_cost_savings"] = 0; }
  return results;
}


export function calculateChangeover_matrix_optimizer(input: Changeover_matrix_optimizerInput): Changeover_matrix_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["changeover_optimization_score"] ?? 0;
  const breakdown = {
    current_state: values["current_state"] ?? 0,
    optimized_state: values["optimized_state"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High internal setup time indicates lack of SMED standardization.","Large standard deviation indicates inconsistent procedures.","Most setup tasks performed while machine is stopped.","High number of changeovers per month reduces effective capacity."];
  const suggestedActions: string[] = ["Conduct SMED Kaizen event to reduce internal setup time by 50%.","Implement standardized work instructions for all changeover tasks.","Create external setup checklists and pre-kitting stations.","Use changeover matrix to group similar product families and reduce frequency."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Automated SMED video analysis integration","Real-time OEE dashboard sync"],
  };
}


export interface Changeover_matrix_optimizerOutput {
  totalWasteCost: number;
  breakdown: { current_state: number; optimized_state: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
