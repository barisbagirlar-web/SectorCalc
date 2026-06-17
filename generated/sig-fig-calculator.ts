// @ts-nocheck
// Auto-generated from sig-fig-calculator-schema.json
import * as z from 'zod';

export interface Sig_fig_calculatorInput {
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  operation: number;
}

export const Sig_fig_calculatorInputSchema = z.object({
  num1: z.number().default(0),
  num2: z.number().default(0),
  num3: z.number().default(0),
  num4: z.number().default(0),
  operation: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sig_fig_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.operation == 1 ? (input.num1 + input.num2 + input.num3 + input.num4) : (input.num1 * input.num2 * input.num3 * input.num4); results["rawResult"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawResult"] = 0; }
  try { const v = input.operation == 1 ? (input.num1 + input.num2 + input.num3 + input.num4) : (input.num1 * input.num2 * input.num3 * input.num4); results["rawResult_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawResult_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSig_fig_calculator(input: Sig_fig_calculatorInput): Sig_fig_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawResult_aux"]);
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


export interface Sig_fig_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
