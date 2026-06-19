// Auto-generated from dye-recipe-cost-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Dye_recipe_cost_optimizer_calculatorInput {
  dye_volume_l: number;
  dye_concentration_gpl: number;
  dye_price_per_kg: number;
  chemicals_per_liter: number;
  energy_cost_per_batch: number;
  labor_cost_per_hour: number;
  batch_time_hours: number;
  waste_percentage: number;
  dataConfidence?: number;
}

export const Dye_recipe_cost_optimizer_calculatorInputSchema = z.object({
  dye_volume_l: z.number().min(10).max(100000).default(1000),
  dye_concentration_gpl: z.number().min(0.1).max(100).default(5),
  dye_price_per_kg: z.number().min(1).max(500).default(25),
  chemicals_per_liter: z.number().min(0).max(10).default(0.15),
  energy_cost_per_batch: z.number().min(0).max(10000).default(50),
  labor_cost_per_hour: z.number().min(0).max(200).default(25),
  batch_time_hours: z.number().min(0.5).max(48).default(4),
  waste_percentage: z.number().min(0).max(50).default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dye_recipe_cost_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dye_volume_l * input.dye_price_per_kg; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.dye_volume_l * input.dye_price_per_kg * (1 + (input.waste_percentage / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.dye_volume_l * input.dye_price_per_kg * (1 + (input.waste_percentage / 100)) * (input.dye_concentration_gpl); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.dye_concentration_gpl; results["factor_dye_concentration_gpl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_dye_concentration_gpl"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDye_recipe_cost_optimizer_calculator(input: Dye_recipe_cost_optimizer_calculatorInput): Dye_recipe_cost_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-batch comparison","Supplier cost benchmarking"],
  };
}


export interface Dye_recipe_cost_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
