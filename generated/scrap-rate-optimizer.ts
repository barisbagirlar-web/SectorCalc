// Auto-generated from scrap-rate-optimizer-schema.json
import * as z from 'zod';

export interface Scrap_rate_optimizerInput {
  total_units_produced: number;
  defective_units: number;
  rework_units: number;
  material_cost_per_unit: number;
  labor_cost_per_unit: number;
  overhead_cost_per_unit: number;
  process_stage: string;
  defect_type: string;
  include_rework_in_scrap: boolean;
}

export const Scrap_rate_optimizerInputSchema = z.object({
  total_units_produced: z.number().min(1).max(10000000).default(10000),
  defective_units: z.number().min(0).max(10000000).default(500),
  rework_units: z.number().min(0).max(10000000).default(200),
  material_cost_per_unit: z.number().min(0.01).max(10000).default(5.5),
  labor_cost_per_unit: z.number().min(0.01).max(10000).default(2.75),
  overhead_cost_per_unit: z.number().min(0.01).max(10000).default(1.25),
  process_stage: z.enum(['raw_material', 'machining', 'assembly', 'final_assembly', 'packaging']).default('final_assembly'),
  defect_type: z.enum(['dimensional', 'surface', 'material', 'assembly', 'functional', 'cosmetic']).default('dimensional'),
  include_rework_in_scrap: z.boolean().default(false),
});

function evaluateAllFormulas(input: Scrap_rate_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["scrap_rate"] = input.defective_units / input.total_units_produced; } catch { results["scrap_rate"] = 0; }
  try { results["rework_rate"] = input.rework_units / input.total_units_produced; } catch { results["rework_rate"] = 0; }
  try { results["total_defect_rate"] = (input.defective_units + input.rework_units) / input.total_units_produced; } catch { results["total_defect_rate"] = 0; }
  try { results["unit_cost"] = input.material_cost_per_unit + input.labor_cost_per_unit + input.overhead_cost_per_unit; } catch { results["unit_cost"] = 0; }
  try { results["total_scrap_cost"] = ((input.include_rework_in_scrap) ? ((input.defective_units + input.rework_units) * (results["unit_cost"] ?? 0)) : (input.defective_units * (results["unit_cost"] ?? 0))); } catch { results["total_scrap_cost"] = 0; }
  try { results["scrap_cost_percentage"] = (results["total_scrap_cost"] ?? 0) / (input.total_units_produced * (results["unit_cost"] ?? 0)) * 100; } catch { results["scrap_cost_percentage"] = 0; }
  try { results["yield_rate"] = (input.total_units_produced - input.defective_units - input.rework_units) / input.total_units_produced * 100; } catch { results["yield_rate"] = 0; }
  return results;
}


export function calculateScrap_rate_optimizer(input: Scrap_rate_optimizerInput): Scrap_rate_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["scrap_rate"] ?? 0;
  const breakdown = {
    scrap_rate_percent: values["scrap_rate_percent"] ?? 0,
    rework_rate_percent: values["rework_rate_percent"] ?? 0,
    total_defect_rate_percent: values["total_defect_rate_percent"] ?? 0,
    unit_cost: values["unit_cost"] ?? 0,
    total_scrap_cost: values["total_scrap_cost"] ?? 0,
    scrap_cost_percentage: values["scrap_cost_percentage"] ?? 0,
    yield_rate: values["yield_rate"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Defect Rate in Machining Stage","Rework Cost Amplification","Material Waste from Dimensional Defects"];
  const suggestedActions: string[] = ["Implement SPC (Statistical Process Control) on machining parameters to reduce dimensional defects.","Conduct root cause analysis on rework drivers; consider design for manufacturability (DFM) changes.","Train operators on visual inspection criteria to catch defects earlier in the process."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-plant comparison","Automated alerting"],
  };
}


export interface Scrap_rate_optimizerOutput {
  totalWasteCost: number;
  breakdown: { scrap_rate_percent: number; rework_rate_percent: number; total_defect_rate_percent: number; unit_cost: number; total_scrap_cost: number; scrap_cost_percentage: number; yield_rate: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
