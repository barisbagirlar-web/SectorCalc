// Auto-generated from smed-changeover-optimizer-schema.json
import * as z from 'zod';

export interface Smed_changeover_optimizerInput {
  current_changeover_time: number;
  internal_operations_percentage: number;
  setup_team_size: number;
  parallel_work_possible: boolean;
  standardization_level: string;
  waste_motion_score: number;
}

export const Smed_changeover_optimizerInputSchema = z.object({
  current_changeover_time: z.number().min(1).max(480).default(45),
  internal_operations_percentage: z.number().min(0).max(100).default(60),
  setup_team_size: z.number().min(1).max(10).default(2),
  parallel_work_possible: z.boolean().default(true),
  standardization_level: z.enum(['low', 'medium', 'high']).default('medium'),
  waste_motion_score: z.number().min(1).max(10).default(6),
});

function evaluateAllFormulas(input: Smed_changeover_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["external_operations_percentage"] = 100 - input.internal_operations_percentage; } catch { results["external_operations_percentage"] = 0; }
  try { results["theoretical_minimum_changeover"] = input.current_changeover_time * ((results["external_operations_percentage"] ?? 0) / 100) + (input.current_changeover_time * (input.internal_operations_percentage / 100) / (input.parallel_work_possible ? input.setup_team_size : 1)); } catch { results["theoretical_minimum_changeover"] = 0; }
  try { results["standardization_factor"] = (input.standardization_level === 'low' ? 1.3 : (input.standardization_level === 'medium' ? 1.0 : (input.standardization_level === 'high' ? 0.8 : 0))); } catch { results["standardization_factor"] = 0; }
  try { results["waste_motion_factor"] = 1 + (input.waste_motion_score - 1) * 0.05; } catch { results["waste_motion_factor"] = 0; }
  try { results["achievable_changeover_time"] = (results["theoretical_minimum_changeover"] ?? 0) * (results["standardization_factor"] ?? 0) * (results["waste_motion_factor"] ?? 0); } catch { results["achievable_changeover_time"] = 0; }
  try { results["reduction_potential"] = input.current_changeover_time - (results["achievable_changeover_time"] ?? 0); } catch { results["reduction_potential"] = 0; }
  try { results["reduction_percentage"] = ((results["reduction_potential"] ?? 0) / input.current_changeover_time) * 100; } catch { results["reduction_percentage"] = 0; }
  return results;
}


export function calculateSmed_changeover_optimizer(input: Smed_changeover_optimizerInput): Smed_changeover_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["smed_score"] ?? 0;
  const breakdown = {
    current_changeover_time: values["current_changeover_time"] ?? 0,
    internal_operations_percentage: values["internal_operations_percentage"] ?? 0,
    external_operations_percentage: values["external_operations_percentage"] ?? 0,
    theoretical_minimum_changeover: values["theoretical_minimum_changeover"] ?? 0,
    achievable_changeover_time: values["achievable_changeover_time"] ?? 0,
    reduction_potential: values["reduction_potential"] ?? 0,
    reduction_percentage: values["reduction_percentage"] ?? 0,
    standardization_factor: values["standardization_factor"] ?? 0,
    waste_motion_factor: values["waste_motion_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unnecessary Movement","Lack of Standardization","Waiting for Decisions","Poor Parallelization"];
  const suggestedActions: string[] = ["Convert Internal to External","Implement 5S in Work Area","Standardize Die and Tooling Design","Train Operators in Parallel Task Execution","Create Visual Work Instructions"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-plant comparison"],
  };
}


export interface Smed_changeover_optimizerOutput {
  totalWasteCost: number;
  breakdown: { current_changeover_time: number; internal_operations_percentage: number; external_operations_percentage: number; theoretical_minimum_changeover: number; achievable_changeover_time: number; reduction_potential: number; reduction_percentage: number; standardization_factor: number; waste_motion_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
