// Auto-generated from wind-turbine-roi-calculator-schema.json
import * as z from 'zod';

export interface Wind_turbine_roi_calculatorInput {
  turbine_capacity: number;
  capacity_factor: number;
  capital_cost_per_mw: number;
  opex_per_mwh: number;
  electricity_price: number;
  discount_rate: number;
  project_lifetime: number;
  degradation_rate: number;
  incentive_tax_credit: number;
  grid_availability: number;
  turbine_type: string;
  maintenance_strategy: string;
}

export const Wind_turbine_roi_calculatorInputSchema = z.object({
  turbine_capacity: z.number().min(0.5).max(15).default(2),
  capacity_factor: z.number().min(10).max(60).default(35),
  capital_cost_per_mw: z.number().min(800000).max(2500000).default(1300000),
  opex_per_mwh: z.number().min(5).max(30).default(12),
  electricity_price: z.number().min(20).max(150).default(50),
  discount_rate: z.number().min(3).max(20).default(8),
  project_lifetime: z.number().min(10).max(30).default(20),
  degradation_rate: z.number().min(0).max(2).default(0.5),
  incentive_tax_credit: z.number().min(0).max(30).default(0),
  grid_availability: z.number().min(85).max(100).default(97),
  turbine_type: z.enum(['Onshore - Geared', 'Onshore - Direct Drive', 'Offshore - Fixed Bottom', 'Offshore - Floating']).default('Onshore - Geared'),
  maintenance_strategy: z.enum(['Corrective', 'Preventive', 'Condition-Based', 'Predictive']).default('Preventive'),
});

function evaluateAllFormulas(input: Wind_turbine_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.turbine_capacity * 8760 * (input.capacity_factor / 100) * (input.grid_availability / 100); results["annual_energy_production"] = Number.isFinite(v) ? v : 0; } catch { results["annual_energy_production"] = 0; }
  try { const v = (results["annual_energy_production"] ?? 0) * ((1 - input.degradation_rate / 100) ^ (n - 1)); results["degraded_energy_year_n"] = Number.isFinite(v) ? v : 0; } catch { results["degraded_energy_year_n"] = 0; }
  try { const v = (results["degraded_energy_year_n"] ?? 0) * (input.electricity_price + input.incentive_tax_credit); results["annual_revenue"] = Number.isFinite(v) ? v : 0; } catch { results["annual_revenue"] = 0; }
  try { const v = (results["degraded_energy_year_n"] ?? 0) * input.opex_per_mwh; results["annual_opex"] = Number.isFinite(v) ? v : 0; } catch { results["annual_opex"] = 0; }
  try { const v = (results["annual_revenue"] ?? 0) - (results["annual_opex"] ?? 0); results["net_cash_flow_year_n"] = Number.isFinite(v) ? v : 0; } catch { results["net_cash_flow_year_n"] = 0; }
  results["npv"] = 0;
  try { const v = IRR(net_cash_flow_array, initial_investment); results["irr"] = Number.isFinite(v) ? v : 0; } catch { results["irr"] = 0; }
  return results;
}


export function calculateWind_turbine_roi_calculator(input: Wind_turbine_roi_calculatorInput): Wind_turbine_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary_result"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Grid Curtailment Loss (MWh)","Degradation Loss (MWh)","OPEX Efficiency Gap (USD)"];
  const suggestedActions: string[] = ["Negotiate improved grid connection agreements or invest in on-site storage to reduce curtailment.","Implement predictive maintenance and blade leading-edge protection to lower degradation rate.","Adopt condition-based maintenance and remote monitoring to reduce O&M costs (Lean/Six Sigma DMAIC).","Explore power purchase agreement renegotiation or merchant price hedging."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario comparison","Sensitivity analysis"],
  };
}


export interface Wind_turbine_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
