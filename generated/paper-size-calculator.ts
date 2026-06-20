// Auto-generated from paper-size-calculator-schema.json
import * as z from 'zod';

export interface Paper_size_calculatorInput {
  width: number;
  height: number;
  scalingPercent: number;
  gsm: number;
  quantity: number;
  dataConfidence?: number;
}

export const Paper_size_calculatorInputSchema = z.object({
  width: z.number().default(210),
  height: z.number().default(297),
  scalingPercent: z.number().default(100),
  gsm: z.number().default(80),
  quantity: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Paper_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.width * (input.scalingPercent / 100); results["newWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newWidth"] = Number.NaN; }
  try { const v = input.height * (input.scalingPercent / 100); results["newHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newHeight"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["newWidth"])) * (toNumericFormulaValue(results["newHeight"]))) / 1000000; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["area"])) * input.gsm * input.quantity; results["weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weight"] = Number.NaN; }
  return results;
}


export function calculatePaper_size_calculator(input: Paper_size_calculatorInput): Paper_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["weight"]);
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


export interface Paper_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
