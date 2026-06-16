// Auto-generated from dye-recipe-cost-optimizer-schema.json
import * as z from 'zod';

export interface Dye_recipe_cost_optimizerInput {
  dye_volume_l: number;
  dye_concentration_gpl: number;
  dye_price_per_kg: number;
  chemicals_per_liter: number;
  energy_cost_per_batch: number;
  labor_cost_per_hour: number;
  batch_time_hours: number;
  waste_percentage: number;
  water_cost_per_m3: number;
  water_usage_l_per_kg: number;
  fabric_weight_kg: number;
  dye_type: string;
  use_lean_optimization: boolean;
}

export const Dye_recipe_cost_optimizerInputSchema = z.object({
  dye_volume_l: z.number().min(10).max(100000).default(1000),
  dye_concentration_gpl: z.number().min(0.1).max(100).default(5),
  dye_price_per_kg: z.number().min(1).max(500).default(25),
  chemicals_per_liter: z.number().min(0).max(10).default(0.15),
  energy_cost_per_batch: z.number().min(0).max(10000).default(50),
  labor_cost_per_hour: z.number().min(0).max(200).default(25),
  batch_time_hours: z.number().min(0.5).max(48).default(4),
  waste_percentage: z.number().min(0).max(50).default(3),
  water_cost_per_m3: z.number().min(0).max(20).default(2.5),
  water_usage_l_per_kg: z.number().min(10).max(500).default(100),
  fabric_weight_kg: z.number().min(1).max(50000).default(200),
  dye_type: z.enum(['reactive', 'disperse', 'vat', 'acid', 'direct']).default('reactive'),
  use_lean_optimization: z.boolean().default(false),
});

function evaluateAllFormulas(input: Dye_recipe_cost_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dye_volume_l * input.dye_concentration_gpl) / 1000; results["dye_mass_kg"] = Number.isFinite(v) ? v : 0; } catch { results["dye_mass_kg"] = 0; }
  try { const v = (results["dye_mass_kg"] ?? 0) * input.dye_price_per_kg; results["dye_cost"] = Number.isFinite(v) ? v : 0; } catch { results["dye_cost"] = 0; }
  try { const v = input.dye_volume_l * input.chemicals_per_liter; results["chemical_cost"] = Number.isFinite(v) ? v : 0; } catch { results["chemical_cost"] = 0; }
  try { const v = input.labor_cost_per_hour * input.batch_time_hours; results["labor_cost"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost"] = 0; }
  try { const v = (input.water_usage_l_per_kg * input.fabric_weight_kg / 1000) * input.water_cost_per_m3; results["water_cost"] = Number.isFinite(v) ? v : 0; } catch { results["water_cost"] = 0; }
  try { const v = ((results["dye_cost"] ?? 0) + (results["chemical_cost"] ?? 0) + input.energy_cost_per_batch + (results["labor_cost"] ?? 0) + (results["water_cost"] ?? 0)) * (input.waste_percentage / 100); results["waste_cost"] = Number.isFinite(v) ? v : 0; } catch { results["waste_cost"] = 0; }
  try { const v = (results["dye_cost"] ?? 0) + (results["chemical_cost"] ?? 0) + input.energy_cost_per_batch + (results["labor_cost"] ?? 0) + (results["water_cost"] ?? 0) + (results["waste_cost"] ?? 0); results["total_cost_per_batch"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost_per_batch"] = 0; }
  return results;
}


export function calculateDye_recipe_cost_optimizer(input: Dye_recipe_cost_optimizerInput): Dye_recipe_cost_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost_per_batch"] ?? 0;
  const breakdown = {
    dye_cost: values["dye_cost"] ?? 0,
    chemical_cost: values["chemical_cost"] ?? 0,
    energy_cost: values["energy_cost"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    water_cost: values["water_cost"] ?? 0,
    waste_cost: values["waste_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Dye fixation loss","Water heating inefficiency","Setup / changeover time"];
  const suggestedActions: string[] = ["Reduce waste using Six Sigma DMAIC","Optimize dye concentration","Reduce water usage via lean methods","Improve energy efficiency"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Dye_recipe_cost_optimizerOutput {
  totalWasteCost: number;
  breakdown: { dye_cost: number; chemical_cost: number; energy_cost: number; labor_cost: number; water_cost: number; waste_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
