// Auto-generated from warehouse-layout-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Warehouse_layout_optimizer_calculatorInput {
  total_floor_area: number;
  storage_area_percent: number;
  aisle_width: number;
  pallet_flow_type: string;
  avg_pallet_size: number;
  avg_inventory_turns: number;
  labor_cost_per_hour: number;
  equipment_cost_per_hour: number;
  order_lines_per_day: number;
  storage_utilization: number;
  layout_type: string;
  include_cross_dock: boolean;
}

export const Warehouse_layout_optimizer_calculatorInputSchema = z.object({
  total_floor_area: z.number().min(5000).max(2000000).default(100000),
  storage_area_percent: z.number().min(20).max(90).default(60),
  aisle_width: z.number().min(6).max(20).default(12),
  pallet_flow_type: z.enum(['single_deep', 'double_deep', 'drive_in', 'push_back']).default('single_deep'),
  avg_pallet_size: z.number().min(10).max(20).default(13.75),
  avg_inventory_turns: z.number().min(1).max(52).default(6),
  labor_cost_per_hour: z.number().min(10).max(60).default(25),
  equipment_cost_per_hour: z.number().min(5).max(50).default(15),
  order_lines_per_day: z.number().min(100).max(50000).default(2000),
  storage_utilization: z.number().min(50).max(100).default(85),
  layout_type: z.enum(['conventional', 'narrow_aisle', 'very_narrow_aisle', 'automated']).default('conventional'),
  include_cross_dock: z.boolean().default(false),
});

function evaluateAllFormulas(input: Warehouse_layout_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_floor_area * (input.storage_area_percent / 100); results["storage_area"] = Number.isFinite(v) ? v : 0; } catch { results["storage_area"] = 0; }
  try { const v = (results["storage_area"] ?? 0) / (input.avg_pallet_size * (1 + (input.aisle_width / 10) * 0.15)); results["pallet_positions"] = Number.isFinite(v) ? v : 0; } catch { results["pallet_positions"] = 0; }
  try { const v = (results["pallet_positions"] ?? 0) * (input.storage_utilization / 100); results["effective_capacity"] = Number.isFinite(v) ? v : 0; } catch { results["effective_capacity"] = 0; }
  try { const v = input.order_lines_per_day * 0.6; results["daily_throughput"] = Number.isFinite(v) ? v : 0; } catch { results["daily_throughput"] = 0; }
  try { const v = (input.layout_type === 'conventional' ? 1.0 : (input.layout_type === 'narrow_aisle' ? 0.85 : (input.layout_type === 'very_narrow_aisle' ? 0.7 : (input.layout_type === 'automated' ? 0.5 : 1.0)))); results["travel_distance_factor"] = Number.isFinite(v) ? v : 0; } catch { results["travel_distance_factor"] = 0; }
  try { const v = (input.labor_cost_per_hour + input.equipment_cost_per_hour) * ((results["travel_distance_factor"] ?? 0) * 0.02); results["labor_cost_per_pallet"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost_per_pallet"] = 0; }
  try { const v = (results["daily_throughput"] ?? 0) * (results["labor_cost_per_pallet"] ?? 0) * 365; results["annual_operating_cost"] = Number.isFinite(v) ? v : 0; } catch { results["annual_operating_cost"] = 0; }
  return results;
}


export function calculateWarehouse_layout_optimizer_calculator(input: Warehouse_layout_optimizer_calculatorInput): Warehouse_layout_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_cost"] ?? 0;
  const breakdown = {
    storage_area: values["storage_area"] ?? 0,
    pallet_positions: values["pallet_positions"] ?? 0,
    effective_capacity: values["effective_capacity"] ?? 0,
    daily_throughput: values["daily_throughput"] ?? 0,
    travel_distance_factor: values["travel_distance_factor"] ?? 0,
    labor_cost_per_pallet: values["labor_cost_per_pallet"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Aisle Space","Low Storage Utilization","Inefficient Pallet Flow Type","Labor/Equipment Cost Imbalance"];
  const suggestedActions: string[] = ["Reduce Aisle Width","Increase Storage Utilization","Adopt Automation for High Throughput","Optimize Cross-Dock Flow"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Heatmap visualization"],
  };
}


export interface Warehouse_layout_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { storage_area: number; pallet_positions: number; effective_capacity: number; daily_throughput: number; travel_distance_factor: number; labor_cost_per_pallet: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
