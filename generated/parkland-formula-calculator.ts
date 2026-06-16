// Auto-generated from parkland-formula-calculator-schema.json
import * as z from 'zod';

export interface Parkland_formula_calculatorInput {
  weight_kg: number;
  tbsa_percent: number;
  fluid_factor: number;
  first_half_hours: number;
  second_half_hours: number;
}

export const Parkland_formula_calculatorInputSchema = z.object({
  weight_kg: z.number().default(70),
  tbsa_percent: z.number().default(20),
  fluid_factor: z.number().default(4),
  first_half_hours: z.number().default(8),
  second_half_hours: z.number().default(16),
});

function evaluateAllFormulas(input: Parkland_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight_kg * input.tbsa_percent * input.fluid_factor; results["total_volume_24h"] = Number.isFinite(v) ? v : 0; } catch { results["total_volume_24h"] = 0; }
  try { const v = (results["total_volume_24h"] ?? 0) * input.first_half_hours / (input.first_half_hours + input.second_half_hours); results["volume_first_half"] = Number.isFinite(v) ? v : 0; } catch { results["volume_first_half"] = 0; }
  try { const v = (results["total_volume_24h"] ?? 0) * input.second_half_hours / (input.first_half_hours + input.second_half_hours); results["volume_second_half"] = Number.isFinite(v) ? v : 0; } catch { results["volume_second_half"] = 0; }
  return results;
}


export function calculateParkland_formula_calculator(input: Parkland_formula_calculatorInput): Parkland_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_volume_24h"] ?? 0;
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


export interface Parkland_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
