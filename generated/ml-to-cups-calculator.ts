// @ts-nocheck
// Auto-generated from ml-to-cups-calculator-schema.json
import * as z from 'zod';

export interface Ml_to_cups_calculatorInput {
  milliliters: number;
  cupSize: number;
  decimals: number;
  quantity: number;
}

export const Ml_to_cups_calculatorInputSchema = z.object({
  milliliters: z.number().default(0),
  cupSize: z.number().default(236.5882365),
  decimals: z.number().default(2),
  quantity: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ml_to_cups_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.milliliters * input.quantity; results["totalMl"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMl"] = 0; }
  try { const v = (asFormulaNumber(results["totalMl"])) / input.cupSize; results["rawCups"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawCups"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMl_to_cups_calculator(input: Ml_to_cups_calculatorInput): Ml_to_cups_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawCups"]);
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


export interface Ml_to_cups_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
