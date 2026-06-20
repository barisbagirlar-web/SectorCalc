// Auto-generated from lens-equation-calculator-schema.json
import * as z from 'zod';

export interface Lens_equation_calculatorInput {
  refractiveIndex: number;
  radius1: number;
  radius2: number;
  objectDistance: number;
  objectHeight: number;
  dataConfidence?: number;
}

export const Lens_equation_calculatorInputSchema = z.object({
  refractiveIndex: z.number().default(1.5),
  radius1: z.number().default(30),
  radius2: z.number().default(-30),
  objectDistance: z.number().default(100),
  objectHeight: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lens_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / ((input.refractiveIndex - 1) * (1/input.radius1 - 1/input.radius2)); results["focalLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["focalLength"] = Number.NaN; }
  try { const v = 1 / (1/(toNumericFormulaValue(results["focalLength"])) - 1/input.objectDistance); results["imageDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["imageDistance"] = Number.NaN; }
  try { const v = -(toNumericFormulaValue(results["imageDistance"])) / input.objectDistance; results["magnification"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["magnification"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["magnification"])) * input.objectHeight; results["imageHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["imageHeight"] = Number.NaN; }
  return results;
}


export function calculateLens_equation_calculator(input: Lens_equation_calculatorInput): Lens_equation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["imageHeight"]);
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


export interface Lens_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
