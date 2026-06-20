// Auto-generated from cube-surface-area-calculator-schema.json
import * as z from 'zod';

export interface Cube_surface_area_calculatorInput {
  sideLength: number;
  quantity: number;
  exposedFaces: number;
  unitConversionFactor: number;
  safetyMargin: number;
  dataConfidence?: number;
}

export const Cube_surface_area_calculatorInputSchema = z.object({
  sideLength: z.number().default(1),
  quantity: z.number().default(1),
  exposedFaces: z.number().default(6),
  unitConversionFactor: z.number().default(1),
  safetyMargin: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cube_surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * input.exposedFaces * (input.sideLength ** 2) * input.unitConversionFactor * (1 + input.safetyMargin/100); results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  try { const v = input.sideLength; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown"] = Number.NaN; }
  try { const v = input.sideLength ** 2; results["faceArea___sideLength____2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["faceArea___sideLength____2"] = Number.NaN; }
  try { const v = input.quantity * input.exposedFaces * (input.sideLength ** 2) * input.unitConversionFactor * (1 + input.safetyMargin/100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCube_surface_area_calculator(input: Cube_surface_area_calculatorInput): Cube_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Cube_surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
