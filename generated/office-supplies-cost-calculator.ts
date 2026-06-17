// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Office_supplies_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annual_usage_units + input.unit_cost + input.order_cost; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.annual_usage_units + input.unit_cost + input.order_cost; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOffice_supplies_cost_calculator(input: Office_supplies_cost_calculatorInput): Office_supplies_cost_calculatorOutput {
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-department aggregation","Automated reorder point optimization"],
  };
}


export interface Office_supplies_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
