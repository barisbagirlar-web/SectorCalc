// @ts-nocheck
// Auto-generated from flexible-manufacturing-roi-calculator-schema.json
import * as z from 'zod';

export interface Flexible_manufacturing_roi_calculatorInput {
  annual_production_volume: number;
  avg_batch_size: number;
  current_setup_time: number;
  target_setup_time: number;
  hourly_operating_cost: number;
  changeover_cost_per_hour: number;
  inventory_holding_cost_rate: number;
  avg_inventory_value: number;
}

export const Flexible_manufacturing_roi_calculatorInputSchema = z.object({
  annual_production_volume: z.number().min(1000).max(10000000).default(100000),
  avg_batch_size: z.number().min(10).max(100000).default(500),
  current_setup_time: z.number().min(1).max(1440).default(120),
  target_setup_time: z.number().min(1).max(1440).default(15),
  hourly_operating_cost: z.number().min(10).max(500).default(85),
  changeover_cost_per_hour: z.number().min(20).max(1000).default(150),
  inventory_holding_cost_rate: z.number().min(5).max(50).default(25),
  avg_inventory_value: z.number().min(10000).max(100000000).default(2000000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Flexible_manufacturing_roi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annual_production_volume + input.avg_batch_size + input.current_setup_time; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.annual_production_volume + input.avg_batch_size + input.current_setup_time; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFlexible_manufacturing_roi_calculator(input: Flexible_manufacturing_roi_calculatorInput): Flexible_manufacturing_roi_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario comparison","Sensitivity analysis","Benchmarking against industry standards"],
  };
}


export interface Flexible_manufacturing_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
