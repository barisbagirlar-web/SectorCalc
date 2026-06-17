// @ts-nocheck
// Auto-generated from moq-inventory-balance-calculator-schema.json
import * as z from 'zod';

export interface Moq_inventory_balance_calculatorInput {
  annual_demand: number;
  ordering_cost: number;
  holding_cost_per_unit: number;
  unit_cost: number;
  moq: number;
  lead_time_days: number;
  demand_std_dev: number;
  service_level: number;
}

export const Moq_inventory_balance_calculatorInputSchema = z.object({
  annual_demand: z.number().min(1).max(10000000).default(10000),
  ordering_cost: z.number().min(0).max(10000).default(50),
  holding_cost_per_unit: z.number().min(0).max(1000).default(2.5),
  unit_cost: z.number().min(0.01).max(100000).default(15),
  moq: z.number().min(1).max(1000000).default(500),
  lead_time_days: z.number().min(1).max(365).default(30),
  demand_std_dev: z.number().min(0).max(10000).default(10),
  service_level: z.number().min(50).max(99.99).default(95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Moq_inventory_balance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annual_demand + input.ordering_cost + input.holding_cost_per_unit; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.annual_demand + input.ordering_cost + input.holding_cost_per_unit; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMoq_inventory_balance_calculator(input: Moq_inventory_balance_calculatorInput): Moq_inventory_balance_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-warehouse simulation","Supplier lead time variability analysis"],
  };
}


export interface Moq_inventory_balance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
