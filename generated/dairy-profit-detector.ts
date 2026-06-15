// Auto-generated from dairy-profit-detector-schema.json
import * as z from 'zod';

export interface Dairy_profit_detectorInput {
  milk_volume_liters: number;
  fat_percentage: number;
  protein_percentage: number;
  selling_price_per_liter: number;
  production_cost_per_liter: number;
  waste_percentage: number;
  labor_hours_per_day: number;
  labor_rate_per_hour: number;
  energy_cost_per_day: number;
  other_variable_cost_per_liter: number;
  fixed_cost_per_day: number;
  quality_grade: string;
  seasonal_demand_factor: string;
}

export const Dairy_profit_detectorInputSchema = z.object({
  milk_volume_liters: z.number().min(0).max(1000000).default(10000),
  fat_percentage: z.number().min(0).max(10).default(3.5),
  protein_percentage: z.number().min(0).max(6).default(3.2),
  selling_price_per_liter: z.number().min(0).max(10).default(0.45),
  production_cost_per_liter: z.number().min(0).max(10).default(0.35),
  waste_percentage: z.number().min(0).max(20).default(2),
  labor_hours_per_day: z.number().min(0).max(500).default(40),
  labor_rate_per_hour: z.number().min(0).max(100).default(15),
  energy_cost_per_day: z.number().min(0).max(10000).default(200),
  other_variable_cost_per_liter: z.number().min(0).max(5).default(0.05),
  fixed_cost_per_day: z.number().min(0).max(50000).default(500),
  quality_grade: z.enum(['A', 'B', 'C']).default('A'),
  seasonal_demand_factor: z.enum(['Low', 'Normal', 'High']).default('Normal'),
});

function evaluateAllFormulas(input: Dairy_profit_detectorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["net_milk_volume"] = input.milk_volume_liters * (1 - input.waste_percentage / 100); } catch { results["net_milk_volume"] = 0; }
  try { results["total_variable_cost_per_day"] = (input.production_cost_per_liter + input.other_variable_cost_per_liter) * input.milk_volume_liters + input.labor_hours_per_day * input.labor_rate_per_hour + input.energy_cost_per_day; } catch { results["total_variable_cost_per_day"] = 0; }
  try { results["total_cost_per_day"] = (results["total_variable_cost_per_day"] ?? 0) + input.fixed_cost_per_day; } catch { results["total_cost_per_day"] = 0; }
  try { results["revenue_per_day"] = (results["net_milk_volume"] ?? 0) * input.selling_price_per_liter; } catch { results["revenue_per_day"] = 0; }
  try { results["profit_per_day"] = (results["revenue_per_day"] ?? 0) - (results["total_cost_per_day"] ?? 0); } catch { results["profit_per_day"] = 0; }
  try { results["profit_margin_percentage"] = ((results["profit_per_day"] ?? 0) / (results["revenue_per_day"] ?? 0)) * 100; } catch { results["profit_margin_percentage"] = 0; }
  try { results["labor_efficiency"] = (results["net_milk_volume"] ?? 0) / input.labor_hours_per_day; } catch { results["labor_efficiency"] = 0; }
  return results;
}


export function calculateDairy_profit_detector(input: Dairy_profit_detectorInput): Dairy_profit_detectorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["profit_per_day"] ?? 0;
  const breakdown = {
    revenue_per_day: values["revenue_per_day"] ?? 0,
    total_cost_per_day: values["total_cost_per_day"] ?? 0,
    total_variable_cost_per_day: values["total_variable_cost_per_day"] ?? 0,
    fixed_cost_per_day: values["fixed_cost_per_day"] ?? 0,
    net_milk_volume: values["net_milk_volume"] ?? 0,
    profit_margin_percentage: values["profit_margin_percentage"] ?? 0,
    labor_efficiency: values["labor_efficiency"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Waste Loss","Quality Penalty","Labor Inefficiency Cost","Energy Overuse Cost"];
  const suggestedActions: string[] = ["Reduce waste by improving cooling and handling processes – target waste below 2%.","Review labor scheduling and consider automation if labor efficiency is below 80 L/hour.","Negotiate better milk prices or shift to higher-value products (cheese, yogurt) if margin is low.","Implement energy audits and upgrade to energy-efficient equipment to reduce energy cost.","Immediate quality improvement program if grade is C – review herd health and milking hygiene."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Automated root cause alerts"],
  };
}


export interface Dairy_profit_detectorOutput {
  totalWasteCost: number;
  breakdown: { revenue_per_day: number; total_cost_per_day: number; total_variable_cost_per_day: number; fixed_cost_per_day: number; net_milk_volume: number; profit_margin_percentage: number; labor_efficiency: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
