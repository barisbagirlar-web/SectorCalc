// @ts-nocheck
// Auto-generated from subtract-decimals-calculator-schema.json
import * as z from 'zod';

export interface Subtract_decimals_calculatorInput {
  valueA: number;
  valueB: number;
  precision: number;
  offset: number;
}

export const Subtract_decimals_calculatorInputSchema = z.object({
  valueA: z.number().default(0),
  valueB: z.number().default(0),
  precision: z.number().default(2),
  offset: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Subtract_decimals_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.valueA - input.valueB; results["rawDifference"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawDifference"] = 0; }
  try { const v = input.valueA - input.valueB; results["rawDifference_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawDifference_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSubtract_decimals_calculator(input: Subtract_decimals_calculatorInput): Subtract_decimals_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawDifference_aux"]);
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


export interface Subtract_decimals_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
