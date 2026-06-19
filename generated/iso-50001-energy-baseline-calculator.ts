// Auto-generated from iso-50001-energy-baseline-calculator-schema.json
import * as z from 'zod';

export interface Iso_50001_energy_baseline_calculatorInput {
  total_energy_consumption: number;
  production_volume: number;
  heating_degree_days: number;
  cooling_degree_days: number;
  operating_hours: number;
  energy_source_mix: string;
  baseline_type: string;
  use_weather_normalization: boolean;
  dataConfidence?: number;
}

export const Iso_50001_energy_baseline_calculatorInputSchema = z.object({
  total_energy_consumption: z.number().min(0).max(1000000000).default(0),
  production_volume: z.number().min(0).max(1000000000).default(0),
  heating_degree_days: z.number().min(0).max(10000).default(0),
  cooling_degree_days: z.number().min(0).max(10000).default(0),
  operating_hours: z.number().min(0).max(8760).default(8760),
  energy_source_mix: z.enum(['Electricity only', 'Natural gas + Electricity', 'Oil + Electricity', 'Renewable + Grid', 'Mixed (3+ sources)']).default('Electricity only'),
  baseline_type: z.enum(['Fixed baseline', 'Rolling baseline (3-year)', 'Rolling baseline (5-year)']).default('Fixed baseline'),
  use_weather_normalization: z.boolean().default(true),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Iso_50001_energy_baseline_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_energy_consumption * input.production_volume * input.heating_degree_days * input.cooling_degree_days; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.total_energy_consumption * input.production_volume * input.heating_degree_days * input.cooling_degree_days * (input.operating_hours); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.operating_hours; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateIso_50001_energy_baseline_calculator(input: Iso_50001_energy_baseline_calculatorInput): Iso_50001_energy_baseline_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Iso_50001_energy_baseline_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
