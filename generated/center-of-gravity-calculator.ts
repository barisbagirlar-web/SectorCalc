// Auto-generated from center-of-gravity-calculator-schema.json
import * as z from 'zod';

export interface Center_of_gravity_calculatorInput {
  mass1: number;
  x1: number;
  y1: number;
  mass2: number;
  x2: number;
  y2: number;
  dataConfidence?: number;
}

export const Center_of_gravity_calculatorInputSchema = z.object({
  mass1: z.number().default(0),
  x1: z.number().default(0),
  y1: z.number().default(0),
  mass2: z.number().default(0),
  x2: z.number().default(0),
  y2: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Center_of_gravity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mass1 * input.x1 + input.mass2 * input.x2) / (input.mass1 + input.mass2); results["x_cg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["x_cg"] = Number.NaN; }
  try { const v = (input.mass1 * input.y1 + input.mass2 * input.y2) / (input.mass1 + input.mass2); results["y_cg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["y_cg"] = Number.NaN; }
  return results;
}


export function calculateCenter_of_gravity_calculator(input: Center_of_gravity_calculatorInput): Center_of_gravity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["x_cg"]);
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


export interface Center_of_gravity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
