// Auto-generated from demand-forecast-inventory-cost-schema.json
import * as z from 'zod';

export interface Demand_forecast_inventory_costInput {
  historical_demand_mean: number;
  demand_std_dev: number;
  lead_time_days: number;
  service_level: string;
  unit_cost: number;
  holding_cost_rate: number;
  ordering_cost: number;
  stockout_cost_per_unit: number;
  periods_per_year: number;
  use_abc_classification: boolean;
}

export const Demand_forecast_inventory_costInputSchema = z.object({
  historical_demand_mean: z.number().min(0).max(1000000).default(1000),
  demand_std_dev: z.number().min(0).max(500000).default(200),
  lead_time_days: z.number().min(1).max(365).default(14),
  service_level: z.enum(['0.9', '0.95', '0.975', '0.99']).default('0.95'),
  unit_cost: z.number().min(0.01).max(100000).default(50),
  holding_cost_rate: z.number().min(0).max(100).default(25),
  ordering_cost: z.number().min(0).max(10000).default(150),
  stockout_cost_per_unit: z.number().min(0).max(100000).default(200),
  periods_per_year: z.number().min(1).max(365).default(12),
  use_abc_classification: z.boolean().default(false),
});

function evaluateAllFormulas(input: Demand_forecast_inventory_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["safety_stock"] = Z * input.demand_std_dev * Math.sqrt(input.lead_time_days / input.periods_per_year); } catch { results["safety_stock"] = 0; }
  try { results["reorder_point"] = (input.historical_demand_mean * input.lead_time_days / input.periods_per_year) + (results["safety_stock"] ?? 0); } catch { results["reorder_point"] = 0; }
  try { results["economic_order_quantity"] = Math.sqrt((2 * input.historical_demand_mean * input.ordering_cost) / (input.unit_cost * input.holding_cost_rate / 100)); } catch { results["economic_order_quantity"] = 0; }
  try { results["total_annual_ordering_cost"] = (input.historical_demand_mean / (results["economic_order_quantity"] ?? 0)) * input.ordering_cost; } catch { results["total_annual_ordering_cost"] = 0; }
  try { results["total_annual_holding_cost"] = (((results["economic_order_quantity"] ?? 0) / 2) + (results["safety_stock"] ?? 0)) * input.unit_cost * (input.holding_cost_rate / 100); } catch { results["total_annual_holding_cost"] = 0; }
  try { results["expected_annual_stockout_cost"] = (1 - input.service_level) * input.historical_demand_mean * input.stockout_cost_per_unit; } catch { results["expected_annual_stockout_cost"] = 0; }
  try { results["total_annual_inventory_cost"] = (results["total_annual_ordering_cost"] ?? 0) + (results["total_annual_holding_cost"] ?? 0) + (results["expected_annual_stockout_cost"] ?? 0); } catch { results["total_annual_inventory_cost"] = 0; }
  return results;
}


export function calculateDemand_forecast_inventory_cost(input: Demand_forecast_inventory_costInput): Demand_forecast_inventory_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_inventory_cost"] ?? 0;
  const breakdown = {
    total_annual_ordering_cost: values["total_annual_ordering_cost"] ?? 0,
    total_annual_holding_cost: values["total_annual_holding_cost"] ?? 0,
    expected_annual_stockout_cost: values["expected_annual_stockout_cost"] ?? 0,
    safety_stock: values["safety_stock"] ?? 0,
    reorder_point: values["reorder_point"] ?? 0,
    economic_order_quantity: values["economic_order_quantity"] ?? 0,
    inventory_turnover: values["inventory_turnover"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Demand Variability Impact","Lead Time Uncertainty Impact","Order Batching Inefficiency"];
  const suggestedActions: string[] = ["Negotiate shorter lead times with suppliers or use local sourcing.","Implement demand sensing or collaborative forecasting (CPFR).","Consider lowering service level for non-critical items (ABC analysis).","Adjust order quantities to match EOQ or use quantity discounts.","Apply Kanban or JIT principles to reduce cycle stock."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated replenishment triggers"],
  };
}


export interface Demand_forecast_inventory_costOutput {
  totalWasteCost: number;
  breakdown: { total_annual_ordering_cost: number; total_annual_holding_cost: number; expected_annual_stockout_cost: number; safety_stock: number; reorder_point: number; economic_order_quantity: number; inventory_turnover: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
