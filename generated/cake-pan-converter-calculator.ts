// @ts-nocheck
// Auto-generated from cake-pan-converter-calculator-schema.json
import * as z from 'zod';

export interface Cake_pan_converter_calculatorInput {
  originalShape: number;
  originalDim1: number;
  originalDim2: number;
  originalDepth: number;
  targetShape: number;
  targetDim1: number;
  targetDim2: number;
  targetDepth: number;
}

export const Cake_pan_converter_calculatorInputSchema = z.object({
  originalShape: z.number().default(1),
  originalDim1: z.number().default(20),
  originalDim2: z.number().default(0),
  originalDepth: z.number().default(5),
  targetShape: z.number().default(1),
  targetDim1: z.number().default(24),
  targetDim2: z.number().default(0),
  targetDepth: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cake_pan_converter_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.originalShape * input.originalDim1 * input.originalDim2 * input.originalDepth; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.originalShape * input.originalDim1 * input.originalDim2 * input.originalDepth * (input.targetShape * input.targetDim1 * input.targetDim2 * input.targetDepth); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.targetShape * input.targetDim1 * input.targetDim2 * input.targetDepth; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCake_pan_converter_calculator(input: Cake_pan_converter_calculatorInput): Cake_pan_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Cake_pan_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
