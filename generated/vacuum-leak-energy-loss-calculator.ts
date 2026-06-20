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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vacuum_leak_energy_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 * input.compressor_specific_power * input.operating_hours_per_year; results["annual_kwh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_kwh"] = Number.NaN; }
  try { const v = 1 * input.compressor_specific_power * input.operating_hours_per_year * 1 * input.electricity_cost_per_kwh; results["annual_energy_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_energy_cost"] = Number.NaN; }
  try { const v = 1 * input.compressor_specific_power * input.operating_hours_per_year * 1 * input.electricity_cost_per_kwh * (input.leak_diameter_mm); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.leak_diameter_mm; results["factor_leak_diameter_mm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_leak_diameter_mm"] = Number.NaN; }
  return results;
}


export function calculateVacuum_leak_energy_loss_calculator(input: Vacuum_leak_energy_loss_calculatorInput): Vacuum_leak_energy_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    annual_kwh: toNumericFormulaValue(values["annual_kwh"]),
    annual_energy_cost: toNumericFormulaValue(values["annual_energy_cost"]),
    factor_leak_diameter_mm: toNumericFormulaValue(values["factor_leak_diameter_mm"])
  };
  const hiddenLossDrivers: string[] = ["Off-shift idle load","Leak or standby losses"];
  const suggestedActions: string[] = ["Meter validate kWh per shift","Prioritize top leak sources"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Custom reporting"],
  };
}


export interface Vacuum_leak_energy_loss_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { annual_kwh: number; annual_energy_cost: number; factor_leak_diameter_mm: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vacuum_leak_energy_loss_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["annual_kwh","annual_energy_cost","factor_leak_diameter_mm"],
} as const;

