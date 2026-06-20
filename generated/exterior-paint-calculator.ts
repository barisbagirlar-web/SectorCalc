// Auto-generated from exterior-paint-calculator-schema.json
import * as z from 'zod';

export interface Exterior_paint_calculatorInput {
  totalWallArea: number;
  numberOfCoats: number;
  paintCoverage: number;
  wasteFactor: number;
  doorArea: number;
  windowArea: number;
  otherOpeningsArea: number;
  dataConfidence?: number;
}

export const Exterior_paint_calculatorInputSchema = z.object({
  totalWallArea: z.number().default(100),
  numberOfCoats: z.number().default(2),
  paintCoverage: z.number().default(10),
  wasteFactor: z.number().default(10),
  doorArea: z.number().default(2),
  windowArea: z.number().default(5),
  otherOpeningsArea: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Exterior_paint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWallArea - (input.doorArea + input.windowArea + input.otherOpeningsArea); results["netArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netArea"])) * (1 + input.wasteFactor / 100); results["effectiveArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveArea"])) * input.numberOfCoats / input.paintCoverage; results["paintNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paintNeeded"] = Number.NaN; }
  return results;
}


export function calculateExterior_paint_calculator(input: Exterior_paint_calculatorInput): Exterior_paint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netArea"]);
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


export interface Exterior_paint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
