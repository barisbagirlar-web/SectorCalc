// Auto-generated from tool-wear-cost-calculator-schema.json
import * as z from 'zod';

export interface Tool_wear_cost_calculatorInput {
  tool_cost: number;
  tool_life_parts: number;
  replacement_time_min: number;
  machine_hourly_rate: number;
  rework_rate: number;
  rework_cost_per_part: number;
  scrap_rate: number;
  scrap_material_cost: number;
  dataConfidence?: number;
}

export const Tool_wear_cost_calculatorInputSchema = z.object({
  tool_cost: z.number().min(0).max(10000).default(150),
  tool_life_parts: z.number().min(1).max(100000).default(500),
  replacement_time_min: z.number().min(0).max(120).default(10),
  machine_hourly_rate: z.number().min(0).max(500).default(85),
  rework_rate: z.number().min(0).max(100).default(2),
  rework_cost_per_part: z.number().min(0).max(500).default(5),
  scrap_rate: z.number().min(0).max(100).default(0.5),
  scrap_material_cost: z.number().min(0).max(1000).default(12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tool_wear_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tool_life_parts * input.tool_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.tool_life_parts * input.tool_cost * (1 + (input.machine_hourly_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.tool_life_parts * input.tool_cost * (1 + (input.machine_hourly_rate / 100)) * (input.replacement_time_min); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.replacement_time_min; results["factor_replacement_time_min"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_replacement_time_min"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTool_wear_cost_calculator(input: Tool_wear_cost_calculatorInput): Tool_wear_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-machine comparison","Custom threshold alerts"],
  };
}


export interface Tool_wear_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
