// Auto-generated from sewing-line-balancer-schema.json
import * as z from 'zod';

export interface Sewing_line_balancerInput {
  total_work_content: number;
  number_of_operators: number;
  takt_time: number;
  bottleneck_time: number;
  line_balance_type: string;
  allow_rebalancing: boolean;
}

export const Sewing_line_balancerInputSchema = z.object({
  total_work_content: z.number().min(60).max(36000).default(3600),
  number_of_operators: z.number().min(1).max(200).default(20),
  takt_time: z.number().min(10).max(600).default(180),
  bottleneck_time: z.number().min(10).max(600).default(200),
  line_balance_type: z.enum(['straight', 'u_shape', 'modular']).default('straight'),
  allow_rebalancing: z.boolean().default(true),
});

function evaluateAllFormulas(input: Sewing_line_balancerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["theoretical_min_operators"] = Math.ceil(input.total_work_content / input.takt_time); } catch { results["theoretical_min_operators"] = 0; }
  try { results["balance_efficiency"] = (input.total_work_content / (input.number_of_operators * input.bottleneck_time)) * 100; } catch { results["balance_efficiency"] = 0; }
  try { results["idle_time_per_cycle"] = (input.number_of_operators * input.bottleneck_time) - input.total_work_content; } catch { results["idle_time_per_cycle"] = 0; }
  try { results["line_capacity"] = 3600 / input.bottleneck_time; } catch { results["line_capacity"] = 0; }
  try { results["demand_fulfillment_rate"] = Math.min(1, input.takt_time / input.bottleneck_time) * 100; } catch { results["demand_fulfillment_rate"] = 0; }
  try { results["labor_productivity"] = input.total_work_content / (input.number_of_operators * 3600); } catch { results["labor_productivity"] = 0; }
  try { results["primary_result"] = (results["balance_efficiency"] ?? 0) * ((results["demand_fulfillment_rate"] ?? 0) / 100) * (1 - ((results["idle_time_per_cycle"] ?? 0) / (input.number_of_operators * input.bottleneck_time))); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateSewing_line_balancer(input: Sewing_line_balancerInput): Sewing_line_balancerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overall_line_balance_score"] ?? 0;
  const breakdown = {
    theoretical_min_operators: values["theoretical_min_operators"] ?? 0,
    balance_efficiency: values["balance_efficiency"] ?? 0,
    idle_time_per_cycle: values["idle_time_per_cycle"] ?? 0,
    line_capacity: values["line_capacity"] ?? 0,
    demand_fulfillment_rate: values["demand_fulfillment_rate"] ?? 0,
    labor_productivity: values["labor_productivity"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Motion Waste","Quality Defects Rework","Machine Downtime"];
  const suggestedActions: string[] = ["Rebalance Operators","Reduce Bottleneck Time","Cross-Train Operators","Implement Andon System"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","What-if simulation","Multi-line comparison"],
  };
}


export interface Sewing_line_balancerOutput {
  totalWasteCost: number;
  breakdown: { theoretical_min_operators: number; balance_efficiency: number; idle_time_per_cycle: number; line_capacity: number; demand_fulfillment_rate: number; labor_productivity: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
