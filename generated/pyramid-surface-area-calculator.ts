// Auto-generated from pyramid-surface-area-calculator-schema.json
import * as z from 'zod';

export interface Pyramid_surface_area_calculatorInput {
  baseSide: number;
  height: number;
  slantHeight: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Pyramid_surface_area_calculatorInputSchema = z.object({
  baseSide: z.number().default(5),
  height: z.number().default(4),
  slantHeight: z.number().default(0),
  wasteFactor: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pyramid_surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseSide * input.height * input.slantHeight * (input.wasteFactor / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.baseSide * input.height * input.slantHeight * (input.wasteFactor / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePyramid_surface_area_calculator(input: Pyramid_surface_area_calculatorInput): Pyramid_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Pyramid_surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
