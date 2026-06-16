// Auto-generated from eoq-inventory-calculator-schema.json
import * as z from 'zod';

export interface Eoq_inventory_calculatorInput {
  annual_demand: number;
  ordering_cost: number;
  holding_cost_per_unit: number;
  unit_cost: number;
  lead_time_days: number;
  demand_variability: number;
  service_level: string;
  backorder_cost: number;
  warehouse_capacity: number;
  storage_cost_per_sqft: number;
  item_footprint: number;
}

export const Eoq_inventory_calculatorInputSchema = z.object({
  annual_demand: z.number().min(1).max(100000000).default(10000),
  ordering_cost: z.number().min(0.01).max(10000).default(50),
  holding_cost_per_unit: z.number().min(0.001).max(1000).default(2),
  unit_cost: z.number().min(0.01).max(100000).default(10),
  lead_time_days: z.number().min(0).max(365).default(7),
  demand_variability: z.number().min(0).max(100000).default(10),
  service_level: z.enum(['90', '95', '99', '99.9']).default('95'),
  backorder_cost: z.number().min(0).max(10000).default(5),
  warehouse_capacity: z.number().min(1).max(10000000).default(5000),
  storage_cost_per_sqft: z.number().min(0).max(500).default(15),
  item_footprint: z.number().min(0.001).max(100).default(0.5),
});

function evaluateAllFormulas(input: Eoq_inventory_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((2 * input.annual_demand * input.ordering_cost) / input.holding_cost_per_unit); results["eoq"] = Number.isFinite(v) ? v : 0; } catch { results["eoq"] = 0; }
  try { const v = Z(input.service_level) * input.demand_variability * Math.sqrt(input.lead_time_days); results["safety_stock"] = Number.isFinite(v) ? v : 0; } catch { results["safety_stock"] = 0; }
  try { const v = (input.annual_demand / 365) * input.lead_time_days + (results["safety_stock"] ?? 0); results["reorder_point"] = Number.isFinite(v) ? v : 0; } catch { results["reorder_point"] = 0; }
  try { const v = (input.annual_demand / (results["eoq"] ?? 0)) * input.ordering_cost; results["total_ordering_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_ordering_cost"] = 0; }
  try { const v = (((results["eoq"] ?? 0) / 2) + (results["safety_stock"] ?? 0)) * input.holding_cost_per_unit; results["total_holding_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_holding_cost"] = 0; }
  try { const v = (((results["eoq"] ?? 0) / 2) + (results["safety_stock"] ?? 0)) * input.item_footprint * input.storage_cost_per_sqft; results["space_cost"] = Number.isFinite(v) ? v : 0; } catch { results["space_cost"] = 0; }
  try { const v = (results["total_ordering_cost"] ?? 0) + (results["total_holding_cost"] ?? 0) + (results["space_cost"] ?? 0); results["total_annual_inventory_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_inventory_cost"] = 0; }
  return results;
}


export function calculateEoq_inventory_calculator(input: Eoq_inventory_calculatorInput): Eoq_inventory_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_inventory_cost"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    type: values["type"] ?? 0,
    properties: values["properties"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Ordering Cost","Demand Uncertainty Impact","Space Utilization Inefficiency"];
  const suggestedActions: string[] = ["Reduce Ordering Cost","Negotiate Storage or Insurance","Improve Demand Forecasting","Review Service Level Target","Optimize Warehouse Layout"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-warehouse comparison","ABC-XYZ classification integration","What-if scenario simulation","Real-time dashboard with KPI alerts"],
  };
}


export interface Eoq_inventory_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; type: number; properties: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
