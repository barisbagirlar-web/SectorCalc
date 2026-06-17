// @ts-nocheck
// Auto-generated from far-point-calculator-schema.json
import * as z from 'zod';

export interface Far_point_calculatorInput {
  observerHeight: number;
  targetHeight: number;
  earthRadius: number;
  refractionCoefficient: number;
}

export const Far_point_calculatorInputSchema = z.object({
  observerHeight: z.number().default(1.7),
  targetHeight: z.number().default(0),
  earthRadius: z.number().default(6371),
  refractionCoefficient: z.number().default(0.13),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Far_point_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.earthRadius / (1 - input.refractionCoefficient); results["effectiveRadius"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveRadius"] = 0; }
  try { const v = input.earthRadius / (1 - input.refractionCoefficient); results["effectiveRadius_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveRadius_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFar_point_calculator(input: Far_point_calculatorInput): Far_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveRadius"]);
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


export interface Far_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
