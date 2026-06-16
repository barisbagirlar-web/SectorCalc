// Auto-generated from cpm-delay-penalty-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Cpm_delay_penalty_optimizer_calculatorInput {
  planned_duration_days: number;
  actual_duration_days: number;
  daily_penalty_rate: number;
  critical_path_float_total: number;
  productivity_factor: number;
  rework_percentage: number;
  delay_type: string;
  use_earned_schedule: boolean;
}

export const Cpm_delay_penalty_optimizer_calculatorInputSchema = z.object({
  planned_duration_days: z.number().min(1).max(3650).default(100),
  actual_duration_days: z.number().min(1).max(3650).default(110),
  daily_penalty_rate: z.number().min(0).max(1000000).default(5000),
  critical_path_float_total: z.number().min(0).max(365).default(5),
  productivity_factor: z.number().min(0.1).max(1).default(0.85),
  rework_percentage: z.number().min(0).max(100).default(12),
  delay_type: z.enum(['excusable_compensable', 'excusable_non_compensable', 'non_excusable', 'concurrent']).default('excusable_compensable'),
  use_earned_schedule: z.boolean().default(true),
});

function evaluateAllFormulas(input: Cpm_delay_penalty_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.actual_duration_days - input.planned_duration_days; results["delay_days"] = Number.isFinite(v) ? v : 0; } catch { results["delay_days"] = 0; }
  try { const v = Math.max(0, (results["delay_days"] ?? 0) - input.critical_path_float_total); results["net_delay_days"] = Number.isFinite(v) ? v : 0; } catch { results["net_delay_days"] = 0; }
  try { const v = (results["net_delay_days"] ?? 0) * input.daily_penalty_rate; results["gross_penalty"] = Number.isFinite(v) ? v : 0; } catch { results["gross_penalty"] = 0; }
  try { const v = 1 - input.productivity_factor; results["productivity_loss_factor"] = Number.isFinite(v) ? v : 0; } catch { results["productivity_loss_factor"] = 0; }
  try { const v = input.rework_percentage / 100 * input.actual_duration_days * 0.15; results["rework_delay_impact"] = Number.isFinite(v) ? v : 0; } catch { results["rework_delay_impact"] = 0; }
  try { const v = (results["gross_penalty"] ?? 0) * (1 + (results["productivity_loss_factor"] ?? 0)) + ((results["rework_delay_impact"] ?? 0) * input.daily_penalty_rate); results["adjusted_penalty"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_penalty"] = 0; }
  results["total_penalty_optimized"] = 0;
  return results;
}


export function calculateCpm_delay_penalty_optimizer_calculator(input: Cpm_delay_penalty_optimizer_calculatorInput): Cpm_delay_penalty_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_penalty_optimized"] ?? 0;
  const breakdown = {
    gross_penalty: values["gross_penalty"] ?? 0,
    adjusted_penalty: values["adjusted_penalty"] ?? 0,
    net_delay_days: values["net_delay_days"] ?? 0,
    rework_delay_impact: values["rework_delay_impact"] ?? 0,
    productivity_loss_factor: values["productivity_loss_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unplanned Overtime","Material Rework","Coordination Gaps","Weather/Force Majeure"];
  const suggestedActions: string[] = ["Implement daily stand-up meetings to reduce coordination gaps (Lean).","Conduct root cause analysis for rework using Six Sigma DMAIC.","Increase float buffer on critical path by 2 days via schedule compression techniques.","Adopt Last Planner System (LPS) to improve productivity factor above 0.85.","Negotiate delay type reclassification if excusable non-compensable."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-project portfolio view","Real-time dashboard integration"],
  };
}


export interface Cpm_delay_penalty_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { gross_penalty: number; adjusted_penalty: number; net_delay_days: number; rework_delay_impact: number; productivity_loss_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
