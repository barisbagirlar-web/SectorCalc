// Auto-generated from morning-sickness-calculator-schema.json
import * as z from 'zod';

export interface Morning_sickness_calculatorInput {
  machine_age_years: number;
  downtime_hours: number;
  ambient_temperature_celsius: number;
  cold_starts_per_day: number;
  severity_factor: number;
}

export const Morning_sickness_calculatorInputSchema = z.object({
  machine_age_years: z.number().default(5),
  downtime_hours: z.number().default(12),
  ambient_temperature_celsius: z.number().default(20),
  cold_starts_per_day: z.number().default(1),
  severity_factor: z.number().default(1),
});

function evaluateAllFormulas(input: Morning_sickness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - Math.exp(-input.machine_age_years / 10); results["age_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["age_contribution"] = 0; }
  try { const v = input.downtime_hours / (input.downtime_hours + 24); results["downtime_factor"] = Number.isFinite(v) ? v : 0; } catch { results["downtime_factor"] = 0; }
  try { const v = Math.exp(-input.ambient_temperature_celsius / 30); results["temp_factor"] = Number.isFinite(v) ? v : 0; } catch { results["temp_factor"] = 0; }
  try { const v = ((results["age_contribution"] ?? 0) * 0.3 + (results["downtime_factor"] ?? 0) * 0.4 + (results["temp_factor"] ?? 0) * 0.3) * input.cold_starts_per_day * input.severity_factor; results["msi"] = Number.isFinite(v) ? v : 0; } catch { results["msi"] = 0; }
  return results;
}


export function calculateMorning_sickness_calculator(input: Morning_sickness_calculatorInput): Morning_sickness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["msi"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    premiumFeatures: [],
  };
}


export interface Morning_sickness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
