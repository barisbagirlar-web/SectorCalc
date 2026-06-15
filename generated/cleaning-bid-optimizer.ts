// Auto-generated from cleaning-bid-optimizer-schema.json
import * as z from 'zod';

export interface Cleaning_bid_optimizerInput {
  total_sq_ft: number;
  cleaning_frequency: number;
  labor_rate_per_hour: number;
  labor_burden_percent: number;
  productivity_sqft_per_hour: number;
  material_cost_per_sqft: number;
  equipment_cost_per_sqft: number;
  overhead_percent: number;
  desired_margin_percent: number;
  waste_factor_percent: number;
  quality_level: string;
  use_lean_methods: boolean;
}

export const Cleaning_bid_optimizerInputSchema = z.object({
  total_sq_ft: z.number().min(100).max(1000000).default(10000),
  cleaning_frequency: z.number().min(1).max(7).default(5),
  labor_rate_per_hour: z.number().min(7.25).max(50).default(15),
  labor_burden_percent: z.number().min(0).max(60).default(25),
  productivity_sqft_per_hour: z.number().min(500).max(5000).default(2000),
  material_cost_per_sqft: z.number().min(0.005).max(0.1).default(0.02),
  equipment_cost_per_sqft: z.number().min(0.001).max(0.05).default(0.01),
  overhead_percent: z.number().min(0).max(50).default(15),
  desired_margin_percent: z.number().min(0).max(40).default(10),
  waste_factor_percent: z.number().min(0).max(20).default(5),
  quality_level: z.enum(['economy', 'standard', 'premium', 'healthcare']).default('standard'),
  use_lean_methods: z.boolean().default(false),
});

function evaluateAllFormulas(input: Cleaning_bid_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["effective_labor_rate"] = input.labor_rate_per_hour * (1 + input.labor_burden_percent / 100); } catch { results["effective_labor_rate"] = 0; }
  try { results["adjusted_productivity"] = input.productivity_sqft_per_hour * (1 - (input.quality_level == 'healthcare' ? 0.15 : input.quality_level == 'premium' ? 0.10 : input.quality_level == 'economy' ? 0.05 : 0)) * (input.use_lean_methods ? 1.10 : 1.00); } catch { results["adjusted_productivity"] = 0; }
  try { results["labor_cost_per_cleaning"] = (input.total_sq_ft / (results["adjusted_productivity"] ?? 0)) * (results["effective_labor_rate"] ?? 0); } catch { results["labor_cost_per_cleaning"] = 0; }
  try { results["material_cost_per_cleaning"] = input.total_sq_ft * input.material_cost_per_sqft * (1 + input.waste_factor_percent / 100); } catch { results["material_cost_per_cleaning"] = 0; }
  try { results["equipment_cost_per_cleaning"] = input.total_sq_ft * input.equipment_cost_per_sqft; } catch { results["equipment_cost_per_cleaning"] = 0; }
  try { results["total_direct_cost_per_cleaning"] = (results["labor_cost_per_cleaning"] ?? 0) + (results["material_cost_per_cleaning"] ?? 0) + (results["equipment_cost_per_cleaning"] ?? 0); } catch { results["total_direct_cost_per_cleaning"] = 0; }
  try { results["weekly_cost"] = (results["total_direct_cost_per_cleaning"] ?? 0) * input.cleaning_frequency * (1 + input.overhead_percent / 100); } catch { results["weekly_cost"] = 0; }
  try { results["primary_result"] = (results["weekly_cost"] ?? 0) / (1 - input.desired_margin_percent / 100); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateCleaning_bid_optimizer(input: Cleaning_bid_optimizerInput): Cleaning_bid_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weekly_bid_price"] ?? 0;
  const breakdown = {
    labor_cost_per_cleaning: values["labor_cost_per_cleaning"] ?? 0,
    material_cost_per_cleaning: values["material_cost_per_cleaning"] ?? 0,
    equipment_cost_per_cleaning: values["equipment_cost_per_cleaning"] ?? 0,
    total_direct_cost_per_cleaning: values["total_direct_cost_per_cleaning"] ?? 0,
    weekly_overhead: values["weekly_overhead"] ?? 0,
    weekly_profit: values["weekly_profit"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Waste Factor","Low Productivity Rate","High Labor Burden","Quality Level vs. Productivity Mismatch"];
  const suggestedActions: string[] = ["Implement 5S and Standard Work","Reduce Waste Factor to 3%","Review Quality Tier Selection","Optimize Cleaning Frequency"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Custom KPI dashboard"],
  };
}


export interface Cleaning_bid_optimizerOutput {
  totalWasteCost: number;
  breakdown: { labor_cost_per_cleaning: number; material_cost_per_cleaning: number; equipment_cost_per_cleaning: number; total_direct_cost_per_cleaning: number; weekly_overhead: number; weekly_profit: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
