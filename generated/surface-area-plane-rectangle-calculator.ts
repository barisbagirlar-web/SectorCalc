// Auto-generated from surface-area-plane-rectangle-calculator-schema.json
import * as z from 'zod';

export interface Surface_area_plane_rectangle_calculatorInput {
  slopeX: number;
  slopeY: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  dataConfidence?: number;
}

export const Surface_area_plane_rectangle_calculatorInputSchema = z.object({
  slopeX: z.number().default(0),
  slopeY: z.number().default(0),
  xMin: z.number().default(0),
  xMax: z.number().default(1),
  yMin: z.number().default(0),
  yMax: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Surface_area_plane_rectangle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.xMax - input.xMin) * (input.yMax - input.yMin); results["rectangleArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rectangleArea"] = Number.NaN; }
  try { const v = (input.xMax - input.xMin) * (input.yMax - input.yMin); results["rectangleArea_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rectangleArea_aux"] = Number.NaN; }
  return results;
}


export function calculateSurface_area_plane_rectangle_calculator(input: Surface_area_plane_rectangle_calculatorInput): Surface_area_plane_rectangle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rectangleArea_aux"]);
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


export interface Surface_area_plane_rectangle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
