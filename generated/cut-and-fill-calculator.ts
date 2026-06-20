// Auto-generated from cut-and-fill-calculator-schema.json
import * as z from 'zod';

export interface Cut_and_fill_calculatorInput {
  cutArea1: number;
  cutArea2: number;
  fillArea1: number;
  fillArea2: number;
  distance: number;
  shrinkageFactor: number;
  dataConfidence?: number;
}

export const Cut_and_fill_calculatorInputSchema = z.object({
  cutArea1: z.number().default(50),
  cutArea2: z.number().default(60),
  fillArea1: z.number().default(30),
  fillArea2: z.number().default(40),
  distance: z.number().default(100),
  shrinkageFactor: z.number().default(0.9),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cut_and_fill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.cutArea1 + input.cutArea2) / 2) * input.distance; results["cutVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cutVolume"] = Number.NaN; }
  try { const v = ((input.fillArea1 + input.fillArea2) / 2) * input.distance; results["fillVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fillVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fillVolume"])) / input.shrinkageFactor; results["adjustedFillVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedFillVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cutVolume"])) - (toNumericFormulaValue(results["adjustedFillVolume"])); results["netVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netVolume"] = Number.NaN; }
  return results;
}


export function calculateCut_and_fill_calculator(input: Cut_and_fill_calculatorInput): Cut_and_fill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netVolume"]);
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


export interface Cut_and_fill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
