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
  try { const v = input.leak_diameter_mm + input.system_pressure_bar + input.operating_hours_per_year; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.leak_diameter_mm + input.system_pressure_bar + input.operating_hours_per_year; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
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
