// @ts-nocheck
// Auto-generated from 5x5-calculator-schema.json
import * as z from 'zod';

export interface _5x5_calculatorInput {
  sortScore: number;
  setOrderScore: number;
  shineScore: number;
  standardizeScore: number;
  sustainScore: number;
}

export const _5x5_calculatorInputSchema = z.object({
  sortScore: z.number().default(3),
  setOrderScore: z.number().default(3),
  shineScore: z.number().default(3),
  standardizeScore: z.number().default(3),
  sustainScore: z.number().default(3),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _5x5_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.sortScore + input.setOrderScore + input.shineScore + input.standardizeScore + input.sustainScore; results["total"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total"] = 0; }
  try { const v = (input.sortScore + input.setOrderScore + input.shineScore + input.standardizeScore + input.sustainScore) / 5; results["average"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["average"] = 0; }
  try { const v = (input.sortScore + input.setOrderScore + input.shineScore + input.standardizeScore + input.sustainScore) / 25 * 100; results["percentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["percentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculate_5x5_calculator(input: _5x5_calculatorInput): _5x5_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["percentage"]);
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


export interface _5x5_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
