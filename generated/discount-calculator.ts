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

function evaluateAllFormulas(input: Discount_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["discount_amount_per_unit"] = IF(input.discount_type='percentage', input.list_price * input.discount_percent/100, IF(input.discount_type='fixed_amount', input.discount_percent, 0)); } catch { results["discount_amount_per_unit"] = 0; }
  try { results["discounted_price_per_unit"] = input.list_price - (results["discount_amount_per_unit"] ?? 0); } catch { results["discounted_price_per_unit"] = 0; }
  try { results["total_revenue"] = (results["discounted_price_per_unit"] ?? 0) * input.quantity; } catch { results["total_revenue"] = 0; }
  try { results["total_variable_cost"] = input.variable_cost_per_unit * input.quantity; } catch { results["total_variable_cost"] = 0; }
  try { results["total_cost"] = (results["total_variable_cost"] ?? 0) + input.fixed_cost_allocation; } catch { results["total_cost"] = 0; }
  try { results["net_margin"] = (results["total_revenue"] ?? 0) - (results["total_cost"] ?? 0); } catch { results["net_margin"] = 0; }
  try { results["net_margin_percent"] = IF((results["total_revenue"] ?? 0) > 0, ((results["net_margin"] ?? 0) / (results["total_revenue"] ?? 0)) * 100, 0); } catch { results["net_margin_percent"] = 0; }
  return results;
}


export function calculateDiscount_calculator(input: Discount_calculatorInput): Discount_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["net_margin"] ?? 0;
  const breakdown = {
    discount_amount_per_unit: values["discount_amount_per_unit"] ?? 0,
    discounted_price_per_unit: values["discounted_price_per_unit"] ?? 0,
    total_revenue: values["total_revenue"] ?? 0,
    total_variable_cost: values["total_variable_cost"] ?? 0,
    total_cost: values["total_cost"] ?? 0,
    net_margin_percent: values["net_margin_percent"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Discounts exceeding the break-even threshold erode profit. Compare discount_amount_per_unit to (list_price - variable_cost_per_unit).","If fixed cost allocation is not fully absorbed by the discounted revenue, hidden loss occurs.","High discount may require disproportionate volume increase to maintain same net margin (Lean throughput accounting)."];
  const suggestedActions: string[] = ["If net_margin_percent < 10, consider reducing discount or negotiating lower variable costs with suppliers (Lean sourcing).","If fixed_cost_allocation > 0.3 * total_revenue, review fixed cost drivers using activity-based costing (ABC).","If discount_percent > 20, evaluate if the discount is tied to a strategic volume increase or market share gain (Six Sigma project charter).","If net_margin < 0, immediately halt discount and perform root cause analysis (DMAIC)."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","API integration"],
  };
}


export interface Discount_calculatorOutput {
  totalWasteCost: number;
  breakdown: { discount_amount_per_unit: number; discounted_price_per_unit: number; total_revenue: number; total_variable_cost: number; total_cost: number; net_margin_percent: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
