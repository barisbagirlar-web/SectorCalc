// Auto-generated from carbon-footprint-calculator-schema.json
import * as z from 'zod';

export interface Carbon_footprint_calculatorInput {
  electricity_kwh: number;
  natural_gas_therms: number;
  fuel_diesel_liters: number;
  fuel_gasoline_liters: number;
  waste_tonnes: number;
  business_travel_km: number;
  region: string;
  data_quality_score: number;
}

export const Carbon_footprint_calculatorInputSchema = z.object({
  electricity_kwh: z.number().min(0).max(100000000).default(0),
  natural_gas_therms: z.number().min(0).max(1000000).default(0),
  fuel_diesel_liters: z.number().min(0).max(10000000).default(0),
  fuel_gasoline_liters: z.number().min(0).max(10000000).default(0),
  waste_tonnes: z.number().min(0).max(100000).default(0),
  business_travel_km: z.number().min(0).max(10000000).default(0),
  region: z.enum(['US', 'EU', 'UK', 'China', 'India', 'Global Average']).default('US'),
  data_quality_score: z.number().min(1).max(5).default(3),
});

function evaluateAllFormulas(input: Carbon_footprint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.natural_gas_therms * 0.0053) + (input.fuel_diesel_liters * 0.00268) + (input.fuel_gasoline_liters * 0.00231); results["scope1_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["scope1_emissions"] = 0; }
  try { const v = input.electricity_kwh * (input.region === 'US' ? 0.000417 : (input.region === 'EU' ? 0.000276 : (input.region === 'UK' ? 0.000233 : (input.region === 'China' ? 0.000555 : (input.region === 'India' ? 0.000708 : 0.000475))))); results["scope2_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["scope2_emissions"] = 0; }
  try { const v = (input.waste_tonnes * 0.6) + (input.business_travel_km * 0.00015); results["scope3_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["scope3_emissions"] = 0; }
  try { const v = (results["scope1_emissions"] ?? 0) + (results["scope2_emissions"] ?? 0) + (results["scope3_emissions"] ?? 0); results["total_emissions_tco2e"] = Number.isFinite(v) ? v : 0; } catch { results["total_emissions_tco2e"] = 0; }
  try { const v = (results["total_emissions_tco2e"] ?? 0) / 1000000; results["emissions_per_revenue"] = Number.isFinite(v) ? v : 0; } catch { results["emissions_per_revenue"] = 0; }
  try { const v = 1 - (0.2 * (5 - input.data_quality_score)); results["data_confidence_factor"] = Number.isFinite(v) ? v : 0; } catch { results["data_confidence_factor"] = 0; }
  try { const v = (results["total_emissions_tco2e"] ?? 0) * (results["data_confidence_factor"] ?? 0); results["confidence_adjusted_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["confidence_adjusted_emissions"] = 0; }
  return results;
}


export function calculateCarbon_footprint_calculator(input: Carbon_footprint_calculatorInput): Carbon_footprint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_emissions_tco2e"] ?? 0;
  const breakdown = {
    scope1: values["scope1"] ?? 0,
    scope2: values["scope2"] ?? 0,
    scope3: values["scope3"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Energy Inefficiency","Fleet Fuel Mix","Waste Management"];
  const suggestedActions: string[] = ["Conduct Energy Audit","Electrify Fleet Vehicles","Switch to Renewable Energy","Implement Waste Reduction Program","Optimize Business Travel"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Automated reduction target setting"],
  };
}


export interface Carbon_footprint_calculatorOutput {
  totalWasteCost: number;
  breakdown: { scope1: number; scope2: number; scope3: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
