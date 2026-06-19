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
  dataConfidence?: number;
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
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Warehouse_layout_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_floor_area * (input.storage_area_percent / 100) * input.aisle_width * input.avg_pallet_size; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.total_floor_area * (input.storage_area_percent / 100) * input.aisle_width * input.avg_pallet_size * (input.avg_inventory_turns * input.labor_cost_per_hour * input.equipment_cost_per_hour); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.avg_inventory_turns * input.labor_cost_per_hour * input.equipment_cost_per_hour; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWarehouse_layout_optimizer_calculator(input: Warehouse_layout_optimizer_calculatorInput): Warehouse_layout_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
