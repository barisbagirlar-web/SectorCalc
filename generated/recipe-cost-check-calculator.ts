// Auto-generated from recipe-cost-check-calculator-schema.json
import * as z from 'zod';

export interface Recipe_cost_check_calculatorInput {
  material_cost_per_kg: number;
  recipe_yield_percent: number;
  labor_rate_per_hour: number;
  batch_size_kg: number;
  processing_time_minutes: number;
  energy_cost_per_kwh: number;
  energy_consumption_kwh: number;
  overhead_rate_percent: number;
  waste_disposal_cost_per_kg: number;
  quality_rework_rate: number;
  currency: string;
  include_environmental_cost: boolean;
}

export const Recipe_cost_check_calculatorInputSchema = z.object({
  material_cost_per_kg: z.number().min(0).max(10000).default(0),
  recipe_yield_percent: z.number().min(0).max(100).default(95),
  labor_rate_per_hour: z.number().min(0).max(500).default(25),
  batch_size_kg: z.number().min(1).max(100000).default(100),
  processing_time_minutes: z.number().min(1).max(1440).default(60),
  energy_cost_per_kwh: z.number().min(0).max(10).default(0.12),
  energy_consumption_kwh: z.number().min(0).max(10000).default(50),
  overhead_rate_percent: z.number().min(0).max(200).default(20),
  waste_disposal_cost_per_kg: z.number().min(0).max(100).default(0.05),
  quality_rework_rate: z.number().min(0).max(100).default(2),
  currency: z.string().default(''),
  include_environmental_cost: z.boolean().default(false),
});

function evaluateAllFormulas(input: Recipe_cost_check_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.material_cost_per_kg * input.batch_size_kg; results["material_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["material_cost_total"] = 0; }
  try { const v = input.labor_rate_per_hour * (input.processing_time_minutes / 60); results["labor_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost_total"] = 0; }
  try { const v = input.energy_cost_per_kwh * input.energy_consumption_kwh; results["energy_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["energy_cost_total"] = 0; }
  try { const v = input.waste_disposal_cost_per_kg * (input.batch_size_kg * (1 - input.recipe_yield_percent / 100)); results["waste_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["waste_cost_total"] = 0; }
  try { const v = ((results["material_cost_total"] ?? 0) + (results["labor_cost_total"] ?? 0)) * (input.quality_rework_rate / 100); results["rework_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["rework_cost_total"] = 0; }
  try { const v = ((results["material_cost_total"] ?? 0) + (results["labor_cost_total"] ?? 0) + (results["energy_cost_total"] ?? 0)) * (input.overhead_rate_percent / 100); results["overhead_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["overhead_cost_total"] = 0; }
  try { const v = ((results["material_cost_total"] ?? 0) + (results["labor_cost_total"] ?? 0) + (results["energy_cost_total"] ?? 0) + (results["waste_cost_total"] ?? 0) + (results["rework_cost_total"] ?? 0) + (results["overhead_cost_total"] ?? 0)) / (input.batch_size_kg * (input.recipe_yield_percent / 100)); results["total_cost_per_kg"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost_per_kg"] = 0; }
  return results;
}


export function calculateRecipe_cost_check_calculator(input: Recipe_cost_check_calculatorInput): Recipe_cost_check_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost_per_kg"] ?? 0;
  const breakdown = {
    material_cost_per_kg: values["material_cost_per_kg"] ?? 0,
    labor_cost_per_kg: values["labor_cost_per_kg"] ?? 0,
    energy_cost_per_kg: values["energy_cost_per_kg"] ?? 0,
    waste_cost_per_kg: values["waste_cost_per_kg"] ?? 0,
    rework_cost_per_kg: values["rework_cost_per_kg"] ?? 0,
    overhead_cost_per_kg: values["overhead_cost_per_kg"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Yield Loss","Rework Loss","Energy Inefficiency"];
  const suggestedActions: string[] = ["Improve Recipe Yield","Reduce Quality Rework","Conduct Energy Audit"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Real-time cost alerts"],
  };
}


export interface Recipe_cost_check_calculatorOutput {
  totalWasteCost: number;
  breakdown: { material_cost_per_kg: number; labor_cost_per_kg: number; energy_cost_per_kg: number; waste_cost_per_kg: number; rework_cost_per_kg: number; overhead_cost_per_kg: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
