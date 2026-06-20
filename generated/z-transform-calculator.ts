// Auto-generated from z-transform-calculator-schema.json
import * as z from 'zod';

export interface Z_transform_calculatorInput {
  a0: number;
  a1: number;
  a2: number;
  a3: number;
  z: number;
  dataConfidence?: number;
}

export const Z_transform_calculatorInputSchema = z.object({
  a0: z.number().default(1),
  a1: z.number().default(0),
  a2: z.number().default(0),
  a3: z.number().default(0),
  z: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Z_transform_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a0 + input.a1 / input.z + input.a2 / (input.z**2) + input.a3 / (input.z**3); results["X_z"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["X_z"] = Number.NaN; }
  try { const v = input.a0; results["term0"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term0"] = Number.NaN; }
  try { const v = input.a1 / input.z; results["term1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term1"] = Number.NaN; }
  try { const v = input.a2 / (input.z**2); results["term2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term2"] = Number.NaN; }
  try { const v = input.a3 / (input.z**3); results["term3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term3"] = Number.NaN; }
  return results;
}


export function calculateZ_transform_calculator(input: Z_transform_calculatorInput): Z_transform_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["X_z"]);
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


export interface Z_transform_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
