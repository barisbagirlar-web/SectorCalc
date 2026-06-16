// Auto-generated from regular-polygon-area-calculator-schema.json
import * as z from 'zod';

export interface Regular_polygon_area_calculatorInput {
  numberOfSides: number;
  sideLength: number;
  unitScale: number;
  decimals: number;
}

export const Regular_polygon_area_calculatorInputSchema = z.object({
  numberOfSides: z.number().default(6),
  sideLength: z.number().default(1),
  unitScale: z.number().default(1),
  decimals: z.number().default(2),
});

function evaluateAllFormulas(input: Regular_polygon_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.numberOfSides * input.sideLength ** 2 * Math.cos(Math.PI / input.numberOfSides)) / (4 * Math.sin(Math.PI / input.numberOfSides)); results["areaBase"] = Number.isFinite(v) ? v : 0; } catch { results["areaBase"] = 0; }
  try { const v = (results["areaBase"] ?? 0) * input.unitScale; results["areaScaled"] = Number.isFinite(v) ? v : 0; } catch { results["areaScaled"] = 0; }
  try { const v = Math.round((results["areaScaled"] ?? 0) * 10**input.decimals) / 10**input.decimals; results["roundArea"] = Number.isFinite(v) ? v : 0; } catch { results["roundArea"] = 0; }
  return results;
}


export function calculateRegular_polygon_area_calculator(input: Regular_polygon_area_calculatorInput): Regular_polygon_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundArea"] ?? 0;
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


export interface Regular_polygon_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
