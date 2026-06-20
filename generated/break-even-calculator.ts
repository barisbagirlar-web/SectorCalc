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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Break_even_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fixed_costs / ((input.selling_price_per_unit - input.variable_cost_per_unit) * (1 - input.defect_rate / 1000000) - (input.defect_rate / 1000000) * input.rework_cost_per_unit); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.selling_price_per_unit * (1 - input.defect_rate / 1000000) - (input.defect_rate / 1000000) * input.rework_cost_per_unit; results["effective_selling_price"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effective_selling_price"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effective_selling_price"])) - input.variable_cost_per_unit; results["contribution_margin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contribution_margin"] = Number.NaN; }
  return results;
}


export function calculateBreak_even_calculator(input: Break_even_calculatorInput): Break_even_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["defect_rate","rework_cost_per_unit"];
  const suggestedActions: string[] = ["Reduce defect rate via Six Sigma DMAIC","Negotiate lower rework costs with suppliers"];
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario simulation","Multi-product break-even"],
  };
}


export interface Break_even_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
