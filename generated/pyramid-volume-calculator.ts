// Auto-generated from pyramid-volume-calculator-schema.json
import * as z from 'zod';

export interface Pyramid_volume_calculatorInput {
  length: number;
  width: number;
  height: number;
  quantity: number;
  dataConfidence?: number;
}

export const Pyramid_volume_calculatorInputSchema = z.object({
  length: z.number().default(1),
  width: z.number().default(1),
  height: z.number().default(1),
  quantity: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pyramid_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["baseArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseArea"] = Number.NaN; }
  try { const v = (input.length * input.width * input.height / 3) * input.quantity; results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volume"] = Number.NaN; }
  return results;
}


export function calculatePyramid_volume_calculator(input: Pyramid_volume_calculatorInput): Pyramid_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["volume"]);
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


export interface Pyramid_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
