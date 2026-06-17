// @ts-nocheck
// Auto-generated from one-sided-limit-calculator-schema.json
import * as z from 'zod';

export interface One_sided_limit_calculatorInput {
  mean: number;
  sd: number;
  n: number;
  zp: number;
  zgamma: number;
  direction: number;
}

export const One_sided_limit_calculatorInputSchema = z.object({
  mean: z.number().default(0),
  sd: z.number().default(1),
  n: z.number().default(30),
  zp: z.number().default(2.326),
  zgamma: z.number().default(1.645),
  direction: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: One_sided_limit_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.mean + input.sd + input.n; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.mean + input.sd + input.n; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOne_sided_limit_calculator(input: One_sided_limit_calculatorInput): One_sided_limit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface One_sided_limit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
