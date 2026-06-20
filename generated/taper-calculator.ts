// Auto-generated from taper-calculator-schema.json
import * as z from 'zod';

export interface Taper_calculatorInput {
  largeDiameter: number;
  smallDiameter: number;
  length: number;
  referenceLength: number;
  dataConfidence?: number;
}

export const Taper_calculatorInputSchema = z.object({
  largeDiameter: z.number().default(100),
  smallDiameter: z.number().default(50),
  length: z.number().default(200),
  referenceLength: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Taper_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.largeDiameter - input.smallDiameter) / input.length; results["taperRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taperRatio"] = Number.NaN; }
  try { const v = ((input.largeDiameter - input.smallDiameter) / input.length) * input.referenceLength; results["taperPerRefLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taperPerRefLength"] = Number.NaN; }
  return results;
}


export function calculateTaper_calculator(input: Taper_calculatorInput): Taper_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["taperRatio"]);
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


export interface Taper_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
