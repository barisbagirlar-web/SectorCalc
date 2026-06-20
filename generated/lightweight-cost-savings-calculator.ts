// Auto-generated from lightweight-cost-savings-calculator-schema.json
import * as z from 'zod';

export interface Lightweight_cost_savings_calculatorInput {
  current_weight_kg: number;
  new_weight_kg: number;
  annual_volume_units: number;
  material_cost_per_kg: number;
  shipping_cost_per_kg: number;
  waste_rate_percent: number;
  labor_hours_per_unit: number;
  labor_rate_per_hour: number;
  dataConfidence?: number;
}

export const Lightweight_cost_savings_calculatorInputSchema = z.object({
  current_weight_kg: z.number().min(0.1).max(10000).default(10),
  new_weight_kg: z.number().min(0.1).max(10000).default(8),
  annual_volume_units: z.number().min(1).max(1000000000).default(100000),
  material_cost_per_kg: z.number().min(0).max(1000).default(2.5),
  shipping_cost_per_kg: z.number().min(0).max(100).default(0.3),
  waste_rate_percent: z.number().min(0).max(100).default(5),
  labor_hours_per_unit: z.number().min(0).max(100).default(0.5),
  labor_rate_per_hour: z.number().min(0).max(500).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lightweight_cost_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_volume_units * input.material_cost_per_kg; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.annual_volume_units * input.material_cost_per_kg * (1 + (input.waste_rate_percent / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.annual_volume_units * input.material_cost_per_kg * (1 + (input.waste_rate_percent / 100)) * (input.current_weight_kg); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.current_weight_kg; results["factor_current_weight_kg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_current_weight_kg"] = Number.NaN; }
  return results;
}


export function calculateLightweight_cost_savings_calculator(input: Lightweight_cost_savings_calculatorInput): Lightweight_cost_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_current_weight_kg: toNumericFormulaValue(values["factor_current_weight_kg"])
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Custom reporting"],
  };
}


export interface Lightweight_cost_savings_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_current_weight_kg: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lightweight_cost_savings_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_current_weight_kg"],
} as const;

