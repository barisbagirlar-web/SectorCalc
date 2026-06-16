// Auto-generated from contract-incentive-calculator-schema.json
import * as z from 'zod';

export interface Contract_incentive_calculatorInput {
  actual_throughput: number;
  target_throughput: number;
  defect_rate: number;
  on_time_delivery_percent: number;
  cost_per_unit: number;
  target_cost_per_unit: number;
  incentive_base_rate: number;
  quality_threshold_ppm: number;
  delivery_threshold_percent: number;
  cost_reduction_sharing_percent: number;
  contract_type: string;
  lean_certification_active: boolean;
}

export const Contract_incentive_calculatorInputSchema = z.object({
  actual_throughput: z.number().min(0).max(100000).default(1000),
  target_throughput: z.number().min(1).max(100000).default(1200),
  defect_rate: z.number().min(0).max(1000000).default(5000),
  on_time_delivery_percent: z.number().min(0).max(100).default(95),
  cost_per_unit: z.number().min(0).max(10000).default(50),
  target_cost_per_unit: z.number().min(0).max(10000).default(45),
  incentive_base_rate: z.number().min(0).max(100).default(2.5),
  quality_threshold_ppm: z.number().min(0).max(1000000).default(10000),
  delivery_threshold_percent: z.number().min(0).max(100).default(90),
  cost_reduction_sharing_percent: z.number().min(0).max(100).default(50),
  contract_type: z.enum(['fixed_price', 'cost_plus', 'time_and_materials']).default('fixed_price'),
  lean_certification_active: z.boolean().default(false),
});

function evaluateAllFormulas(input: Contract_incentive_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.actual_throughput / input.target_throughput; results["throughput_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["throughput_ratio"] = 0; }
  try { const v = Math.max(0, 1 - (input.defect_rate / input.quality_threshold_ppm)); results["quality_multiplier"] = Number.isFinite(v) ? v : 0; } catch { results["quality_multiplier"] = 0; }
  try { const v = Math.max(0, (input.on_time_delivery_percent - input.delivery_threshold_percent) / (100 - input.delivery_threshold_percent)); results["delivery_multiplier"] = Number.isFinite(v) ? v : 0; } catch { results["delivery_multiplier"] = 0; }
  try { const v = Math.max(0, input.target_cost_per_unit - input.cost_per_unit); results["cost_savings_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["cost_savings_per_unit"] = 0; }
  try { const v = (results["cost_savings_per_unit"] ?? 0) * input.actual_throughput * (input.cost_reduction_sharing_percent / 100); results["cost_savings_incentive"] = Number.isFinite(v) ? v : 0; } catch { results["cost_savings_incentive"] = 0; }
  try { const v = input.actual_throughput * input.incentive_base_rate; results["base_incentive"] = Number.isFinite(v) ? v : 0; } catch { results["base_incentive"] = 0; }
  try { const v = (results["base_incentive"] ?? 0) * (results["quality_multiplier"] ?? 0) * (results["delivery_multiplier"] ?? 0); results["performance_adjusted_incentive"] = Number.isFinite(v) ? v : 0; } catch { results["performance_adjusted_incentive"] = 0; }
  try { const v = (results["performance_adjusted_incentive"] ?? 0) + (results["cost_savings_incentive"] ?? 0); results["total_incentive"] = Number.isFinite(v) ? v : 0; } catch { results["total_incentive"] = 0; }
  return results;
}


export function calculateContract_incentive_calculator(input: Contract_incentive_calculatorInput): Contract_incentive_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_incentive"] ?? 0;
  const breakdown = {
    base_incentive: values["base_incentive"] ?? 0,
    quality_multiplier: values["quality_multiplier"] ?? 0,
    delivery_multiplier: values["delivery_multiplier"] ?? 0,
    performance_adjusted_incentive: values["performance_adjusted_incentive"] ?? 0,
    cost_savings_incentive: values["cost_savings_incentive"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Defect Cost","Late Delivery Penalty","Throughput Gap Loss"];
  const suggestedActions: string[] = ["Implement Six Sigma DMAIC project to reduce defect rate below threshold.","Adopt Lean pull system and Kanban to improve on-time delivery.","Conduct value stream mapping to identify and eliminate waste, reducing cost per unit.","Review capacity constraints and consider OEE improvement to close throughput gap."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Real-time dashboard integration"],
  };
}


export interface Contract_incentive_calculatorOutput {
  totalWasteCost: number;
  breakdown: { base_incentive: number; quality_multiplier: number; delivery_multiplier: number; performance_adjusted_incentive: number; cost_savings_incentive: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
