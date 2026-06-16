// Auto-generated from cylinder-surface-area-calculator-schema.json
import * as z from 'zod';

export interface Cylinder_surface_area_calculatorInput {
  outerRadius: number;
  innerRadius: number;
  height: number;
  includeEnds: number;
}

export const Cylinder_surface_area_calculatorInputSchema = z.object({
  outerRadius: z.number().default(1),
  innerRadius: z.number().default(0.5),
  height: z.number().default(2),
  includeEnds: z.number().default(1),
});

function evaluateAllFormulas(input: Cylinder_surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * Math.PI * input.outerRadius * input.height; results["externalLateral"] = Number.isFinite(v) ? v : 0; } catch { results["externalLateral"] = 0; }
  try { const v = 2 * Math.PI * input.innerRadius * input.height; results["internalLateral"] = Number.isFinite(v) ? v : 0; } catch { results["internalLateral"] = 0; }
  try { const v = 2 * Math.PI * (Math.pow(input.outerRadius, 2) - Math.pow(input.innerRadius, 2)); results["endAreas"] = Number.isFinite(v) ? v : 0; } catch { results["endAreas"] = 0; }
  try { const v = (results["externalLateral"] ?? 0) + (results["internalLateral"] ?? 0) + (input.includeEnds * (results["endAreas"] ?? 0)); results["totalSurfaceArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalSurfaceArea"] = 0; }
  return results;
}


export function calculateCylinder_surface_area_calculator(input: Cylinder_surface_area_calculatorInput): Cylinder_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSurfaceArea"] ?? 0;
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


export interface Cylinder_surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
