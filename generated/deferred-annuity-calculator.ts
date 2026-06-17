// @ts-nocheck
// Auto-generated from deferred-annuity-calculator-schema.json
import * as z from 'zod';

export interface Deferred_annuity_calculatorInput {
  presentValue: number;
  annualInterestRate: number;
  deferralYears: number;
  payoutYears: number;
}

export const Deferred_annuity_calculatorInputSchema = z.object({
  presentValue: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  deferralYears: z.number().default(10),
  payoutYears: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deferred_annuity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.presentValue + input.annualInterestRate + input.deferralYears; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.presentValue + input.annualInterestRate + input.deferralYears; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDeferred_annuity_calculator(input: Deferred_annuity_calculatorInput): Deferred_annuity_calculatorOutput {
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


export interface Deferred_annuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
