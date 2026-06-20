// Auto-generated from vector-projection-calculator-schema.json
import * as z from 'zod';

export interface Vector_projection_calculatorInput {
  a_x: number;
  a_y: number;
  a_z: number;
  b_x: number;
  b_y: number;
  b_z: number;
  dataConfidence?: number;
}

export const Vector_projection_calculatorInputSchema = z.object({
  a_x: z.number().default(1),
  a_y: z.number().default(0),
  a_z: z.number().default(0),
  b_x: z.number().default(1),
  b_y: z.number().default(0),
  b_z: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vector_projection_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a_x * input.b_x + input.a_y * input.b_y + input.a_z * input.b_z; results["dotProduct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dotProduct"] = Number.NaN; }
  try { const v = input.a_x * input.b_x + input.a_y * input.b_y + input.a_z * input.b_z; results["dotProduct_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dotProduct_aux"] = Number.NaN; }
  return results;
}


export function calculateVector_projection_calculator(input: Vector_projection_calculatorInput): Vector_projection_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dotProduct_aux"]);
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


export interface Vector_projection_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
