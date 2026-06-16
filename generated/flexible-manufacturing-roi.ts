// Auto-generated from flexible-manufacturing-roi-schema.json
import * as z from 'zod';

export interface Flexible_manufacturing_roiInput {
  annual_production_volume: number;
  avg_batch_size: number;
  current_setup_time: number;
  target_setup_time: number;
  hourly_operating_cost: number;
  changeover_cost_per_hour: number;
  inventory_holding_cost_rate: number;
  avg_inventory_value: number;
  fms_investment: number;
  fms_useful_life: number;
  discount_rate: number;
  product_variants: number;
  quality_defect_rate: number;
  fms_quality_improvement: number;
  cost_per_defect: number;
  labor_productivity_gain: number;
  floor_space_reduction: number;
  annual_floor_space_cost: number;
  current_floor_space: number;
  energy_cost_reduction: number;
  annual_energy_cost: number;
  maintenance_cost_increase: number;
  annual_maintenance_cost: number;
  training_cost: number;
  implementation_time: number;
  production_days_per_year: number;
  shifts_per_day: number;
  hours_per_shift: number;
}

export const Flexible_manufacturing_roiInputSchema = z.object({
  annual_production_volume: z.number().min(1000).max(10000000).default(100000),
  avg_batch_size: z.number().min(10).max(100000).default(500),
  current_setup_time: z.number().min(1).max(1440).default(120),
  target_setup_time: z.number().min(1).max(1440).default(15),
  hourly_operating_cost: z.number().min(10).max(500).default(85),
  changeover_cost_per_hour: z.number().min(20).max(1000).default(150),
  inventory_holding_cost_rate: z.number().min(5).max(50).default(25),
  avg_inventory_value: z.number().min(10000).max(100000000).default(2000000),
  fms_investment: z.number().min(10000).max(10000000).default(500000),
  fms_useful_life: z.number().min(3).max(20).default(10),
  discount_rate: z.number().min(0).max(30).default(8),
  product_variants: z.number().min(1).max(1000).default(20),
  quality_defect_rate: z.number().min(0).max(20).default(2.5),
  fms_quality_improvement: z.number().min(0).max(100).default(40),
  cost_per_defect: z.number().min(1).max(1000).default(50),
  labor_productivity_gain: z.number().min(0).max(50).default(15),
  floor_space_reduction: z.number().min(0).max(60).default(20),
  annual_floor_space_cost: z.number().min(1).max(100).default(12),
  current_floor_space: z.number().min(1000).max(1000000).default(50000),
  energy_cost_reduction: z.number().min(0).max(40).default(10),
  annual_energy_cost: z.number().min(10000).max(5000000).default(200000),
  maintenance_cost_increase: z.number().min(0).max(30).default(5),
  annual_maintenance_cost: z.number().min(10000).max(2000000).default(150000),
  training_cost: z.number().min(0).max(500000).default(50000),
  implementation_time: z.number().min(1).max(24).default(6),
  production_days_per_year: z.number().min(100).max(365).default(250),
  shifts_per_day: z.number().min(1).max(3).default(2),
  hours_per_shift: z.number().min(6).max(12).default(8),
});

