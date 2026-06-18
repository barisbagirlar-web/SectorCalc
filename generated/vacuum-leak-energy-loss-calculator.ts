// @ts-nocheck
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
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vacuum_leak_energy_loss_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 * input.compressor_specific_power * input.operating_hours_per_year; results["annual_kwh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annual_kwh"] = 0; }
  try { const v = 1 * input.compressor_specific_power * input.operating_hours_per_year * 1 * input.electricity_cost_per_kwh; results["annual_energy_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annual_energy_cost"] = 0; }
  try { const v = 1 * input.compressor_specific_power * input.operating_hours_per_year * 1 * input.electricity_cost_per_kwh * (input.leak_diameter_mm); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.leak_diameter_mm; results["factor_leak_diameter_mm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_leak_diameter_mm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVacuum_leak_energy_loss_calculator(input: Vacuum_leak_energy_loss_calculatorInput): Vacuum_leak_energy_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Off-shift idle load","Leak or standby losses"];
  const suggestedActions: string[] = ["Meter validate kWh per shift","Prioritize top leak sources"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Custom reporting"],
  };
}


export interface Vacuum_leak_energy_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
