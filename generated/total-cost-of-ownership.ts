// Auto-generated from total-cost-of-ownership-schema.json
import * as z from 'zod';

export interface Total_cost_of_ownershipInput {
  purchase_price: number;
  annual_energy_cost: number;
  annual_maintenance_cost: number;
  annual_labor_cost: number;
  annual_consumables_cost: number;
  useful_life_years: number;
  salvage_value: number;
  discount_rate: number;
  inflation_rate: number;
  utilization_hours_per_year: number;
  downtime_cost_per_hour: number;
  expected_downtime_hours_per_year: number;
  training_cost_per_operator: number;
  number_of_operators: number;
  environmental_compliance_cost_per_year: number;
  asset_type: string;
  depreciation_method: string;
  include_downtime: boolean;
}

export const Total_cost_of_ownershipInputSchema = z.object({
  purchase_price: z.number().min(0).max(10000000).default(100000),
  annual_energy_cost: z.number().min(0).max(500000).default(12000),
  annual_maintenance_cost: z.number().min(0).max(500000).default(8000),
  annual_labor_cost: z.number().min(0).max(1000000).default(50000),
  annual_consumables_cost: z.number().min(0).max(200000).default(3000),
  useful_life_years: z.number().min(1).max(50).default(10),
  salvage_value: z.number().min(0).max(5000000).default(10000),
  discount_rate: z.number().min(0).max(30).default(5),
  inflation_rate: z.number().min(0).max(20).default(2),
  utilization_hours_per_year: z.number().min(0).max(8760).default(2000),
  downtime_cost_per_hour: z.number().min(0).max(100000).default(500),
  expected_downtime_hours_per_year: z.number().min(0).max(8760).default(100),
  training_cost_per_operator: z.number().min(0).max(50000).default(2000),
  number_of_operators: z.number().min(1).max(100).default(2),
  environmental_compliance_cost_per_year: z.number().min(0).max(500000).default(5000),
  asset_type: z.enum(['manufacturing', 'logistics', 'energy', 'construction']).default('manufacturing'),
  depreciation_method: z.enum(['straight_line', 'declining_balance', 'sum_of_years_digits']).default('straight_line'),
  include_downtime: z.boolean().default(true),
});

function evaluateAllFormulas(input: Total_cost_of_ownershipInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.depreciation_method == 'straight_line') ? ((input.purchase_price - input.salvage_value) / input.useful_life_years) : (((input.depreciation_method == 'declining_balance') ? ((input.purchase_price - input.salvage_value) * (2 / input.useful_life_years)) : ((input.purchase_price - input.salvage_value) * (2 * (input.useful_life_years - 0) / (input.useful_life_years * (input.useful_life_years + 1))))))); results["annual_depreciation"] = Number.isFinite(v) ? v : 0; } catch { results["annual_depreciation"] = 0; }
  try { const v = (input.annual_energy_cost + input.annual_maintenance_cost + input.annual_labor_cost + input.annual_consumables_cost + input.environmental_compliance_cost_per_year) * (1 + input.inflation_rate / 100); results["total_annual_operating_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_operating_cost"] = 0; }
  try { const v = ((input.include_downtime) ? (input.expected_downtime_hours_per_year * input.downtime_cost_per_hour) : (0)); results["annual_downtime_cost"] = Number.isFinite(v) ? v : 0; } catch { results["annual_downtime_cost"] = 0; }
  try { const v = input.training_cost_per_operator * input.number_of_operators; results["total_training_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_training_cost"] = 0; }
  try { const v = ((results["total_annual_operating_cost"] ?? 0) + (results["annual_downtime_cost"] ?? 0)) * ((1 - (1 + input.discount_rate / 100) ^ (-input.useful_life_years)) / (input.discount_rate / 100)); results["npv_operating_costs"] = Number.isFinite(v) ? v : 0; } catch { results["npv_operating_costs"] = 0; }
  try { const v = (results["annual_depreciation"] ?? 0) * 0.3 * ((1 - (1 + input.discount_rate / 100) ^ (-input.useful_life_years)) / (input.discount_rate / 100)); results["npv_depreciation_tax_shield"] = Number.isFinite(v) ? v : 0; } catch { results["npv_depreciation_tax_shield"] = 0; }
  try { const v = input.purchase_price + (results["npv_operating_costs"] ?? 0) + (results["total_training_cost"] ?? 0) - (input.salvage_value / (1 + input.discount_rate / 100) ^ input.useful_life_years) - (results["npv_depreciation_tax_shield"] ?? 0); results["primaryResult"] = Number.isFinite(v) ? v : 0; } catch { results["primaryResult"] = 0; }
  return results;
}


export function calculateTotal_cost_of_ownership(input: Total_cost_of_ownershipInput): Total_cost_of_ownershipOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryResult"] ?? 0;
  const breakdown = {
    purchase_price: values["purchase_price"] ?? 0,
    npv_operating_costs: values["npv_operating_costs"] ?? 0,
    total_training_cost: values["total_training_cost"] ?? 0,
    npv_depreciation_tax_shield: values["npv_depreciation_tax_shield"] ?? 0,
    salvage_value_pv: values["salvage_value_pv"] ?? 0,
    annual_downtime_cost: values["annual_downtime_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Energy Inefficiency","Excessive Downtime","High Training Burden"];
  const suggestedActions: string[] = ["Implement Energy Efficiency Program","Adopt Predictive Maintenance","Standardize Operator Training","Review Depreciation Method"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Custom depreciation schedules"],
  };
}


export interface Total_cost_of_ownershipOutput {
  totalWasteCost: number;
  breakdown: { purchase_price: number; npv_operating_costs: number; total_training_cost: number; npv_depreciation_tax_shield: number; salvage_value_pv: number; annual_downtime_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
