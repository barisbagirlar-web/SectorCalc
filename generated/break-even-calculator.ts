// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Break_even_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.fixed_costs + input.variable_cost_per_unit + input.selling_price_per_unit; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.fixed_costs + input.variable_cost_per_unit + input.selling_price_per_unit; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBreak_even_calculator(input: Break_even_calculatorInput): Break_even_calculatorOutput {
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
