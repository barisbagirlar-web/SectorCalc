// @ts-nocheck
// Auto-generated from options-calculator-schema.json
import * as z from 'zod';

export interface Options_calculatorInput {
  optionType: number;
  S: number;
  K: number;
  T: number;
  r: number;
  sigma: number;
}

export const Options_calculatorInputSchema = z.object({
  optionType: z.number().default(1),
  S: z.number().default(100),
  K: z.number().default(100),
  T: z.number().default(1),
  r: z.number().default(5),
  sigma: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Options_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.r / 100; results["r_dec"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["r_dec"] = 0; }
  try { const v = input.sigma / 100; results["sigma_dec"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sigma_dec"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOptions_calculator(input: Options_calculatorInput): Options_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sigma_dec"]);
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


export interface Options_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
