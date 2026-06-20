// Auto-generated from morning-sickness-calculator-schema.json
import * as z from 'zod';

export interface Morning_sickness_calculatorInput {
  machine_age_years: number;
  downtime_hours: number;
  ambient_temperature_celsius: number;
  cold_starts_per_day: number;
  severity_factor: number;
  dataConfidence?: number;
}

export const Morning_sickness_calculatorInputSchema = z.object({
  machine_age_years: z.number().default(5),
  downtime_hours: z.number().default(12),
  ambient_temperature_celsius: z.number().default(20),
  cold_starts_per_day: z.number().default(1),
  severity_factor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Morning_sickness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.machine_age_years * 0.1; results["age_contribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["age_contribution"] = Number.NaN; }
  try { const v = input.downtime_hours / (input.downtime_hours + 24); results["downtime_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["downtime_factor"] = Number.NaN; }
  try { const v = input.ambient_temperature_celsius / 40; results["temp_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["temp_factor"] = Number.NaN; }
  try { const v = input.cold_starts_per_day * 0.05; results["cold_start_penalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cold_start_penalty"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["age_contribution"])) + (toNumericFormulaValue(results["downtime_factor"])) + (toNumericFormulaValue(results["temp_factor"])) + (toNumericFormulaValue(results["cold_start_penalty"]))) * input.severity_factor; results["msi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["msi"] = Number.NaN; }
  return results;
}


export function calculateMorning_sickness_calculator(input: Morning_sickness_calculatorInput): Morning_sickness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["msi"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
