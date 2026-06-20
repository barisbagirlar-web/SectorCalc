// Auto-generated from far-point-calculator-schema.json
import * as z from 'zod';

export interface Far_point_calculatorInput {
  observerHeight: number;
  targetHeight: number;
  earthRadius: number;
  refractionCoefficient: number;
  dataConfidence?: number;
}

export const Far_point_calculatorInputSchema = z.object({
  observerHeight: z.number().default(1.7),
  targetHeight: z.number().default(0),
  earthRadius: z.number().default(6371),
  refractionCoefficient: z.number().default(0.13),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Far_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.earthRadius / (1 - input.refractionCoefficient); results["effectiveRadius"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveRadius"] = Number.NaN; }
  try { const v = input.earthRadius / (1 - input.refractionCoefficient); results["effectiveRadius_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveRadius_aux"] = Number.NaN; }
  return results;
}


export function calculateFar_point_calculator(input: Far_point_calculatorInput): Far_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveRadius"]);
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


export interface Far_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
