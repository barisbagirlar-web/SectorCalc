// Auto-generated from vacuum-leak-energy-loss-calculator-schema.json
import * as z from 'zod';

export interface Vacuum_leak_energy_loss_calculatorInput {
  leak_diameter_mm: number;
  system_pressure_bar: number;
  operating_hours_per_year: number;
  electricity_cost_per_kwh: number;
  compressor_specific_power: number;
  ambient_temperature_c: number;
  leak_type: string;
  include_carbon_cost: boolean;
  emission_factor_kg_co2_per_kwh: number;
}

export const Vacuum_leak_energy_loss_calculatorInputSchema = z.object({
  leak_diameter_mm: z.number().min(0.1).max(50).default(2),
  system_pressure_bar: z.number().min(1).max(15).default(7),
  operating_hours_per_year: z.number().min(1000).max(8760).default(8000),
  electricity_cost_per_kwh: z.number().min(0.01).max(0.5).default(0.12),
  compressor_specific_power: z.number().min(10).max(30).default(18),
  ambient_temperature_c: z.number().min(-10).max(50).default(25),
  leak_type: z.enum(['round', 'sharp', 'long']).default('round'),
  include_carbon_cost: z.boolean().default(true),
  emission_factor_kg_co2_per_kwh: z.number().min(0.1).max(1.5).default(0.5),
});

function evaluateAllFormulas(input: Vacuum_leak_energy_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.leak_type === 'round' ? 0.62 : (input.leak_type === 'sharp' ? 0.85 : (input.leak_type === 'long' ? 0.50 : 0))); results["discharge_coefficient"] = Number.isFinite(v) ? v : 0; } catch { results["discharge_coefficient"] = 0; }
  try { const v = Math.PI * (input.leak_diameter_mm / 2000)**2; results["orifice_area_m2"] = Number.isFinite(v) ? v : 0; } catch { results["orifice_area_m2"] = 0; }
  try { const v = (input.system_pressure_bar + 1.01325) * 100000; results["absolute_pressure_pa"] = Number.isFinite(v) ? v : 0; } catch { results["absolute_pressure_pa"] = 0; }
  try { const v = (results["absolute_pressure_pa"] ?? 0) / (287.058 * (input.ambient_temperature_c + 273.15)); results["air_density_kg_per_m3"] = Number.isFinite(v) ? v : 0; } catch { results["air_density_kg_per_m3"] = 0; }
  try { const v = (results["discharge_coefficient"] ?? 0) * (results["orifice_area_m2"] ?? 0) * Math.sqrt(2 * (results["air_density_kg_per_m3"] ?? 0) * ((results["absolute_pressure_pa"] ?? 0) - 101325)); results["mass_flow_rate_kg_per_s"] = Number.isFinite(v) ? v : 0; } catch { results["mass_flow_rate_kg_per_s"] = 0; }
  try { const v = (results["mass_flow_rate_kg_per_s"] ?? 0) * (3600 / 1.225) * 0.5886; results["volumetric_flow_rate_cfm"] = Number.isFinite(v) ? v : 0; } catch { results["volumetric_flow_rate_cfm"] = 0; }
  try { const v = ((results["volumetric_flow_rate_cfm"] ?? 0) / 100) * input.compressor_specific_power; results["power_loss_kw"] = Number.isFinite(v) ? v : 0; } catch { results["power_loss_kw"] = 0; }
  try { const v = (results["power_loss_kw"] ?? 0) * input.operating_hours_per_year; results["annual_energy_loss_kwh"] = Number.isFinite(v) ? v : 0; } catch { results["annual_energy_loss_kwh"] = 0; }
  try { const v = (results["annual_energy_loss_kwh"] ?? 0) * input.electricity_cost_per_kwh; results["annual_cost_usd"] = Number.isFinite(v) ? v : 0; } catch { results["annual_cost_usd"] = 0; }
  results["annual_co2_kg"] = 0;
  try { const v = (results["annual_co2_kg"] ?? 0) * 0.05; results["annual_carbon_cost_usd"] = Number.isFinite(v) ? v : 0; } catch { results["annual_carbon_cost_usd"] = 0; }
  try { const v = (results["annual_cost_usd"] ?? 0) + (results["annual_carbon_cost_usd"] ?? 0); results["total_annual_cost_usd"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_cost_usd"] = 0; }
  return results;
}


export function calculateVacuum_leak_energy_loss_calculator(input: Vacuum_leak_energy_loss_calculatorInput): Vacuum_leak_energy_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_cost_usd"] ?? 0;
  const breakdown = {
    annual_energy_loss_kwh: values["annual_energy_loss_kwh"] ?? 0,
    annual_cost_usd: values["annual_cost_usd"] ?? 0,
    annual_co2_kg: values["annual_co2_kg"] ?? 0,
    annual_carbon_cost_usd: values["annual_carbon_cost_usd"] ?? 0,
    power_loss_kw: values["power_loss_kw"] ?? 0,
    volumetric_flow_rate_cfm: values["volumetric_flow_rate_cfm"] ?? 0,
    mass_flow_rate_kg_per_s: values["mass_flow_rate_kg_per_s"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Leak Diameter Sensitivity","Pressure Sensitivity","Operating Hours Sensitivity"];
  const suggestedActions: string[] = ["Perform ultrasonic leak detection survey to locate and tag all leaks. Target: repair leaks > 2 mm within 1 week.","Implement a leak management program with quarterly audits and repair KPIs (e.g., < 5% leakage rate).","Consider installing variable speed drive (VSD) compressors to match supply with demand and reduce baseline leakage impact.","Evaluate system pressure reduction: lowering pressure by 1 bar can save 7-10% in energy costs.","Train maintenance staff on proper fitting, hose, and connection inspection to prevent future leaks."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Custom reporting"],
  };
}


export interface Vacuum_leak_energy_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: { annual_energy_loss_kwh: number; annual_cost_usd: number; annual_co2_kg: number; annual_carbon_cost_usd: number; power_loss_kw: number; volumetric_flow_rate_cfm: number; mass_flow_rate_kg_per_s: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
