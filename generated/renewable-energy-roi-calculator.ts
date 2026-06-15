// Auto-generated from renewable-energy-roi-calculator-schema.json
import * as z from 'zod';

export interface Renewable_energy_roi_calculatorInput {
  system_capacity_kw: number;
  annual_energy_output_kwh: number;
  capital_cost_usd: number;
  annual_operating_cost_usd: number;
  electricity_price_usd_per_kwh: number;
  inflation_rate_percent: number;
  discount_rate_percent: number;
  system_lifetime_years: number;
  degradation_rate_percent: number;
  incentive_tax_credit_percent: number;
  carbon_credit_usd_per_ton: number;
  energy_source: string;
  include_carbon_benefits: boolean;
}

export const Renewable_energy_roi_calculatorInputSchema = z.object({
  system_capacity_kw: z.number().min(1).max(10000).default(100),
  annual_energy_output_kwh: z.number().min(0).max(10000000).default(150000),
  capital_cost_usd: z.number().min(1000).max(50000000).default(250000),
  annual_operating_cost_usd: z.number().min(0).max(1000000).default(5000),
  electricity_price_usd_per_kwh: z.number().min(0.01).max(0.5).default(0.12),
  inflation_rate_percent: z.number().min(0).max(20).default(2.5),
  discount_rate_percent: z.number().min(0).max(30).default(8),
  system_lifetime_years: z.number().min(1).max(50).default(25),
  degradation_rate_percent: z.number().min(0).max(5).default(0.5),
  incentive_tax_credit_percent: z.number().min(0).max(100).default(26),
  carbon_credit_usd_per_ton: z.number().min(0).max(200).default(50),
  energy_source: z.enum(['solar', 'wind', 'hydro', 'biomass', 'geothermal']).default('solar'),
  include_carbon_benefits: z.boolean().default(true),
});

function evaluateAllFormulas(input: Renewable_energy_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["annual_energy_degraded"] = 0;
  try { results["annual_savings"] = input.annual_energy_output_kwh * input.electricity_price_usd_per_kwh * (1 + input.inflation_rate_percent/100)^(year-1); } catch { results["annual_savings"] = 0; }
  results["carbon_revenue"] = 0;
  try { results["net_cash_flow"] = (results["annual_savings"] ?? 0) + (results["carbon_revenue"] ?? 0) - input.annual_operating_cost_usd; } catch { results["net_cash_flow"] = 0; }
  results["net_present_value"] = 0;
  results["internal_rate_of_return"] = 0;
  try { results["payback_period"] = capital_cost_after_incentive / average_annual_net_cash_flow; } catch { results["payback_period"] = 0; }
  return results;
}


export function calculateRenewable_energy_roi_calculator(input: Renewable_energy_roi_calculatorInput): Renewable_energy_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["net_present_value"] ?? 0;
  const breakdown = {
    total_energy_output_lifetime_kwh: values["total_energy_output_lifetime_kwh"] ?? 0,
    total_savings_lifetime_usd: values["total_savings_lifetime_usd"] ?? 0,
    total_carbon_revenue_lifetime_usd: values["total_carbon_revenue_lifetime_usd"] ?? 0,
    total_operating_cost_lifetime_usd: values["total_operating_cost_lifetime_usd"] ?? 0,
    capital_cost_after_incentive_usd: values["capital_cost_after_incentive_usd"] ?? 0,
    internal_rate_of_return_percent: values["internal_rate_of_return_percent"] ?? 0,
    payback_period_years: values["payback_period_years"] ?? 0,
    levelized_cost_of_energy_usd_per_kwh: values["levelized_cost_of_energy_usd_per_kwh"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Degradation Loss","Inflation Erosion","Discounting Impact","Operating Cost Escalation"];
  const suggestedActions: string[] = ["Improve Capacity Factor","Reduce Degradation Rate","Explore Additional Incentives","Negotiate O&M Contract","Register for Carbon Credits"];
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


export interface Renewable_energy_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: { total_energy_output_lifetime_kwh: number; total_savings_lifetime_usd: number; total_carbon_revenue_lifetime_usd: number; total_operating_cost_lifetime_usd: number; capital_cost_after_incentive_usd: number; internal_rate_of_return_percent: number; payback_period_years: number; levelized_cost_of_energy_usd_per_kwh: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
