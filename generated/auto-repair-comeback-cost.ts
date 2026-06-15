// Auto-generated from auto-repair-comeback-cost-schema.json
import * as z from 'zod';

export interface Auto_repair_comeback_costInput {
  total_repair_orders: number;
  comeback_count: number;
  avg_labor_rate: number;
  avg_hours_per_comeback: number;
  parts_cost_per_comeback: number;
  customer_lifetime_value: number;
  lost_customer_rate: number;
  shop_type: string;
  include_hidden_costs: boolean;
}

export const Auto_repair_comeback_costInputSchema = z.object({
  total_repair_orders: z.number().min(1).max(100000).default(500),
  comeback_count: z.number().min(0).max(100000).default(25),
  avg_labor_rate: z.number().min(15).max(250).default(85),
  avg_hours_per_comeback: z.number().min(0.1).max(40).default(2.5),
  parts_cost_per_comeback: z.number().min(0).max(5000).default(45),
  customer_lifetime_value: z.number().min(100).max(50000).default(2500),
  lost_customer_rate: z.number().min(0).max(100).default(15),
  shop_type: z.enum(['independent', 'dealer', 'fleet', 'franchise']).default('independent'),
  include_hidden_costs: z.boolean().default(true),
});

function evaluateAllFormulas(input: Auto_repair_comeback_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["comeback_rate"] = input.comeback_count / input.total_repair_orders * 100; } catch { results["comeback_rate"] = 0; }
  try { results["direct_labor_cost"] = input.comeback_count * input.avg_hours_per_comeback * input.avg_labor_rate; } catch { results["direct_labor_cost"] = 0; }
  try { results["direct_parts_cost"] = input.comeback_count * input.parts_cost_per_comeback; } catch { results["direct_parts_cost"] = 0; }
  try { results["hidden_overhead_cost"] = input.include_hidden_costs ? ((results["direct_labor_cost"] ?? 0) + (results["direct_parts_cost"] ?? 0)) * 0.20 : 0; } catch { results["hidden_overhead_cost"] = 0; }
  try { results["lost_future_revenue"] = input.comeback_count * (input.lost_customer_rate / 100) * input.customer_lifetime_value; } catch { results["lost_future_revenue"] = 0; }
  results["shop_type_multiplier"] = 0;
  try { results["total_comeback_cost"] = ((results["direct_labor_cost"] ?? 0) + (results["direct_parts_cost"] ?? 0) + (results["hidden_overhead_cost"] ?? 0) + (results["lost_future_revenue"] ?? 0)) * (results["shop_type_multiplier"] ?? 0); } catch { results["total_comeback_cost"] = 0; }
  return results;
}


export function calculateAuto_repair_comeback_cost(input: Auto_repair_comeback_costInput): Auto_repair_comeback_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_comeback_cost"] ?? 0;
  const breakdown = {
    direct_labor_cost: values["direct_labor_cost"] ?? 0,
    direct_parts_cost: values["direct_parts_cost"] ?? 0,
    hidden_overhead_cost: values["hidden_overhead_cost"] ?? 0,
    lost_future_revenue: values["lost_future_revenue"] ?? 0,
    shop_type_multiplier: values["shop_type_multiplier"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Comeback Rate","Lost Customer Rate","Average Hours per Comeback"];
  const suggestedActions: string[] = ["Implement 5-Why Root Cause Analysis","Standardize Repair Procedures","Customer Follow-Up Program","Technician Certification on Complex Repairs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry averages","Root cause Pareto chart","Multi-shift comparison"],
  };
}


export interface Auto_repair_comeback_costOutput {
  totalWasteCost: number;
  breakdown: { direct_labor_cost: number; direct_parts_cost: number; hidden_overhead_cost: number; lost_future_revenue: number; shop_type_multiplier: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
