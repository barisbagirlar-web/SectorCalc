// Auto-generated from lcm-calculator-schema.json
import * as z from 'zod';

export interface Lcm_calculatorInput {
  acquisition_cost: number;
  expected_life_years: number;
  annual_operating_hours: number;
  maintenance_strategy: string;
  labor_rate: number;
  parts_cost_per_incident: number;
  downtime_cost_per_hour: number;
  energy_cost_per_kwh: number;
  power_rating_kw: number;
  inflation_rate: number;
  discount_rate: number;
  data_confidence: number;
}

export const Lcm_calculatorInputSchema = z.object({
  acquisition_cost: z.number().min(0).max(10000000).default(100000),
  expected_life_years: z.number().min(1).max(50).default(10),
  annual_operating_hours: z.number().min(0).max(8760).default(2000),
  maintenance_strategy: z.enum(['preventive', 'predictive', 'reactive']).default('preventive'),
  labor_rate: z.number().min(0).max(500).default(50),
  parts_cost_per_incident: z.number().min(0).max(100000).default(500),
  downtime_cost_per_hour: z.number().min(0).max(100000).default(1000),
  energy_cost_per_kwh: z.number().min(0).max(1).default(0.12),
  power_rating_kw: z.number().min(0).max(10000).default(50),
  inflation_rate: z.number().min(0).max(20).default(2.5),
  discount_rate: z.number().min(0).max(20).default(5),
  data_confidence: z.number().min(0).max(100).default(80),
});

function evaluateAllFormulas(input: Lcm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["annual_maintenance_frequency"] = 0;
  try { results["annual_maintenance_labor_cost"] = (results["annual_maintenance_frequency"] ?? 0) * (2 * input.labor_rate); } catch { results["annual_maintenance_labor_cost"] = 0; }
  try { results["annual_parts_cost"] = (results["annual_maintenance_frequency"] ?? 0) * input.parts_cost_per_incident; } catch { results["annual_parts_cost"] = 0; }
  try { results["annual_energy_cost"] = input.annual_operating_hours * input.power_rating_kw * input.energy_cost_per_kwh; } catch { results["annual_energy_cost"] = 0; }
  try { results["annual_downtime_cost"] = (results["annual_maintenance_frequency"] ?? 0) * 0.5 * input.downtime_cost_per_hour; } catch { results["annual_downtime_cost"] = 0; }
  try { results["total_annual_maintenance_cost"] = (results["annual_maintenance_labor_cost"] ?? 0) + (results["annual_parts_cost"] ?? 0) + (results["annual_energy_cost"] ?? 0) + (results["annual_downtime_cost"] ?? 0); } catch { results["total_annual_maintenance_cost"] = 0; }
  try { results["net_present_value_maintenance"] = (results["total_annual_maintenance_cost"] ?? 0) * ((1 - (1 + input.discount_rate/100)^(-input.expected_life_years)) / (input.discount_rate/100)); } catch { results["net_present_value_maintenance"] = 0; }
  try { results["total_life_cycle_cost"] = input.acquisition_cost + (results["net_present_value_maintenance"] ?? 0); } catch { results["total_life_cycle_cost"] = 0; }
  return results;
}


export function calculateLcm_calculator(input: Lcm_calculatorInput): Lcm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_life_cycle_cost"] ?? 0;
  const breakdown = {
    acquisition_cost: values["acquisition_cost"] ?? 0,
    net_present_value_maintenance: values["net_present_value_maintenance"] ?? 0,
    annual_maintenance_labor_cost: values["annual_maintenance_labor_cost"] ?? 0,
    annual_parts_cost: values["annual_parts_cost"] ?? 0,
    annual_energy_cost: values["annual_energy_cost"] ?? 0,
    annual_downtime_cost: values["annual_downtime_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Energy Inefficiency","Excessive Downtime","High Parts Inventory"];
  const suggestedActions: string[] = ["Switch to Predictive Maintenance","Conduct Energy Audit","Implement Reliability Improvement Program","Optimize Spare Parts Inventory"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards"],
  };
}


export interface Lcm_calculatorOutput {
  totalWasteCost: number;
  breakdown: { acquisition_cost: number; net_present_value_maintenance: number; annual_maintenance_labor_cost: number; annual_parts_cost: number; annual_energy_cost: number; annual_downtime_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
