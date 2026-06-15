// Auto-generated from break-even-calculator-schema.json
import * as z from 'zod';

export interface Break_even_calculatorInput {
  fixed_costs: number;
  variable_cost_per_unit: number;
  selling_price_per_unit: number;
  defect_rate: number;
  rework_cost_per_unit: number;
  production_volume: number;
  cost_allocation_method: string;
}

export const Break_even_calculatorInputSchema = z.object({
  fixed_costs: z.number().min(0).max(100000000).default(50000),
  variable_cost_per_unit: z.number().min(0).max(100000).default(15),
  selling_price_per_unit: z.number().min(0).max(100000).default(25),
  defect_rate: z.number().min(0).max(1000000).default(5000),
  rework_cost_per_unit: z.number().min(0).max(100000).default(8),
  production_volume: z.number().min(0).max(10000000).default(10000),
  cost_allocation_method: z.enum(['traditional', 'activity-based']).default('traditional'),
});

function evaluateAllFormulas(input: Break_even_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["contribution_margin_per_unit"] = input.selling_price_per_unit - input.variable_cost_per_unit; } catch { results["contribution_margin_per_unit"] = 0; }
  try { results["contribution_margin_ratio"] = (input.selling_price_per_unit - input.variable_cost_per_unit) / input.selling_price_per_unit; } catch { results["contribution_margin_ratio"] = 0; }
  try { results["break_even_units"] = input.fixed_costs / (input.selling_price_per_unit - input.variable_cost_per_unit); } catch { results["break_even_units"] = 0; }
  try { results["break_even_revenue"] = (results["break_even_units"] ?? 0) * input.selling_price_per_unit; } catch { results["break_even_revenue"] = 0; }
  try { results["quality_loss_per_unit"] = (input.defect_rate / 1000000) * input.rework_cost_per_unit; } catch { results["quality_loss_per_unit"] = 0; }
  try { results["adjusted_break_even_units"] = input.fixed_costs / (input.selling_price_per_unit - input.variable_cost_per_unit - (results["quality_loss_per_unit"] ?? 0)); } catch { results["adjusted_break_even_units"] = 0; }
  try { results["margin_of_safety"] = (input.production_volume - (results["break_even_units"] ?? 0)) / input.production_volume; } catch { results["margin_of_safety"] = 0; }
  return results;
}


export function calculateBreak_even_calculator(input: Break_even_calculatorInput): Break_even_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["break_even_units"] ?? 0;
  const breakdown = {
    contribution_margin_per_unit: values["contribution_margin_per_unit"] ?? 0,
    contribution_margin_ratio: values["contribution_margin_ratio"] ?? 0,
    break_even_revenue: values["break_even_revenue"] ?? 0,
    quality_loss_per_unit: values["quality_loss_per_unit"] ?? 0,
    adjusted_break_even_units: values["adjusted_break_even_units"] ?? 0,
    margin_of_safety: values["margin_of_safety"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Defect Rate Impact on Break-Even","Rework Cost Impact","Fixed Cost Leverage"];
  const suggestedActions: string[] = ["Implement Six Sigma DMAIC to reduce defect rate below 5000 ppm.","Conduct value stream mapping to identify and eliminate non-value-added activities.","Perform market analysis to justify price increase based on quality improvements.","Review overhead allocation using activity-based costing (ABC)."];
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario simulation","Multi-product break-even"],
  };
}


export interface Break_even_calculatorOutput {
  totalWasteCost: number;
  breakdown: { contribution_margin_per_unit: number; contribution_margin_ratio: number; break_even_revenue: number; quality_loss_per_unit: number; adjusted_break_even_units: number; margin_of_safety: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
