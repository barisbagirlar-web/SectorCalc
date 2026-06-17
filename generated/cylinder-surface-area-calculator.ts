// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cylinder_surface_area_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 2 * Math.PI * input.outerRadius * input.height; results["externalLateral"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["externalLateral"] = 0; }
  try { const v = 2 * Math.PI * input.innerRadius * input.height; results["internalLateral"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["internalLateral"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCylinder_surface_area_calculator(input: Cylinder_surface_area_calculatorInput): Cylinder_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["internalLateral"]);
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


export interface Cylinder_surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
