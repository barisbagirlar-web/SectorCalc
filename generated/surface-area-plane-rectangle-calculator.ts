// @ts-nocheck
// Auto-generated from surface-area-plane-rectangle-calculator-schema.json
import * as z from 'zod';

export interface Surface_area_plane_rectangle_calculatorInput {
  slopeX: number;
  slopeY: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const Surface_area_plane_rectangle_calculatorInputSchema = z.object({
  slopeX: z.number().default(0),
  slopeY: z.number().default(0),
  xMin: z.number().default(0),
  xMax: z.number().default(1),
  yMin: z.number().default(0),
  yMax: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Surface_area_plane_rectangle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.xMax - input.xMin) * (input.yMax - input.yMin); results["rectangleArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rectangleArea"] = 0; }
  try { const v = (input.xMax - input.xMin) * (input.yMax - input.yMin); results["rectangleArea_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rectangleArea_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSurface_area_plane_rectangle_calculator(input: Surface_area_plane_rectangle_calculatorInput): Surface_area_plane_rectangle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rectangleArea_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
