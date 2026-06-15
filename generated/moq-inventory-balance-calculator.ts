// Auto-generated from moq-inventory-balance-calculator-schema.json
import * as z from 'zod';

export interface Moq_inventory_balance_calculatorInput {
  annual_demand: number;
  ordering_cost: number;
  holding_cost_per_unit: number;
  unit_cost: number;
  moq: number;
  lead_time_days: number;
  demand_std_dev: number;
  service_level: number;
  days_per_year: number;
  storage_capacity: number;
  backorder_cost_per_unit: number;
  supplier_reliability: number;
  inventory_policy: string;
  use_moq_override: boolean;
}

export const Moq_inventory_balance_calculatorInputSchema = z.object({
  annual_demand: z.number().min(1).max(10000000).default(10000),
  ordering_cost: z.number().min(0).max(10000).default(50),
  holding_cost_per_unit: z.number().min(0).max(1000).default(2.5),
  unit_cost: z.number().min(0.01).max(100000).default(15),
  moq: z.number().min(1).max(1000000).default(500),
  lead_time_days: z.number().min(1).max(365).default(30),
  demand_std_dev: z.number().min(0).max(10000).default(10),
  service_level: z.number().min(50).max(99.99).default(95),
  days_per_year: z.number().min(1).max(365).default(365),
  storage_capacity: z.number().min(1).max(10000000).default(2000),
  backorder_cost_per_unit: z.number().min(0).max(10000).default(5),
  supplier_reliability: z.number().min(0.5).max(1).default(0.95),
  inventory_policy: z.enum(['continuous_review', 'periodic_review']).default('continuous_review'),
  use_moq_override: z.boolean().default(true),
});

function evaluateAllFormulas(input: Moq_inventory_balance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["daily_demand"] = input.annual_demand / input.days_per_year; } catch { results["daily_demand"] = 0; }
  try { results["eoq"] = Math.sqrt((2 * input.annual_demand * input.ordering_cost) / input.holding_cost_per_unit); } catch { results["eoq"] = 0; }
  results["adjusted_order_quantity"] = 0;
  try { results["safety_stock"] = z_score(input.service_level/100) * input.demand_std_dev * Math.sqrt(input.lead_time_days / input.supplier_reliability); } catch { results["safety_stock"] = 0; }
  try { results["reorder_point"] = (results["daily_demand"] ?? 0) * input.lead_time_days + (results["safety_stock"] ?? 0); } catch { results["reorder_point"] = 0; }
  try { results["total_annual_cost"] = (input.annual_demand / (results["adjusted_order_quantity"] ?? 0)) * input.ordering_cost + ((results["adjusted_order_quantity"] ?? 0) / 2 + (results["safety_stock"] ?? 0)) * input.holding_cost_per_unit + (input.annual_demand * input.backorder_cost_per_unit * (1 - input.service_level/100)); } catch { results["total_annual_cost"] = 0; }
  try { results["moq_penalty_cost"] = IF((results["adjusted_order_quantity"] ?? 0) > (results["eoq"] ?? 0), ((results["adjusted_order_quantity"] ?? 0) - (results["eoq"] ?? 0)) * input.holding_cost_per_unit / 2, 0); } catch { results["moq_penalty_cost"] = 0; }
  try { results["inventory_turnover"] = input.annual_demand / (((results["adjusted_order_quantity"] ?? 0) / 2) + (results["safety_stock"] ?? 0)); } catch { results["inventory_turnover"] = 0; }
  try { results["total_inventory_value"] = (((results["adjusted_order_quantity"] ?? 0) / 2) + (results["safety_stock"] ?? 0)) * input.unit_cost; } catch { results["total_inventory_value"] = 0; }
  return results;
}


export function calculateMoq_inventory_balance_calculator(input: Moq_inventory_balance_calculatorInput): Moq_inventory_balance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["optimal_order_quantity"] ?? 0;
  const breakdown = {
    eoq: values["eoq"] ?? 0,
    safety_stock: values["safety_stock"] ?? 0,
    reorder_point: values["reorder_point"] ?? 0,
    total_annual_cost: values["total_annual_cost"] ?? 0,
    inventory_turnover: values["inventory_turnover"] ?? 0,
    total_inventory_value: values["total_inventory_value"] ?? 0,
    moq_penalty_cost: values["moq_penalty_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Holding Cost from MOQ","Demand Uncertainty Cost","Supplier Unreliability Impact","Backorder Risk Cost"];
  const suggestedActions: string[] = ["Negotiate with supplier to reduce MOQ to at least {eoq} units to save ${moq_penalty_cost} annually.","Work with supplier to improve on-time delivery above 90% to reduce safety stock by {safety_stock * (1 - supplier_reliability)} units.","Consider increasing service level to 95% to reduce backorder costs. Additional safety stock cost is ${safety_stock_increase_cost}.","Order frequency is high. Consider consolidating orders to reduce ordering costs. Target order interval: {30} days.","Storage capacity utilization exceeds 80%. Expand storage or reduce order quantity to avoid congestion."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-warehouse simulation","Supplier lead time variability analysis"],
  };
}


export interface Moq_inventory_balance_calculatorOutput {
  totalWasteCost: number;
  breakdown: { eoq: number; safety_stock: number; reorder_point: number; total_annual_cost: number; inventory_turnover: number; total_inventory_value: number; moq_penalty_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
