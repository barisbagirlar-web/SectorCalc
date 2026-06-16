// Auto-generated from office-supplies-cost-calculator-schema.json
import * as z from 'zod';

export interface Office_supplies_cost_calculatorInput {
  annual_usage_units: number;
  unit_cost: number;
  order_cost: number;
  holding_cost_rate: number;
  waste_percentage: number;
  order_frequency: string;
  use_lean_inventory: boolean;
}

export const Office_supplies_cost_calculatorInputSchema = z.object({
  annual_usage_units: z.number().min(0).max(1000000).default(1000),
  unit_cost: z.number().min(0.01).max(1000).default(5),
  order_cost: z.number().min(0).max(500).default(25),
  holding_cost_rate: z.number().min(0).max(100).default(20),
  waste_percentage: z.number().min(0).max(50).default(5),
  order_frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly', 'annually']).default('monthly'),
  use_lean_inventory: z.boolean().default(false),
});

function evaluateAllFormulas(input: Office_supplies_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((2 * input.annual_usage_units * input.order_cost) / (input.unit_cost * (input.holding_cost_rate/100))); results["order_quantity"] = Number.isFinite(v) ? v : 0; } catch { results["order_quantity"] = 0; }
  try { const v = (input.annual_usage_units / (results["order_quantity"] ?? 0)) * input.order_cost; results["total_order_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_order_cost"] = 0; }
  try { const v = ((results["order_quantity"] ?? 0) / 2) * input.unit_cost * (input.holding_cost_rate/100); results["total_holding_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_holding_cost"] = 0; }
  try { const v = input.annual_usage_units * input.unit_cost * (input.waste_percentage/100); results["waste_cost"] = Number.isFinite(v) ? v : 0; } catch { results["waste_cost"] = 0; }
  try { const v = input.use_lean_inventory ? ((results["total_holding_cost"] ?? 0) * 0.7 + (results["waste_cost"] ?? 0) * 0.5) : ((results["total_holding_cost"] ?? 0) + (results["waste_cost"] ?? 0)); results["lean_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["lean_adjustment"] = 0; }
  try { const v = input.annual_usage_units * input.unit_cost; results["total_supply_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_supply_cost"] = 0; }
  try { const v = (results["total_supply_cost"] ?? 0) + (results["total_order_cost"] ?? 0) + (results["lean_adjustment"] ?? 0); results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  return results;
}


export function calculateOffice_supplies_cost_calculator(input: Office_supplies_cost_calculatorInput): Office_supplies_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost"] ?? 0;
  const breakdown = {
    supply_cost: values["supply_cost"] ?? values["total_supply_cost"] ?? 0,
    order_cost: values["order_cost"] ?? values["total_order_cost"] ?? 0,
    holding_cost: values["holding_cost"] ?? values["total_holding_cost"] ?? 0,
    waste_cost: values["waste_cost"] ?? 0,
    lean_adjustment: values["lean_adjustment"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Inventory Cost","Obsolescence Risk"];
  const suggestedActions: string[] = ["Reduce Waste","Increase Order Frequency","Adopt Lean Inventory"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-department aggregation","Automated reorder point optimization"],
  };
}


export interface Office_supplies_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { supply_cost: number; order_cost: number; holding_cost: number; waste_cost: number; lean_adjustment: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
