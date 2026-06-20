// Auto-generated from seed-rate-calculator-schema.json
import * as z from 'zod';

export interface Seed_rate_calculatorInput {
  target_population: number;
  germination_rate: number;
  field_emergence_factor: number;
  seed_weight: number;
  row_spacing: number;
  planter_efficiency: number;
  seed_cost_per_unit: number;
  expected_yield_value: number;
  dataConfidence?: number;
}

export const Seed_rate_calculatorInputSchema = z.object({
  target_population: z.number().min(10000).max(200000).default(75000),
  germination_rate: z.number().min(50).max(100).default(95),
  field_emergence_factor: z.number().min(50).max(100).default(90),
  seed_weight: z.number().min(100).max(600).default(250),
  row_spacing: z.number().min(15).max(100).default(50),
  planter_efficiency: z.number().min(70).max(100).default(95),
  seed_cost_per_unit: z.number().min(0.5).max(50).default(5),
  expected_yield_value: z.number().min(50).max(1000).default(200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Seed_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.seed_weight * input.seed_cost_per_unit; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.seed_weight * input.seed_cost_per_unit * (1 + (input.germination_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.seed_weight * input.seed_cost_per_unit * (1 + (input.germination_rate / 100)) * (input.target_population); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.target_population; results["factor_target_population"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_target_population"] = Number.NaN; }
  return results;
}


export function calculateSeed_rate_calculator(input: Seed_rate_calculatorInput): Seed_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_target_population: toNumericFormulaValue(values["factor_target_population"])
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-field comparison","Historical data integration"],
  };
}


export interface Seed_rate_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_target_population: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Seed_rate_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_target_population"],
} as const;

