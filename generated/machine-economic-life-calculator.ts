// Auto-generated from machine-economic-life-calculator-schema.json
import * as z from 'zod';

export interface Machine_economic_life_calculatorInput {
  purchase_price: number;
  salvage_value: number;
  useful_life_years: number;
  annual_operating_cost: number;
  operating_cost_escalation_rate: number;
  discount_rate: number;
  annual_production_units: number;
  revenue_per_unit: number;
  quality_defect_rate: number;
  defect_rate_annual_increase: number;
  maintenance_strategy: string;
  utilization_rate: number;
  energy_cost_per_kwh: number;
  power_consumption_kw: number;
}

export const Machine_economic_life_calculatorInputSchema = z.object({
  purchase_price: z.number().min(1000).max(10000000).default(100000),
  salvage_value: z.number().min(0).max(5000000).default(10000),
  useful_life_years: z.number().min(1).max(50).default(10),
  annual_operating_cost: z.number().min(0).max(1000000).default(15000),
  operating_cost_escalation_rate: z.number().min(0).max(20).default(3),
  discount_rate: z.number().min(0).max(30).default(8),
  annual_production_units: z.number().min(0).max(10000000).default(50000),
  revenue_per_unit: z.number().min(0).max(1000).default(5),
  quality_defect_rate: z.number().min(0).max(100).default(1),
  defect_rate_annual_increase: z.number().min(0).max(10).default(0.5),
  maintenance_strategy: z.enum(['Preventive', 'Predictive', 'Reactive']).default('Preventive'),
  utilization_rate: z.number().min(0).max(100).default(85),
  energy_cost_per_kwh: z.number().min(0).max(1).default(0.12),
  power_consumption_kw: z.number().min(0).max(10000).default(50),
});

function evaluateAllFormulas(input: Machine_economic_life_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["annual_operating_cost_year_n"] = input.annual_operating_cost * (1 + input.operating_cost_escalation_rate / 100) ^ (n - 1); } catch { results["annual_operating_cost_year_n"] = 0; }
  try { results["annual_defect_cost"] = input.annual_production_units * (input.quality_defect_rate + input.defect_rate_annual_increase * (n - 1)) / 100 * (input.revenue_per_unit * 0.5); } catch { results["annual_defect_cost"] = 0; }
  try { results["annual_energy_cost"] = input.power_consumption_kw * 24 * 365 * (input.utilization_rate / 100) * input.energy_cost_per_kwh; } catch { results["annual_energy_cost"] = 0; }
  try { results["total_annual_cost_year_n"] = (results["annual_operating_cost_year_n"] ?? 0) + (results["annual_defect_cost"] ?? 0) + (results["annual_energy_cost"] ?? 0); } catch { results["total_annual_cost_year_n"] = 0; }
  results["npv_of_costs"] = 0;
  results["economic_life"] = 0;
  try { results["primary_result"] = (results["economic_life"] ?? 0); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateMachine_economic_life_calculator(input: Machine_economic_life_calculatorInput): Machine_economic_life_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["optimal_economic_life"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Quality Degradation","Energy Inefficiency","Maintenance Cost Escalation","Opportunity Cost of Downtime"];
  const suggestedActions: string[] = ["Implement predictive maintenance using IoT sensors to reduce unplanned downtime.","Conduct a Six Sigma DMAIC project to reduce defect rate by 50%.","Evaluate energy-efficient upgrades or replacement if energy cost exceeds 20% of total cost.","Perform a sensitivity analysis on discount rate and escalation rate to validate economic life.","Benchmark machine OEE against industry standards (WERC/ISO 22400)."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Sensitivity analysis","Benchmarking against industry standards"],
  };
}


export interface Machine_economic_life_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
