// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Warehouse_layout_optimizer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.total_floor_area + input.storage_area_percent + input.aisle_width; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.total_floor_area + input.storage_area_percent + input.aisle_width; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWarehouse_layout_optimizer_calculator(input: Warehouse_layout_optimizer_calculatorInput): Warehouse_layout_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
