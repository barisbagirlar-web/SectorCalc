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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Steam_trap_energy_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.steam_pressure * input.steam_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.steam_pressure * input.steam_cost; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.steam_pressure * input.steam_cost * 1 * (input.orifice_diameter * input.operating_hours_per_year); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.orifice_diameter; results["factor_orifice_diameter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_orifice_diameter"] = 0; }
  try { const v = input.operating_hours_per_year; results["factor_operating_hours_per_year"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_operating_hours_per_year"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSteam_trap_energy_loss_calculator(input: Steam_trap_energy_loss_calculatorInput): Steam_trap_energy_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
