// Auto-generated from discount-calculator-schema.json
import * as z from 'zod';

export interface Discount_calculatorInput {
  list_price: number;
  discount_percent: number;
  quantity: number;
  variable_cost_per_unit: number;
  fixed_cost_allocation: number;
  discount_type: string;
  apply_to_all_units: boolean;
  dataConfidence?: number;
}

export const Discount_calculatorInputSchema = z.object({
  list_price: z.number().min(0.01).max(100000).default(100),
  discount_percent: z.number().min(0).max(100).default(10),
  quantity: z.number().min(1).max(1000000).default(100),
  variable_cost_per_unit: z.number().min(0).max(100000).default(40),
  fixed_cost_allocation: z.number().min(0).max(10000000).default(5000),
  discount_type: z.enum(['percentage', 'fixed_amount']).default('percentage'),
  apply_to_all_units: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Discount_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * (input.list_price * (1 - input.discount_percent / 100) - input.variable_cost_per_unit) - input.fixed_cost_allocation; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.quantity * input.list_price * (input.discount_percent / 100); results["discount_amount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discount_amount"] = Number.NaN; }
  try { const v = ((input.list_price * (1 - input.discount_percent / 100) - input.variable_cost_per_unit) / (input.list_price * (1 - input.discount_percent / 100))) * 100; results["margin_percent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["margin_percent"] = Number.NaN; }
  return results;
}


export function calculateDiscount_calculator(input: Discount_calculatorInput): Discount_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Excessive discounting eroding margin","Fixed cost allocation not covered by volume"];
  const suggestedActions: string[] = ["Review discount tiers to maintain target margin","Increase order quantity to dilute fixed cost allocation"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","API integration"],
  };
}


export interface Discount_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
