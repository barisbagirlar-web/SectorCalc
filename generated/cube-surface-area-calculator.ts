// Auto-generated from cube-surface-area-calculator-schema.json
import * as z from 'zod';

export interface Cube_surface_area_calculatorInput {
  sideLength: number;
  quantity: number;
  exposedFaces: number;
  unitConversionFactor: number;
  safetyMargin: number;
}

export const Cube_surface_area_calculatorInputSchema = z.object({
  sideLength: z.number().default(1),
  quantity: z.number().default(1),
  exposedFaces: z.number().default(6),
  unitConversionFactor: z.number().default(1),
  safetyMargin: z.number().default(0),
});

function evaluateAllFormulas(input: Cube_surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * input.exposedFaces * (input.sideLength ** 2) * input.unitConversionFactor * (1 + input.safetyMargin/100); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.sideLength; results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  try { const v = input.sideLength ** 2; results["faceArea___sideLength____2"] = Number.isFinite(v) ? v : 0; } catch { results["faceArea___sideLength____2"] = 0; }
  try { const v = input.quantity * input.exposedFaces * faceArea * input.unitConversionFactor; results["baseArea___quantity___exposedFaces___fac"] = Number.isFinite(v) ? v : 0; } catch { results["baseArea___quantity___exposedFaces___fac"] = 0; }
  try { const v = baseArea * (1 + input.safetyMargin/100); results["totalSurfaceArea___baseArea____1___safet"] = Number.isFinite(v) ? v : 0; } catch { results["totalSurfaceArea___baseArea____1___safet"] = 0; }
  try { const v = input.quantity * input.exposedFaces * (input.sideLength ** 2) * input.unitConversionFactor * (1 + input.safetyMargin/100); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateCube_surface_area_calculator(input: Cube_surface_area_calculatorInput): Cube_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
