// Auto-generated from mirror-equation-calculator-schema.json
import * as z from 'zod';

export interface Mirror_equation_calculatorInput {
  objectDistance: number;
  radiusOfCurvature: number;
  mirrorTypeSign: number;
  objectHeight: number;
}

export const Mirror_equation_calculatorInputSchema = z.object({
  objectDistance: z.number().default(10),
  radiusOfCurvature: z.number().default(30),
  mirrorTypeSign: z.number().default(1),
  objectHeight: z.number().default(2),
});

function evaluateAllFormulas(input: Mirror_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mirrorTypeSign * Math.abs(input.radiusOfCurvature) / 2; results["focalLength"] = Number.isFinite(v) ? v : 0; } catch { results["focalLength"] = 0; }
  try { const v = 1 / (1 / (results["focalLength"] ?? 0) - 1 / input.objectDistance); results["imageDistance"] = Number.isFinite(v) ? v : 0; } catch { results["imageDistance"] = 0; }
  try { const v = -((results["imageDistance"] ?? 0) / input.objectDistance); results["magnification"] = Number.isFinite(v) ? v : 0; } catch { results["magnification"] = 0; }
  try { const v = (results["magnification"] ?? 0) * input.objectHeight; results["imageHeight"] = Number.isFinite(v) ? v : 0; } catch { results["imageHeight"] = 0; }
  return results;
}


export function calculateMirror_equation_calculator(input: Mirror_equation_calculatorInput): Mirror_equation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["imageDistance"] ?? 0;
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


export interface Mirror_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
