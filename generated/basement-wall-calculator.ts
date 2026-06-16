// Auto-generated from basement-wall-calculator-schema.json
import * as z from 'zod';

export interface Basement_wall_calculatorInput {
  wall_length: number;
  wall_height: number;
  wall_thickness: number;
  concrete_strength: number;
  steel_ratio: number;
  soil_pressure: number;
}

export const Basement_wall_calculatorInputSchema = z.object({
  wall_length: z.number().default(10),
  wall_height: z.number().default(3),
  wall_thickness: z.number().default(0.3),
  concrete_strength: z.number().default(25),
  steel_ratio: z.number().default(1.5),
  soil_pressure: z.number().default(30),
});

function evaluateAllFormulas(input: Basement_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wall_length * input.wall_height * input.wall_thickness; results["wall_volume"] = Number.isFinite(v) ? v : 0; } catch { results["wall_volume"] = 0; }
  try { const v = (results["wall_volume"] ?? 0) * (1 - input.steel_ratio / 100); results["concrete_volume"] = Number.isFinite(v) ? v : 0; } catch { results["concrete_volume"] = 0; }
  try { const v = (results["wall_volume"] ?? 0) * (input.steel_ratio / 100); results["steel_volume"] = Number.isFinite(v) ? v : 0; } catch { results["steel_volume"] = 0; }
  try { const v = (results["steel_volume"] ?? 0) * 7850; results["steel_weight"] = Number.isFinite(v) ? v : 0; } catch { results["steel_weight"] = 0; }
  try { const v = input.concrete_strength * input.wall_thickness * input.wall_thickness / 6; results["moment_capacity"] = Number.isFinite(v) ? v : 0; } catch { results["moment_capacity"] = 0; }
  try { const v = 0.5 * Math.sqrt(input.concrete_strength) * input.wall_thickness * input.wall_height; results["shear_capacity"] = Number.isFinite(v) ? v : 0; } catch { results["shear_capacity"] = 0; }
  try { const v = input.soil_pressure * input.wall_height * input.wall_length / 2; results["lateral_load"] = Number.isFinite(v) ? v : 0; } catch { results["lateral_load"] = 0; }
  try { const v = (results["moment_capacity"] ?? 0) / ((results["lateral_load"] ?? 0) * input.wall_height / 3); results["safety_factor_moment"] = Number.isFinite(v) ? v : 0; } catch { results["safety_factor_moment"] = 0; }
  try { const v = (results["shear_capacity"] ?? 0) / (results["lateral_load"] ?? 0); results["safety_factor_shear"] = Number.isFinite(v) ? v : 0; } catch { results["safety_factor_shear"] = 0; }
  return results;
}


export function calculateBasement_wall_calculator(input: Basement_wall_calculatorInput): Basement_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["wall_volume"] ?? 0;
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


export interface Basement_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
