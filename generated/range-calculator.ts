// Auto-generated from range-calculator-schema.json
import * as z from 'zod';

export interface Range_calculatorInput {
  minValue: number;
  maxValue: number;
  nominalValue: number;
  tolerance: number;
  dataConfidence?: number;
}

export const Range_calculatorInputSchema = z.object({
  minValue: z.number().default(0),
  maxValue: z.number().default(100),
  nominalValue: z.number().default(50),
  tolerance: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Range_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maxValue - input.minValue; results["range"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["range"] = 0; }
  try { const v = (input.minValue + input.maxValue) / 2; results["midrange"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["midrange"] = 0; }
  try { const v = input.tolerance - (input.maxValue - input.minValue); results["toleranceMargin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["toleranceMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRange_calculator(input: Range_calculatorInput): Range_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["range"]);
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


export interface Range_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
