// Auto-generated from nd-filter-calculator-schema.json
import * as z from 'zod';

export interface Nd_filter_calculatorInput {
  numerator: number;
  denominator: number;
  ndStops: number;
  od: number;
  dataConfidence?: number;
}

export const Nd_filter_calculatorInputSchema = z.object({
  numerator: z.number().default(1),
  denominator: z.number().default(125),
  ndStops: z.number().default(0),
  od: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nd_filter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numerator / input.denominator; results["baseShutter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseShutter"] = Number.NaN; }
  try { const v = input.ndStops > 0 ? input.ndStops : (input.od > 0 ? input.od / 0.3 : 0); results["effectiveStops"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveStops"] = Number.NaN; }
  return results;
}


export function calculateNd_filter_calculator(input: Nd_filter_calculatorInput): Nd_filter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveStops"]);
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


export interface Nd_filter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
