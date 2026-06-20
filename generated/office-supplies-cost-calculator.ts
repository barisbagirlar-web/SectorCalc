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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Office_supplies_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_usage_units * input.unit_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.annual_usage_units * input.unit_cost * (1 + (input.holding_cost_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.annual_usage_units * input.unit_cost * (1 + (input.holding_cost_rate / 100)) * (input.order_cost); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.order_cost; results["factor_order_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_order_cost"] = Number.NaN; }
  return results;
}


export function calculateOffice_supplies_cost_calculator(input: Office_supplies_cost_calculatorInput): Office_supplies_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_order_cost: toNumericFormulaValue(values["factor_order_cost"])
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-department aggregation","Automated reorder point optimization"],
  };
}


export interface Office_supplies_cost_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_order_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Office_supplies_cost_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_order_cost"],
} as const;

