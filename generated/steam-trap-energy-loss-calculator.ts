// @ts-nocheck
// Auto-generated from steam-trap-energy-loss-calculator-schema.json
import * as z from 'zod';

export interface Steam_trap_energy_loss_calculatorInput {
  orifice_diameter: number;
  steam_pressure: number;
  operating_hours_per_year: number;
  steam_cost: number;
  trap_type: string;
  failure_mode: string;
  condensate_recovery: boolean;
}

export const Steam_trap_energy_loss_calculatorInputSchema = z.object({
  orifice_diameter: z.number().min(0.5).max(25).default(3),
  steam_pressure: z.number().min(0.5).max(30).default(7),
  operating_hours_per_year: z.number().min(1000).max(8760).default(8000),
  steam_cost: z.number().min(5).max(100).default(25),
  trap_type: z.enum(['Float & Thermostatic', 'Thermodynamic', 'Inverted Bucket', 'Thermostatic', 'Orifice']).default('Float & Thermostatic'),
  failure_mode: z.enum(['Blow-through (fully open)', 'Leaking (partially open)', 'Blow-through (fully open)']).default('Blow-through (fully open)'),
  condensate_recovery: z.boolean().default(true),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Steam_trap_energy_loss_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.orifice_diameter + input.steam_pressure + input.operating_hours_per_year; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.orifice_diameter + input.steam_pressure + input.operating_hours_per_year; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSteam_trap_energy_loss_calculator(input: Steam_trap_energy_loss_calculatorInput): Steam_trap_energy_loss_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Automated report scheduling"],
  };
}


export interface Steam_trap_energy_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
