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
  tool_type: string;
  coolant_used: boolean;
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
  tool_type: z.enum(['carbide', 'ceramic', 'cbn', 'diamond', 'hss']).default('carbide'),
  coolant_used: z.boolean().default(true),
});

function evaluateAllFormulas(input: Tool_wear_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["tool_cost_per_part"] = input.tool_cost / input.tool_life_parts; } catch { results["tool_cost_per_part"] = 0; }
  try { results["downtime_cost_per_part"] = (input.replacement_time_min / 60) * input.machine_hourly_rate / input.tool_life_parts; } catch { results["downtime_cost_per_part"] = 0; }
  try { results["rework_cost_per_part_wear"] = (input.rework_rate / 100) * input.rework_cost_per_part; } catch { results["rework_cost_per_part_wear"] = 0; }
  try { results["scrap_cost_per_part_wear"] = (input.scrap_rate / 100) * input.scrap_material_cost; } catch { results["scrap_cost_per_part_wear"] = 0; }
  results["tool_type_multiplier"] = 0;
  results["coolant_adjustment"] = 0;
  try { results["primaryResult"] = ((results["tool_cost_per_part"] ?? 0) + (results["downtime_cost_per_part"] ?? 0) + (results["rework_cost_per_part_wear"] ?? 0) + (results["scrap_cost_per_part_wear"] ?? 0)) * (results["tool_type_multiplier"] ?? 0) * (results["coolant_adjustment"] ?? 0); } catch { results["primaryResult"] = 0; }
  return results;
}


export function calculateTool_wear_cost_calculator(input: Tool_wear_cost_calculatorInput): Tool_wear_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_tool_wear_cost_per_part"] ?? 0;
  const breakdown = {
    tool_cost_per_part: values["tool_cost_per_part"] ?? 0,
    downtime_cost_per_part: values["downtime_cost_per_part"] ?? 0,
    rework_cost_per_part_wear: values["rework_cost_per_part_wear"] ?? 0,
    scrap_cost_per_part_wear: values["scrap_cost_per_part_wear"] ?? 0,
    tool_type_multiplier: values["tool_type_multiplier"] ?? 0,
    coolant_adjustment: values["coolant_adjustment"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Replacement Time","High Rework Rate","Low Tool Life"];
  const suggestedActions: string[] = ["Optimize Cutting Parameters","Implement Predictive Maintenance","Standardize Tool Replacement Procedure","Evaluate Coolant System"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-machine comparison","Custom threshold alerts"],
  };
}


export interface Tool_wear_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { tool_cost_per_part: number; downtime_cost_per_part: number; rework_cost_per_part_wear: number; scrap_cost_per_part_wear: number; tool_type_multiplier: number; coolant_adjustment: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
