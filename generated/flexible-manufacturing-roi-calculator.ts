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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Flexible_manufacturing_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_production_volume * input.avg_batch_size * input.current_setup_time * input.target_setup_time; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.annual_production_volume * input.avg_batch_size * input.current_setup_time * input.target_setup_time * (input.hourly_operating_cost * input.changeover_cost_per_hour * (input.inventory_holding_cost_rate / 100) * input.avg_inventory_value); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.hourly_operating_cost * input.changeover_cost_per_hour * (input.inventory_holding_cost_rate / 100) * input.avg_inventory_value; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFlexible_manufacturing_roi_calculator(input: Flexible_manufacturing_roi_calculatorInput): Flexible_manufacturing_roi_calculatorOutput {
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
