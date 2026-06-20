// Auto-generated from binary-calculator-schema.json
import * as z from 'zod';

export interface Binary_calculatorInput {
  binary1: number;
  binary2: number;
  operation: number;
  dataConfidence?: number;
}

export const Binary_calculatorInputSchema = z.object({
  binary1: z.number().default(0),
  binary2: z.number().default(0),
  operation: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Binary_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.binary1; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown"] = Number.NaN; }
  try { const v = input.binary1; results["breakdown_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown_aux"] = Number.NaN; }
  return results;
}


export function calculateBinary_calculator(input: Binary_calculatorInput): Binary_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown"]);
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


export interface Binary_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
