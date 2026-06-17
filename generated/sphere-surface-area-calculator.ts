// Auto-generated from sphere-surface-area-calculator-schema.json
import * as z from 'zod';

export interface Sphere_surface_area_calculatorInput {
  radius: number;
  diameter: number;
  inputType: number;
  outputUnit: number;
  costPerSquareMeter: number;
  wasteFactor: number;
}

export const Sphere_surface_area_calculatorInputSchema = z.object({
  radius: z.number().default(1),
  diameter: z.number().default(2),
  inputType: z.number().default(0),
  outputUnit: z.number().default(0),
  costPerSquareMeter: z.number().default(0),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Sphere_surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inputType === 0 ? input.radius : input.diameter / 2; results["radiusUsed"] = Number.isFinite(v) ? v : 0; } catch { results["radiusUsed"] = 0; }
  try { const v = 4 * Math.PI * Math.pow((results["radiusUsed"] ?? 0), 2); results["areaM2"] = Number.isFinite(v) ? v : 0; } catch { results["areaM2"] = 0; }
  try { const v = input.outputUnit === 0 ? 1 : input.outputUnit === 1 ? 10000 : input.outputUnit === 2 ? 1000000 : input.outputUnit === 3 ? 10.7639 : 1; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = (results["areaM2"] ?? 0) * (results["conversionFactor"] ?? 0); results["convertedArea"] = Number.isFinite(v) ? v : 0; } catch { results["convertedArea"] = 0; }
  try { const v = (results["areaM2"] ?? 0) * input.costPerSquareMeter * (1 + input.wasteFactor / 100); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  results["_radiusUsed__m"] = 0;
  try { const v = (results["areaM2"] ?? 0); results["_areaM2_"] = Number.isFinite(v) ? v : 0; } catch { results["_areaM2_"] = 0; }
  try { const v = (results["convertedArea"] ?? 0); results["_convertedArea_"] = Number.isFinite(v) ? v : 0; } catch { results["_convertedArea_"] = 0; }
  try { const v = (results["totalCost"] ?? 0); results["_totalCost_"] = Number.isFinite(v) ? v : 0; } catch { results["_totalCost_"] = 0; }
  return results;
}


export function calculateSphere_surface_area_calculator(input: Sphere_surface_area_calculatorInput): Sphere_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["convertedArea"] ?? 0;
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


export interface Sphere_surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
