// Auto-generated from aql-sampling-risk-cost-calculator-schema.json
import * as z from 'zod';

export interface Aql_sampling_risk_cost_calculatorInput {
  lot_size: number;
  aql_percent: number;
  inspection_level: string;
  sampling_plan_type: string;
  unit_cost: number;
  defect_cost_per_unit: number;
  inspection_cost_per_unit: number;
  defect_rate_actual: number;
  dataConfidence?: number;
}

export const Aql_sampling_risk_cost_calculatorInputSchema = z.object({
  lot_size: z.number().min(2).max(1000000).default(1000),
  aql_percent: z.number().min(0.01).max(10).default(1),
  inspection_level: z.enum(['I', 'II', 'III', 'S-1', 'S-2', 'S-3', 'S-4']).default('II'),
  sampling_plan_type: z.enum(['normal', 'tightened', 'reduced']).default('normal'),
  unit_cost: z.number().min(0.01).max(100000).default(10),
  defect_cost_per_unit: z.number().min(0).max(1000000).default(50),
  inspection_cost_per_unit: z.number().min(0).max(1000).default(2),
  defect_rate_actual: z.number().min(0).max(100).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Aql_sampling_risk_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lot_size * input.unit_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.lot_size * input.unit_cost * (1 + (input.aql_percent / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.lot_size * input.unit_cost * (1 + (input.aql_percent / 100)) * (input.defect_cost_per_unit); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.defect_cost_per_unit; results["factor_defect_cost_per_unit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_defect_cost_per_unit"] = Number.NaN; }
  return results;
}


export function calculateAql_sampling_risk_cost_calculator(input: Aql_sampling_risk_cost_calculatorInput): Aql_sampling_risk_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_defect_cost_per_unit: toNumericFormulaValue(values["factor_defect_cost_per_unit"])
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-lot aggregation","Supplier risk scoring"],
  };
}


export interface Aql_sampling_risk_cost_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_defect_cost_per_unit: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Aql_sampling_risk_cost_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_defect_cost_per_unit"],
} as const;

