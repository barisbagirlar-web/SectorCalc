// Auto-generated from food-waste-margin-loss-schema.json
import * as z from 'zod';

export interface Food_waste_margin_lossInput {
  total_production_kg: number;
  waste_kg: number;
  selling_price_per_kg: number;
  cost_per_kg: number;
  waste_disposal_cost_per_kg: number;
  rework_percentage: number;
  labor_hourly_rate: number;
  rework_hours_per_kg: number;
  storage_cost_per_kg_per_day: number;
  average_storage_days: number;
  waste_type: string;
  include_hidden_costs: boolean;
}

export const Food_waste_margin_lossInputSchema = z.object({
  total_production_kg: z.number().min(0).max(1000000).default(10000),
  waste_kg: z.number().min(0).max(1000000).default(500),
  selling_price_per_kg: z.number().min(0.01).max(1000).default(5),
  cost_per_kg: z.number().min(0.01).max(1000).default(3.5),
  waste_disposal_cost_per_kg: z.number().min(0).max(10).default(0.15),
  rework_percentage: z.number().min(0).max(100).default(2),
  labor_hourly_rate: z.number().min(0).max(200).default(25),
  rework_hours_per_kg: z.number().min(0).max(10).default(0.05),
  storage_cost_per_kg_per_day: z.number().min(0).max(1).default(0.02),
  average_storage_days: z.number().min(0).max(365).default(3),
  waste_type: z.enum(['trim', 'spoilage', 'overproduction', 'expired', 'other']).default('spoilage'),
  include_hidden_costs: z.boolean().default(true),
});

function evaluateAllFormulas(input: Food_waste_margin_lossInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["waste_percentage"] = (input.waste_kg / input.total_production_kg) * 100; } catch { results["waste_percentage"] = 0; }
  try { results["direct_material_loss"] = input.waste_kg * input.cost_per_kg; } catch { results["direct_material_loss"] = 0; }
  try { results["lost_revenue"] = input.waste_kg * input.selling_price_per_kg; } catch { results["lost_revenue"] = 0; }
  try { results["disposal_cost"] = input.waste_kg * input.waste_disposal_cost_per_kg; } catch { results["disposal_cost"] = 0; }
  try { results["rework_labor_cost"] = (input.rework_percentage / 100) * input.total_production_kg * input.rework_hours_per_kg * input.labor_hourly_rate; } catch { results["rework_labor_cost"] = 0; }
  try { results["storage_cost_waste"] = input.waste_kg * input.storage_cost_per_kg_per_day * input.average_storage_days; } catch { results["storage_cost_waste"] = 0; }
  results["hidden_overhead_allocation"] = 0;
  try { results["total_margin_loss"] = (results["direct_material_loss"] ?? 0) + (results["lost_revenue"] ?? 0) + (results["disposal_cost"] ?? 0) + (results["rework_labor_cost"] ?? 0) + (results["storage_cost_waste"] ?? 0) + (results["hidden_overhead_allocation"] ?? 0); } catch { results["total_margin_loss"] = 0; }
  try { results["margin_loss_percentage"] = ((results["total_margin_loss"] ?? 0) / (input.total_production_kg * input.selling_price_per_kg)) * 100; } catch { results["margin_loss_percentage"] = 0; }
  return results;
}


export function calculateFood_waste_margin_loss(input: Food_waste_margin_lossInput): Food_waste_margin_lossOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_margin_loss"] ?? 0;
  const breakdown = {
    direct_material_loss: values["direct_material_loss"] ?? 0,
    lost_revenue: values["lost_revenue"] ?? 0,
    disposal_cost: values["disposal_cost"] ?? 0,
    rework_labor_cost: values["rework_labor_cost"] ?? 0,
    storage_cost_waste: values["storage_cost_waste"] ?? 0,
    hidden_overhead_allocation: values["hidden_overhead_allocation"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Energy Embedded in Waste","Water Embedded in Waste","Carbon Footprint of Waste","Labor Opportunity Cost"];
  const suggestedActions: string[] = ["Implement Lean 5S and visual management to reduce overproduction and trim waste.","Conduct root cause analysis (Fishbone / 5 Whys) for spoilage and expired waste.","Optimize inventory turnover using FIFO and demand forecasting to reduce expired waste.","Train operators on standardized work and error-proofing (Poka-Yoke) to reduce rework.","Explore waste-to-value opportunities (composting, anaerobic digestion, donation)."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Root cause Pareto chart","Automated corrective action tracking"],
  };
}


export interface Food_waste_margin_lossOutput {
  totalWasteCost: number;
  breakdown: { direct_material_loss: number; lost_revenue: number; disposal_cost: number; rework_labor_cost: number; storage_cost_waste: number; hidden_overhead_allocation: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
