// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Morning_sickness_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.downtime_hours / (input.downtime_hours + 24); results["downtime_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["downtime_factor"] = 0; }
  try { const v = input.downtime_hours / (input.downtime_hours + 24); results["downtime_factor_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["downtime_factor_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMorning_sickness_calculator(input: Morning_sickness_calculatorInput): Morning_sickness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["downtime_factor_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
