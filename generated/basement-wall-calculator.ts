// Auto-generated from basement-wall-calculator-schema.json
import * as z from 'zod';

export interface Basement_wall_calculatorInput {
  wall_length: number;
  wall_height: number;
  wall_thickness: number;
  concrete_strength: number;
  steel_ratio: number;
  soil_pressure: number;
  dataConfidence?: number;
}

export const Basement_wall_calculatorInputSchema = z.object({
  wall_length: z.number().default(10),
  wall_height: z.number().default(3),
  wall_thickness: z.number().default(0.3),
  concrete_strength: z.number().default(25),
  steel_ratio: z.number().default(1.5),
  soil_pressure: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Basement_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wall_length * input.wall_height * input.wall_thickness; results["wall_volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wall_volume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wall_volume"])) * (1 - input.steel_ratio / 100); results["concrete_volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["concrete_volume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wall_volume"])) * (input.steel_ratio / 100); results["steel_volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["steel_volume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["steel_volume"])) * 7850; results["steel_weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["steel_weight"] = Number.NaN; }
  try { const v = input.concrete_strength * input.wall_thickness * input.wall_thickness / 6; results["moment_capacity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["moment_capacity"] = Number.NaN; }
  try { const v = input.soil_pressure * input.wall_height * input.wall_length / 2; results["lateral_load"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lateral_load"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["moment_capacity"])) / ((toNumericFormulaValue(results["lateral_load"])) * input.wall_height / 3); results["safety_factor_moment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["safety_factor_moment"] = Number.NaN; }
  return results;
}


export function calculateBasement_wall_calculator(input: Basement_wall_calculatorInput): Basement_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["wall_volume"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Basement_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
