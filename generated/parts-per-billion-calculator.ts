// Auto-generated from parts-per-billion-calculator-schema.json
import * as z from 'zod';

export interface Parts_per_billion_calculatorInput {
  solute_mass_mg: number;
  solution_volume_L: number;
  solution_density_kg_per_L: number;
  gas_solute_volume_mL: number;
  total_gas_volume_L: number;
}

export const Parts_per_billion_calculatorInputSchema = z.object({
  solute_mass_mg: z.number().default(0),
  solution_volume_L: z.number().default(0),
  solution_density_kg_per_L: z.number().default(1),
  gas_solute_volume_mL: z.number().default(0),
  total_gas_volume_L: z.number().default(0),
});

function evaluateAllFormulas(input: Parts_per_billion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { const ppm_mass = input.solute_mass_mg && input.solution_volume_L ? (input.solute_mass_mg / (input.solution_volume_L * input.solution_density_kg_per_L)) : 0; const ppb_mass = ppm_mass * 1000; const mg_per_L = input.solution_volume_L ? input.solute_mass_mg / input.solution_volume_L : 0; const ppm_mass_exact = input.solution_density_kg_per_L ? mg_per_L / input.solution_density_kg_per_L : 0; const ppb_gas = input.gas_solute_volume_mL && input.total_gas_volume_L ? (input.gas_solute_volume_mL / (input.total_gas_volume_L * 1000)) * 1e9 : 0; const ppb = (input.solute_mass_mg || input.gas_solute_volume_mL) ? (ppb_mass || ppb_gas) : 0; return { ppb: ppb, mass_based_ppb: ppb_mass, gas_based_ppb: ppb_gas, concentration_mg_per_L: mg_per_L, concentration_ppm: ppm_mass_exact }; })(); results["compute"] = Number.isFinite(v) ? v : 0; } catch { results["compute"] = 0; }
  return results;
}


export function calculateParts_per_billion_calculator(input: Parts_per_billion_calculatorInput): Parts_per_billion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ppb"] ?? 0;
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


export interface Parts_per_billion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
