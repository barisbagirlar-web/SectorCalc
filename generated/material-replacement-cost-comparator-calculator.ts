// @ts-nocheck
// Auto-generated from material-replacement-cost-comparator-calculator-schema.json
import * as z from 'zod';

export interface Material_replacement_cost_comparator_calculatorInput {
  current_material_cost: number;
  alternative_material_cost: number;
  annual_volume: number;
  scrap_rate_current: number;
  scrap_rate_alternative: number;
  logistics_cost_current: number;
  logistics_cost_alternative: number;
  changeover_cost: number;
}

export const Material_replacement_cost_comparator_calculatorInputSchema = z.object({
  current_material_cost: z.number().min(0).max(100000).default(100),
  alternative_material_cost: z.number().min(0).max(100000).default(85),
  annual_volume: z.number().min(1).max(100000000).default(10000),
  scrap_rate_current: z.number().min(0).max(100).default(5),
  scrap_rate_alternative: z.number().min(0).max(100).default(3),
  logistics_cost_current: z.number().min(0).max(10000).default(10),
  logistics_cost_alternative: z.number().min(0).max(10000).default(12),
  changeover_cost: z.number().min(0).max(10000000).default(5000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Material_replacement_cost_comparator_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annual_volume * input.current_material_cost; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.annual_volume * input.current_material_cost * (1 + (input.scrap_rate_current / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.annual_volume * input.current_material_cost * (1 + (input.scrap_rate_current / 100)) * (input.alternative_material_cost); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.alternative_material_cost; results["factor_alternative_material_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_alternative_material_cost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMaterial_replacement_cost_comparator_calculator(input: Material_replacement_cost_comparator_calculatorInput): Material_replacement_cost_comparator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Supplier benchmarking"],
  };
}


export interface Material_replacement_cost_comparator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
