// Auto-generated from iso-50001-energy-baseline-schema.json
import * as z from 'zod';

export interface Iso_50001_energy_baselineInput {
  total_energy_consumption: number;
  production_volume: number;
  heating_degree_days: number;
  cooling_degree_days: number;
  operating_hours: number;
  energy_source_mix: string;
  baseline_type: string;
  use_weather_normalization: boolean;
  use_production_normalization: boolean;
}

export const Iso_50001_energy_baselineInputSchema = z.object({
  total_energy_consumption: z.number().min(0).max(1000000000).default(0),
  production_volume: z.number().min(0).max(1000000000).default(0),
  heating_degree_days: z.number().min(0).max(10000).default(0),
  cooling_degree_days: z.number().min(0).max(10000).default(0),
  operating_hours: z.number().min(0).max(8760).default(8760),
  energy_source_mix: z.enum(['Electricity only', 'Natural gas + Electricity', 'Oil + Electricity', 'Renewable + Grid', 'Mixed (3+ sources)']).default('Electricity only'),
  baseline_type: z.enum(['Fixed baseline', 'Rolling baseline (3-year)', 'Rolling baseline (5-year)']).default('Fixed baseline'),
  use_weather_normalization: z.boolean().default(true),
  use_production_normalization: z.boolean().default(true),
});

function evaluateAllFormulas(input: Iso_50001_energy_baselineInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["weather_normalized_energy"] = input.total_energy_consumption / (1 + 0.02 * (input.heating_degree_days + input.cooling_degree_days) / 1000); } catch { results["weather_normalized_energy"] = 0; }
  try { results["production_normalized_energy"] = (results["weather_normalized_energy"] ?? 0) / input.production_volume; } catch { results["production_normalized_energy"] = 0; }
  try { results["energy_intensity"] = (results["production_normalized_energy"] ?? 0); } catch { results["energy_intensity"] = 0; }
  try { results["baseline_energy_intensity"] = baseline_energy_intensity_reference; } catch { results["baseline_energy_intensity"] = 0; }
  try { results["energy_performance_indicator"] = (((results["baseline_energy_intensity"] ?? 0) - (results["energy_intensity"] ?? 0)) / (results["baseline_energy_intensity"] ?? 0)) * 100; } catch { results["energy_performance_indicator"] = 0; }
  try { results["total_energy_cost_savings"] = (input.total_energy_consumption - ((results["energy_intensity"] ?? 0) * input.production_volume)) * 0.12; } catch { results["total_energy_cost_savings"] = 0; }
  try { results["primary_result"] = (results["energy_performance_indicator"] ?? 0); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateIso_50001_energy_baseline(input: Iso_50001_energy_baselineInput): Iso_50001_energy_baselineOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["energy_performance_indicator"] ?? 0;
  const breakdown = {
    weather_normalized_energy: values["weather_normalized_energy"] ?? 0,
    production_normalized_energy: values["production_normalized_energy"] ?? 0,
    energy_intensity: values["energy_intensity"] ?? 0,
    baseline_energy_intensity: values["baseline_energy_intensity"] ?? 0,
    total_energy_cost_savings: values["total_energy_cost_savings"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Weather Variation Impact","Production Variation Impact","Residual Energy Change"];
  const suggestedActions: string[] = ["Investigate residual energy increase","Optimize HVAC scheduling","Align production planning with energy tariffs","Implement energy monitoring system"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Automated EnPI reporting"],
  };
}


export interface Iso_50001_energy_baselineOutput {
  totalWasteCost: number;
  breakdown: { weather_normalized_energy: number; production_normalized_energy: number; energy_intensity: number; baseline_energy_intensity: number; total_energy_cost_savings: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
