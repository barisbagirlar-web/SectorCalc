// Auto-generated from cnc-machining-cost-calculator-schema.json
import * as z from 'zod';

export interface Cnc_machining_cost_calculatorInput {
  material_type: string;
  part_weight_kg: number;
  stock_volume_cm3: number;
  machining_time_min: number;
  setup_time_min: number;
  batch_size: number;
  machine_hourly_rate_usd: number;
  labor_hourly_rate_usd: number;
  tooling_cost_per_part_usd: number;
  overhead_percentage: number;
  scrap_rate_percent: number;
  material_cost_per_kg_usd: number;
  density_g_per_cm3: number;
}

export const Cnc_machining_cost_calculatorInputSchema = z.object({
  material_type: z.enum(['aluminum_6061', 'steel_1018', 'stainless_304', 'titanium_6al4v', 'brass_c360']).default('aluminum_6061'),
  part_weight_kg: z.number().min(0.001).max(500).default(0.5),
  stock_volume_cm3: z.number().min(1).max(100000).default(200),
  machining_time_min: z.number().min(0.1).max(1440).default(15),
  setup_time_min: z.number().min(0).max(480).default(60),
  batch_size: z.number().min(1).max(100000).default(100),
  machine_hourly_rate_usd: z.number().min(20).max(500).default(85),
  labor_hourly_rate_usd: z.number().min(10).max(150).default(35),
  tooling_cost_per_part_usd: z.number().min(0).max(100).default(2.5),
  overhead_percentage: z.number().min(0).max(100).default(15),
  scrap_rate_percent: z.number().min(0).max(50).default(3),
  material_cost_per_kg_usd: z.number().min(0.5).max(200).default(5),
  density_g_per_cm3: z.number().min(0.5).max(20).default(2.7),
});

function evaluateAllFormulas(input: Cnc_machining_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["raw_material_cost"] = ((input.stock_volume_cm3 * input.density_g_per_cm3 / 1000) * input.material_cost_per_kg_usd) * (1 + input.scrap_rate_percent / 100); } catch { results["raw_material_cost"] = 0; }
  try { results["machining_cost"] = (input.machining_time_min / 60) * input.machine_hourly_rate_usd + (input.setup_time_min / 60 / input.batch_size) * input.machine_hourly_rate_usd; } catch { results["machining_cost"] = 0; }
  try { results["labor_cost"] = (input.machining_time_min / 60) * input.labor_hourly_rate_usd + (input.setup_time_min / 60 / input.batch_size) * input.labor_hourly_rate_usd; } catch { results["labor_cost"] = 0; }
  try { results["tooling_cost"] = input.tooling_cost_per_part_usd; } catch { results["tooling_cost"] = 0; }
  try { results["direct_cost"] = (results["raw_material_cost"] ?? 0) + (results["machining_cost"] ?? 0) + (results["labor_cost"] ?? 0) + (results["tooling_cost"] ?? 0); } catch { results["direct_cost"] = 0; }
  try { results["overhead_cost"] = (results["direct_cost"] ?? 0) * (input.overhead_percentage / 100); } catch { results["overhead_cost"] = 0; }
  try { results["total_cost_per_part"] = ((results["direct_cost"] ?? 0) + (results["overhead_cost"] ?? 0)) / (1 - input.scrap_rate_percent / 100); } catch { results["total_cost_per_part"] = 0; }
  return results;
}


export function calculateCnc_machining_cost_calculator(input: Cnc_machining_cost_calculatorInput): Cnc_machining_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost_per_part"] ?? 0;
  const breakdown = {
    raw_material_cost: values["raw_material_cost"] ?? 0,
    machining_cost: values["machining_cost"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    tooling_cost: values["tooling_cost"] ?? 0,
    overhead_cost: values["overhead_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Setup Amortization per Part","Scrap Loss per Good Part","Material Utilization Loss"];
  const suggestedActions: string[] = ["Implement SMED (Single-Minute Exchange of Die) to reduce setup time by 50%.","Apply Six Sigma DMAIC to identify root causes of scrap; consider SPC monitoring.","Evaluate tool coatings and feeds/speeds to extend tool life; use ISO 13399 tool data.","Combine orders or use group technology to increase batch size."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cnc_machining_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { raw_material_cost: number; machining_cost: number; labor_cost: number; tooling_cost: number; overhead_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
