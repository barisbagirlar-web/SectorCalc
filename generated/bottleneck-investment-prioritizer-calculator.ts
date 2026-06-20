// Auto-generated from bottleneck-investment-prioritizer-calculator-schema.json
import * as z from 'zod';

export interface Bottleneck_investment_prioritizer_calculatorInput {
  bottleneck_utilization: number;
  demand_rate: number;
  bottleneck_capacity: number;
  investment_cost: number;
  expected_capacity_increase: number;
  operating_hours_per_year: number;
  profit_margin_per_unit: number;
  quality_yield: number;
  dataConfidence?: number;
}

export const Bottleneck_investment_prioritizer_calculatorInputSchema = z.object({
  bottleneck_utilization: z.number().min(0).max(100).default(85),
  demand_rate: z.number().min(0).max(10000).default(100),
  bottleneck_capacity: z.number().min(0).max(10000).default(120),
  investment_cost: z.number().min(0).max(10000000).default(50000),
  expected_capacity_increase: z.number().min(0).max(200).default(20),
  operating_hours_per_year: z.number().min(0).max(8760).default(4000),
  profit_margin_per_unit: z.number().min(0).max(10000).default(5),
  quality_yield: z.number().min(0).max(100).default(95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bottleneck_investment_prioritizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.profit_margin_per_unit * input.investment_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.profit_margin_per_unit * input.investment_cost * (1 + (input.bottleneck_utilization / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.profit_margin_per_unit * input.investment_cost * (1 + (input.bottleneck_utilization / 100)) * ((input.demand_rate / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.demand_rate / 100); results["factor_demand_rate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_demand_rate"] = Number.NaN; }
  return results;
}


export function calculateBottleneck_investment_prioritizer_calculator(input: Bottleneck_investment_prioritizer_calculatorInput): Bottleneck_investment_prioritizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_demand_rate: toNumericFormulaValue(values["factor_demand_rate"])
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario simulation","Multi-site comparison"],
  };
}


export interface Bottleneck_investment_prioritizer_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_demand_rate: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bottleneck_investment_prioritizer_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_demand_rate"],
} as const;

