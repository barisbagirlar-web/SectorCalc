// Auto-generated from lens-equation-calculator-schema.json
import * as z from 'zod';

export interface Lens_equation_calculatorInput {
  refractiveIndex: number;
  radius1: number;
  radius2: number;
  objectDistance: number;
  objectHeight: number;
}

export const Lens_equation_calculatorInputSchema = z.object({
  refractiveIndex: z.number().default(1.5),
  radius1: z.number().default(30),
  radius2: z.number().default(-30),
  objectDistance: z.number().default(100),
  objectHeight: z.number().default(10),
});

function evaluateAllFormulas(input: Lens_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / ((input.refractiveIndex - 1) * (1/input.radius1 - 1/input.radius2)); results["focalLength"] = Number.isFinite(v) ? v : 0; } catch { results["focalLength"] = 0; }
  try { const v = 1 / (1/(results["focalLength"] ?? 0) - 1/input.objectDistance); results["imageDistance"] = Number.isFinite(v) ? v : 0; } catch { results["imageDistance"] = 0; }
  try { const v = -(results["imageDistance"] ?? 0) / input.objectDistance; results["magnification"] = Number.isFinite(v) ? v : 0; } catch { results["magnification"] = 0; }
  try { const v = (results["magnification"] ?? 0) * input.objectHeight; results["imageHeight"] = Number.isFinite(v) ? v : 0; } catch { results["imageHeight"] = 0; }
  return results;
}


export function calculateLens_equation_calculator(input: Lens_equation_calculatorInput): Lens_equation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["imageHeight"] ?? 0;
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


export interface Lens_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
