// Auto-generated from vector-subtraction-calculator-schema.json
import * as z from 'zod';

export interface Vector_subtraction_calculatorInput {
  a_x: number;
  a_y: number;
  a_z: number;
  b_x: number;
  b_y: number;
  b_z: number;
  dataConfidence?: number;
}

export const Vector_subtraction_calculatorInputSchema = z.object({
  a_x: z.number().default(0),
  a_y: z.number().default(0),
  a_z: z.number().default(0),
  b_x: z.number().default(0),
  b_y: z.number().default(0),
  b_z: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vector_subtraction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a_x - input.b_x; results["result_x"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result_x"] = 0; }
  try { const v = input.a_y - input.b_y; results["result_y"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result_y"] = 0; }
  try { const v = input.a_z - input.b_z; results["result_z"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result_z"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVector_subtraction_calculator(input: Vector_subtraction_calculatorInput): Vector_subtraction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result_x"]);
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


export interface Vector_subtraction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
