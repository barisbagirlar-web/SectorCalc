// Auto-generated from kaizen-savings-tracker-schema.json
import * as z from 'zod';

export interface Kaizen_savings_trackerInput {
  labor_rate: number;
  operators_affected: number;
  time_saved_per_operator: number;
  shifts_per_day: number;
  operating_days_per_year: number;
  defect_rate_before: number;
  defect_rate_after: number;
  annual_production_volume: number;
  cost_per_defect: number;
  material_cost_savings: number;
  energy_cost_savings: number;
  implementation_cost: number;
  sustainability_factor: string;
  data_confidence: string;
}

export const Kaizen_savings_trackerInputSchema = z.object({
  labor_rate: z.number().min(7.25).max(150).default(25),
  operators_affected: z.number().min(1).max(500).default(10),
  time_saved_per_operator: z.number().min(0).max(480).default(15),
  shifts_per_day: z.number().min(1).max(3).default(2),
  operating_days_per_year: z.number().min(200).max(365).default(250),
  defect_rate_before: z.number().min(0).max(100).default(5),
  defect_rate_after: z.number().min(0).max(100).default(2),
  annual_production_volume: z.number().min(1000).max(10000000).default(100000),
  cost_per_defect: z.number().min(0.5).max(5000).default(10),
  material_cost_savings: z.number().min(0).max(10000000).default(0),
  energy_cost_savings: z.number().min(0).max(5000000).default(0),
  implementation_cost: z.number().min(0).max(500000).default(5000),
  sustainability_factor: z.enum(['low', 'medium', 'high']).default('medium'),
  data_confidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

function evaluateAllFormulas(input: Kaizen_savings_trackerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.labor_rate * input.operators_affected * (input.time_saved_per_operator / 60) * input.shifts_per_day * input.operating_days_per_year; results["labor_savings"] = Number.isFinite(v) ? v : 0; } catch { results["labor_savings"] = 0; }
  try { const v = ((input.defect_rate_before - input.defect_rate_after) / 100) * input.annual_production_volume * input.cost_per_defect; results["defect_savings"] = Number.isFinite(v) ? v : 0; } catch { results["defect_savings"] = 0; }
  try { const v = (results["labor_savings"] ?? 0) + (results["defect_savings"] ?? 0) + input.material_cost_savings + input.energy_cost_savings; results["direct_savings"] = Number.isFinite(v) ? v : 0; } catch { results["direct_savings"] = 0; }
  try { const v = (results["direct_savings"] ?? 0) * sustainability_factor_value; results["sustainability_adjusted_savings"] = Number.isFinite(v) ? v : 0; } catch { results["sustainability_adjusted_savings"] = 0; }
  try { const v = (((results["sustainability_adjusted_savings"] ?? 0) - input.implementation_cost) / input.implementation_cost) * 100; results["return_on_investment"] = Number.isFinite(v) ? v : 0; } catch { results["return_on_investment"] = 0; }
  try { const v = (input.implementation_cost / ((results["sustainability_adjusted_savings"] ?? 0) / 12)); results["payback_period"] = Number.isFinite(v) ? v : 0; } catch { results["payback_period"] = 0; }
  try { const v = (results["sustainability_adjusted_savings"] ?? 0) * data_confidence_value; results["total_annual_savings"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_savings"] = 0; }
  return results;
}


export function calculateKaizen_savings_tracker(input: Kaizen_savings_trackerInput): Kaizen_savings_trackerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_savings"] ?? 0;
  const breakdown = {
    labor_savings: values["labor_savings"] ?? 0,
    defect_savings: values["defect_savings"] ?? 0,
    material_cost_savings: values["material_cost_savings"] ?? 0,
    energy_cost_savings: values["energy_cost_savings"] ?? 0,
    implementation_cost: values["implementation_cost"] ?? 0,
    return_on_investment: values["return_on_investment"] ?? 0,
    payback_period: values["payback_period"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unplanned Downtime","Rework Loop Time","Inventory Waste","Motion Waste"];
  const suggestedActions: string[] = ["Standardize Improved Process","Implement Visual Management","Conduct Follow-up Time Studies","Expand Kaizen to Adjacent Processes","Review Data Confidence"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Real-time dashboard","Benchmarking against industry KPIs"],
  };
}


export interface Kaizen_savings_trackerOutput {
  totalWasteCost: number;
  breakdown: { labor_savings: number; defect_savings: number; material_cost_savings: number; energy_cost_savings: number; implementation_cost: number; return_on_investment: number; payback_period: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
