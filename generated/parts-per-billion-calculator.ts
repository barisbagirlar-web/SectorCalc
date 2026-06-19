// Auto-generated from parts-per-billion-calculator-schema.json
import * as z from 'zod';

export interface Parts_per_billion_calculatorInput {
  solute_mass_mg: number;
  solution_volume_L: number;
  solution_density_kg_per_L: number;
  gas_solute_volume_mL: number;
  total_gas_volume_L: number;
  dataConfidence?: number;
}

export const Parts_per_billion_calculatorInputSchema = z.object({
  solute_mass_mg: z.number().default(0),
  solution_volume_L: z.number().default(0),
  solution_density_kg_per_L: z.number().default(1),
  gas_solute_volume_mL: z.number().default(0),
  total_gas_volume_L: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Parts_per_billion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.solute_mass_mg * input.solution_volume_L * input.solution_density_kg_per_L * input.gas_solute_volume_mL; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.solute_mass_mg * input.solution_volume_L * input.solution_density_kg_per_L * input.gas_solute_volume_mL * (input.total_gas_volume_L); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.total_gas_volume_L; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateParts_per_billion_calculator(input: Parts_per_billion_calculatorInput): Parts_per_billion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Parts_per_billion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
