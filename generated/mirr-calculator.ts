// @ts-nocheck
// Auto-generated from mirr-calculator-schema.json
import * as z from 'zod';

export interface Mirr_calculatorInput {
  initialInvestment: number;
  cf1: number;
  cf2: number;
  cf3: number;
  cf4: number;
  cf5: number;
  financeRate: number;
  reinvestmentRate: number;
}

export const Mirr_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(-100000),
  cf1: z.number().default(20000),
  cf2: z.number().default(25000),
  cf3: z.number().default(30000),
  cf4: z.number().default(35000),
  cf5: z.number().default(40000),
  financeRate: z.number().default(10),
  reinvestmentRate: z.number().default(12),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mirr_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.initialInvestment + input.cf1 + input.cf2; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.initialInvestment + input.cf1 + input.cf2; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMirr_calculator(input: Mirr_calculatorInput): Mirr_calculatorOutput {
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


export interface Mirr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
