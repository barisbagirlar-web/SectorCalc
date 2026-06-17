// @ts-nocheck
// Auto-generated from exterior-paint-calculator-schema.json
import * as z from 'zod';

export interface Exterior_paint_calculatorInput {
  totalWallArea: number;
  numberOfCoats: number;
  paintCoverage: number;
  wasteFactor: number;
  doorArea: number;
  windowArea: number;
  otherOpeningsArea: number;
}

export const Exterior_paint_calculatorInputSchema = z.object({
  totalWallArea: z.number().default(100),
  numberOfCoats: z.number().default(2),
  paintCoverage: z.number().default(10),
  wasteFactor: z.number().default(10),
  doorArea: z.number().default(2),
  windowArea: z.number().default(5),
  otherOpeningsArea: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Exterior_paint_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalWallArea - (input.doorArea + input.windowArea + input.otherOpeningsArea); results["netArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netArea"] = 0; }
  try { const v = (asFormulaNumber(results["netArea"])) * (1 + input.wasteFactor / 100); results["effectiveArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveArea"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveArea"])) * input.numberOfCoats / input.paintCoverage; results["paintNeeded"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["paintNeeded"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateExterior_paint_calculator(input: Exterior_paint_calculatorInput): Exterior_paint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netArea"]);
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


export interface Exterior_paint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
