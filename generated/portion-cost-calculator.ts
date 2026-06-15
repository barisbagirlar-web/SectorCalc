// Auto-generated from portion-cost-calculator-schema.json
import * as z from 'zod';

export interface Portion_cost_calculatorInput {
  raw_material_cost_per_unit: number;
  portion_weight: number;
  yield_percentage: number;
  labor_cost_per_hour: number;
  labor_hours_per_batch: number;
  batch_size: number;
  overhead_rate: number;
  waste_disposal_cost_per_kg: number;
  trim_loss_percentage: number;
  currency: string;
}

export const Portion_cost_calculatorInputSchema = z.object({
  raw_material_cost_per_unit: z.number().min(0.01).max(1000).default(5),
  portion_weight: z.number().min(1).max(5000).default(250),
  yield_percentage: z.number().min(0).max(100).default(85),
  labor_cost_per_hour: z.number().min(7.25).max(150).default(18),
  labor_hours_per_batch: z.number().min(0.01).max(24).default(0.5),
  batch_size: z.number().min(1).max(100000).default(100),
  overhead_rate: z.number().min(0).max(200).default(25),
  waste_disposal_cost_per_kg: z.number().min(0).max(10).default(0.15),
  trim_loss_percentage: z.number().min(0).max(50).default(10),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD']).default('USD'),
});

function evaluateAllFormulas(input: Portion_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["effective_raw_material_cost"] = input.raw_material_cost_per_unit / (1 - input.trim_loss_percentage / 100) + input.waste_disposal_cost_per_kg * (input.trim_loss_percentage / 100); } catch { results["effective_raw_material_cost"] = 0; }
  try { results["material_cost_per_portion"] = (results["effective_raw_material_cost"] ?? 0) * (input.portion_weight / 1000) / (input.yield_percentage / 100); } catch { results["material_cost_per_portion"] = 0; }
  try { results["labor_cost_per_portion"] = input.labor_cost_per_hour * input.labor_hours_per_batch / input.batch_size; } catch { results["labor_cost_per_portion"] = 0; }
  try { results["direct_cost_per_portion"] = (results["material_cost_per_portion"] ?? 0) + (results["labor_cost_per_portion"] ?? 0); } catch { results["direct_cost_per_portion"] = 0; }
  try { results["overhead_cost_per_portion"] = (results["direct_cost_per_portion"] ?? 0) * (input.overhead_rate / 100); } catch { results["overhead_cost_per_portion"] = 0; }
  try { results["total_cost_per_portion"] = (results["direct_cost_per_portion"] ?? 0) + (results["overhead_cost_per_portion"] ?? 0); } catch { results["total_cost_per_portion"] = 0; }
  return results;
}


export function calculatePortion_cost_calculator(input: Portion_cost_calculatorInput): Portion_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost_per_portion"] ?? 0;
  const breakdown = {
    material_cost_per_portion: values["material_cost_per_portion"] ?? 0,
    labor_cost_per_portion: values["labor_cost_per_portion"] ?? 0,
    overhead_cost_per_portion: values["overhead_cost_per_portion"] ?? 0,
    effective_raw_material_cost: values["effective_raw_material_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Trim Loss Cost","Yield Loss Cost","Waste Disposal Hidden Cost"];
  const suggestedActions: string[] = ["Implement Lean Six Sigma DMAIC project to improve yield by reducing process variation.","Review trimming specifications and consider alternative cutting patterns or supplier pre-trimming.","Conduct time-motion study to identify non-value-added activities; consider automation.","Negotiate volume discounts or explore alternative suppliers to lower material cost."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Real-time yield tracking"],
  };
}


export interface Portion_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { material_cost_per_portion: number; labor_cost_per_portion: number; overhead_cost_per_portion: number; effective_raw_material_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
