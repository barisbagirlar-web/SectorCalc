// Auto-generated from price-elasticity-simulator-schema.json
import * as z from 'zod';

export interface Price_elasticity_simulatorInput {
  current_price: number;
  current_quantity: number;
  price_change_percent: number;
  elasticity_coefficient: number;
  variable_cost_per_unit: number;
  fixed_cost_monthly: number;
  demand_shift_factor: number;
  confidence_level: string;
  apply_six_sigma_adjustment: boolean;
}

export const Price_elasticity_simulatorInputSchema = z.object({
  current_price: z.number().min(0.01).max(100000).default(100),
  current_quantity: z.number().min(1).max(100000000).default(1000),
  price_change_percent: z.number().min(-100).max(1000).default(-10),
  elasticity_coefficient: z.number().min(-10).max(0).default(-1.5),
  variable_cost_per_unit: z.number().min(0).max(100000).default(60),
  fixed_cost_monthly: z.number().min(0).max(10000000).default(20000),
  demand_shift_factor: z.number().min(0.1).max(10).default(1),
  confidence_level: z.enum(['low', 'medium', 'high']).default('medium'),
  apply_six_sigma_adjustment: z.boolean().default(false),
});

function evaluateAllFormulas(input: Price_elasticity_simulatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["new_price"] = input.current_price * (1 + input.price_change_percent / 100); } catch { results["new_price"] = 0; }
  try { results["quantity_change_percent"] = input.elasticity_coefficient * (input.price_change_percent / 100); } catch { results["quantity_change_percent"] = 0; }
  try { results["new_quantity"] = input.current_quantity * (1 + (results["quantity_change_percent"] ?? 0) / 100) * input.demand_shift_factor * (input.apply_six_sigma_adjustment ? 0.99865 : 1.0); } catch { results["new_quantity"] = 0; }
  try { results["revenue_current"] = input.current_price * input.current_quantity; } catch { results["revenue_current"] = 0; }
  try { results["revenue_new"] = (results["new_price"] ?? 0) * (results["new_quantity"] ?? 0); } catch { results["revenue_new"] = 0; }
  try { results["profit_current"] = (input.current_price - input.variable_cost_per_unit) * input.current_quantity - input.fixed_cost_monthly; } catch { results["profit_current"] = 0; }
  try { results["profit_new"] = ((results["new_price"] ?? 0) - input.variable_cost_per_unit) * (results["new_quantity"] ?? 0) - input.fixed_cost_monthly; } catch { results["profit_new"] = 0; }
  try { results["primary_result"] = (((results["revenue_new"] ?? 0) - (results["revenue_current"] ?? 0)) / (results["revenue_current"] ?? 0)) * 100; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculatePrice_elasticity_simulator(input: Price_elasticity_simulatorInput): Price_elasticity_simulatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["revenue_change_percent"] ?? 0;
  const breakdown = {
    new_price: values["new_price"] ?? 0,
    new_quantity: values["new_quantity"] ?? 0,
    revenue_current: values["revenue_current"] ?? 0,
    revenue_new: values["revenue_new"] ?? 0,
    profit_current: values["profit_current"] ?? 0,
    profit_new: values["profit_new"] ?? 0,
    profit_margin_percent: values["profit_margin_percent"] ?? 0,
    contribution_margin_per_unit: values["contribution_margin_per_unit"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Elasticity Misestimation","Fixed Cost Leverage","Competitive Response","Inventory Holding Cost"];
  const suggestedActions: string[] = ["Validate Elasticity with A/B Test","Segment Customers by Elasticity","Reduce Variable Cost via Lean","Monitor Competitive Pricing"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Real-time dashboard"],
  };
}


export interface Price_elasticity_simulatorOutput {
  totalWasteCost: number;
  breakdown: { new_price: number; new_quantity: number; revenue_current: number; revenue_new: number; profit_current: number; profit_new: number; profit_margin_percent: number; contribution_margin_per_unit: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
