// @ts-nocheck
// Auto-generated from cut-and-fill-calculator-schema.json
import * as z from 'zod';

export interface Cut_and_fill_calculatorInput {
  cutArea1: number;
  cutArea2: number;
  fillArea1: number;
  fillArea2: number;
  distance: number;
  shrinkageFactor: number;
}

export const Cut_and_fill_calculatorInputSchema = z.object({
  cutArea1: z.number().default(50),
  cutArea2: z.number().default(60),
  fillArea1: z.number().default(30),
  fillArea2: z.number().default(40),
  distance: z.number().default(100),
  shrinkageFactor: z.number().default(0.9),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cut_and_fill_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.cutArea1 + input.cutArea2) / 2) * input.distance; results["cutVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cutVolume"] = 0; }
  try { const v = ((input.fillArea1 + input.fillArea2) / 2) * input.distance; results["fillVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fillVolume"] = 0; }
  try { const v = (asFormulaNumber(results["fillVolume"])) / input.shrinkageFactor; results["adjustedFillVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedFillVolume"] = 0; }
  try { const v = (asFormulaNumber(results["cutVolume"])) - (asFormulaNumber(results["adjustedFillVolume"])); results["netVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCut_and_fill_calculator(input: Cut_and_fill_calculatorInput): Cut_and_fill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netVolume"]);
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


export interface Cut_and_fill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
