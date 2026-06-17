// @ts-nocheck
// Auto-generated from immediate-annuity-calculator-schema.json
import * as z from 'zod';

export interface Immediate_annuity_calculatorInput {
  principalAmount: number;
  annualInterestRate: number;
  paymentPeriodsPerYear: number;
  years: number;
}

export const Immediate_annuity_calculatorInputSchema = z.object({
  principalAmount: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  paymentPeriodsPerYear: z.number().default(12),
  years: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Immediate_annuity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annualInterestRate / 100 / input.paymentPeriodsPerYear; results["periodRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["periodRate"] = 0; }
  try { const v = input.years * input.paymentPeriodsPerYear; results["totalPeriods"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPeriods"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateImmediate_annuity_calculator(input: Immediate_annuity_calculatorInput): Immediate_annuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPeriods"]);
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


export interface Immediate_annuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