function evaluateAllFormulas(input: Flexible_manufacturing_roiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_production_volume / input.avg_batch_size; results["annual_changeovers"] = Number.isFinite(v) ? v : 0; } catch { results["annual_changeovers"] = 0; }
  try { const v = input.current_setup_time - input.target_setup_time; results["setup_time_savings_per_changeover"] = Number.isFinite(v) ? v : 0; } catch { results["setup_time_savings_per_changeover"] = 0; }
  try { const v = ((results["annual_changeovers"] ?? 0) * (results["setup_time_savings_per_changeover"] ?? 0)) / 60; results["annual_setup_time_savings_hours"] = Number.isFinite(v) ? v : 0; } catch { results["annual_setup_time_savings_hours"] = 0; }
  try { const v = (results["annual_setup_time_savings_hours"] ?? 0) * input.changeover_cost_per_hour; results["annual_changeover_cost_savings"] = Number.isFinite(v) ? v : 0; } catch { results["annual_changeover_cost_savings"] = 0; }
  try { const v = input.avg_inventory_value * (input.inventory_holding_cost_rate / 100) * 0.3; results["inventory_savings"] = Number.isFinite(v) ? v : 0; } catch { results["inventory_savings"] = 0; }
  try { const v = input.annual_production_volume * (input.quality_defect_rate / 100) * (input.fms_quality_improvement / 100) * input.cost_per_defect; results["quality_cost_savings"] = Number.isFinite(v) ? v : 0; } catch { results["quality_cost_savings"] = 0; }
  try { const v = (results["annual_setup_time_savings_hours"] ?? 0) * input.hourly_operating_cost * 0.6 * (input.labor_productivity_gain / 100); results["labor_productivity_savings"] = Number.isFinite(v) ? v : 0; } catch { results["labor_productivity_savings"] = 0; }
  try { const v = input.current_floor_space * (input.floor_space_reduction / 100) * input.annual_floor_space_cost; results["floor_space_savings"] = Number.isFinite(v) ? v : 0; } catch { results["floor_space_savings"] = 0; }
  try { const v = input.annual_energy_cost * (input.energy_cost_reduction / 100); results["energy_savings"] = Number.isFinite(v) ? v : 0; } catch { results["energy_savings"] = 0; }
  try { const v = input.annual_maintenance_cost * (input.maintenance_cost_increase / 100); results["maintenance_cost_change"] = Number.isFinite(v) ? v : 0; } catch { results["maintenance_cost_change"] = 0; }
  try { const v = (results["annual_changeover_cost_savings"] ?? 0) + (results["inventory_savings"] ?? 0) + (results["quality_cost_savings"] ?? 0) + (results["labor_productivity_savings"] ?? 0) + (results["floor_space_savings"] ?? 0) + (results["energy_savings"] ?? 0) - (results["maintenance_cost_change"] ?? 0); results["total_annual_benefits"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_benefits"] = 0; }
  try { const v = input.fms_investment + input.training_cost; results["total_initial_investment"] = Number.isFinite(v) ? v : 0; } catch { results["total_initial_investment"] = 0; }
  try { const v = (results["total_annual_benefits"] ?? 0) * ((1 - (1 + input.discount_rate/100)^(-input.fms_useful_life)) / (input.discount_rate/100)) - (results["total_initial_investment"] ?? 0); results["net_present_value"] = Number.isFinite(v) ? v : 0; } catch { results["net_present_value"] = 0; }
  try { const v = ((results["net_present_value"] ?? 0) / (results["total_initial_investment"] ?? 0)) * 100; results["roi_percentage"] = Number.isFinite(v) ? v : 0; } catch { results["roi_percentage"] = 0; }
  try { const v = (results["total_initial_investment"] ?? 0) / (results["total_annual_benefits"] ?? 0); results["payback_period"] = Number.isFinite(v) ? v : 0; } catch { results["payback_period"] = 0; }
  try { const v = input.discount_rate + ((results["net_present_value"] ?? 0) / ((results["total_initial_investment"] ?? 0) * input.fms_useful_life)) * 100; results["internal_rate_of_return"] = Number.isFinite(v) ? v : 0; } catch { results["internal_rate_of_return"] = 0; }
  return results;
}


export function calculateFlexible_manufacturing_roi(input: Flexible_manufacturing_roiInput): Flexible_manufacturing_roiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roi_percentage"] ?? 0;
  const breakdown = {
    annual_changeover_cost_savings: values["annual_changeover_cost_savings"] ?? 0,
    inventory_savings: values["inventory_savings"] ?? 0,
    quality_cost_savings: values["quality_cost_savings"] ?? 0,
    labor_productivity_savings: values["labor_productivity_savings"] ?? 0,
    floor_space_savings: values["floor_space_savings"] ?? 0,
    energy_savings: values["energy_savings"] ?? 0,
    maintenance_cost_change: values["maintenance_cost_change"] ?? 0,
    total_annual_benefits: values["total_annual_benefits"] ?? 0,
    total_initial_investment: values["total_initial_investment"] ?? 0,
    net_present_value: values["net_present_value"] ?? 0,
    payback_period: values["payback_period"] ?? 0,
    internal_rate_of_return: values["internal_rate_of_return"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unplanned Downtime","Changeover Quality Losses","Underutilized Labor During Changeovers","Excess Movement and Transport","Inventory Obsolescence"];
  const suggestedActions: string[] = ["Implement SMED (Single-Minute Exchange of Die)","Adopt Kanban and Pull Production","Implement Total Productive Maintenance (TPM)","Cross-Train Operators","Invest in Automated Guided Vehicles (AGVs)"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario comparison","Sensitivity analysis","Benchmarking against industry standards"],
  };
}


export interface Flexible_manufacturing_roiOutput {
  totalWasteCost: number;
  breakdown: { annual_changeover_cost_savings: number; inventory_savings: number; quality_cost_savings: number; labor_productivity_savings: number; floor_space_savings: number; energy_savings: number; maintenance_cost_change: number; total_annual_benefits: number; total_initial_investment: number; net_present_value: number; payback_period: number; internal_rate_of_return: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
