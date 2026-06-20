// Auto-generated from ml-to-cups-calculator-schema.json
import * as z from 'zod';

export interface Ml_to_cups_calculatorInput {
  milliliters: number;
  cupSize: number;
  decimals: number;
  quantity: number;
  dataConfidence?: number;
}

export const Ml_to_cups_calculatorInputSchema = z.object({
  milliliters: z.number().default(0),
  cupSize: z.number().default(236.5882365),
  decimals: z.number().default(2),
  quantity: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ml_to_cups_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.milliliters * input.quantity; results["totalMl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMl"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMl"])) / input.cupSize; results["rawCups"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawCups"] = Number.NaN; }
  return results;
}


export function calculateMl_to_cups_calculator(input: Ml_to_cups_calculatorInput): Ml_to_cups_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawCups"]);
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


export interface Ml_to_cups_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
