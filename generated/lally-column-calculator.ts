// @ts-nocheck
// Auto-generated from lally-column-calculator-schema.json
import * as z from 'zod';

export interface Lally_column_calculatorInput {
  column_height: number;
  outer_diameter: number;
  wall_thickness: number;
  steel_yield_strength: number;
  effective_length_factor: number;
  safety_factor: number;
  youngs_modulus: number;
}

export const Lally_column_calculatorInputSchema = z.object({
  column_height: z.number().default(2.5),
  outer_diameter: z.number().default(89),
  wall_thickness: z.number().default(3),
  steel_yield_strength: z.number().default(250),
  effective_length_factor: z.number().default(1),
  safety_factor: z.number().default(1.5),
  youngs_modulus: z.number().default(200000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lally_column_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (Math.PI/4 * (input.outer_diameter**2 - (input.outer_diameter - 2*input.wall_thickness)**2) * input.steel_yield_strength) / input.safety_factor / 1000; results["allowable_yield_load"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["allowable_yield_load"] = 0; }
  try { const v = (Math.PI**2 * input.youngs_modulus * (Math.PI/64 * (input.outer_diameter**4 - (input.outer_diameter - 2*input.wall_thickness)**4)) / ((input.effective_length_factor * input.column_height * 1000)**2)) / input.safety_factor / 1000; results["allowable_euler_load"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["allowable_euler_load"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLally_column_calculator(input: Lally_column_calculatorInput): Lally_column_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["allowable_euler_load"]);
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Lally_column_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
