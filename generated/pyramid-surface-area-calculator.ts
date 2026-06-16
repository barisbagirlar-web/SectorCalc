// Auto-generated from pyramid-surface-area-calculator-schema.json
import * as z from 'zod';

export interface Pyramid_surface_area_calculatorInput {
  baseSide: number;
  height: number;
  slantHeight: number;
  wasteFactor: number;
}

export const Pyramid_surface_area_calculatorInputSchema = z.object({
  baseSide: z.number().default(5),
  height: z.number().default(4),
  slantHeight: z.number().default(0),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Pyramid_surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(Math.pow(input.height, 2) + Math.pow(input.baseSide / 2, 2)); results["slantHeightComputed"] = Number.isFinite(v) ? v : 0; } catch { results["slantHeightComputed"] = 0; }
  try { const v = input.slantHeight > 0 ? input.slantHeight : (results["slantHeightComputed"] ?? 0); results["effectiveSlant"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveSlant"] = 0; }
  try { const v = Math.pow(input.baseSide, 2); results["baseArea"] = Number.isFinite(v) ? v : 0; } catch { results["baseArea"] = 0; }
  try { const v = 2 * input.baseSide * (results["effectiveSlant"] ?? 0); results["lateralArea"] = Number.isFinite(v) ? v : 0; } catch { results["lateralArea"] = 0; }
  try { const v = (results["baseArea"] ?? 0) + (results["lateralArea"] ?? 0); results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (results["totalArea"] ?? 0) * (1 + input.wasteFactor / 100); results["finalArea"] = Number.isFinite(v) ? v : 0; } catch { results["finalArea"] = 0; }
  return results;
}


export function calculatePyramid_surface_area_calculator(input: Pyramid_surface_area_calculatorInput): Pyramid_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalArea"] ?? 0;
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


export interface Pyramid_surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
