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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Moq_inventory_balance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_demand * input.ordering_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.annual_demand * input.ordering_cost * (1 + (input.service_level / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.annual_demand * input.ordering_cost * (1 + (input.service_level / 100)) * (input.holding_cost_per_unit); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.holding_cost_per_unit; results["factor_holding_cost_per_unit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_holding_cost_per_unit"] = Number.NaN; }
  return results;
}


export function calculateMoq_inventory_balance_calculator(input: Moq_inventory_balance_calculatorInput): Moq_inventory_balance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_holding_cost_per_unit: toNumericFormulaValue(values["factor_holding_cost_per_unit"])
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-warehouse simulation","Supplier lead time variability analysis"],
  };
}


export interface Moq_inventory_balance_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_holding_cost_per_unit: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Moq_inventory_balance_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_holding_cost_per_unit"],
} as const;

