// Auto-generated from immediate-annuity-calculator-schema.json
import * as z from 'zod';

export interface Immediate_annuity_calculatorInput {
  principalAmount: number;
  annualInterestRate: number;
  paymentPeriodsPerYear: number;
  years: number;
  dataConfidence?: number;
}

export const Immediate_annuity_calculatorInputSchema = z.object({
  principalAmount: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  paymentPeriodsPerYear: z.number().default(12),
  years: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Immediate_annuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / input.paymentPeriodsPerYear; results["periodRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["periodRate"] = 0; }
  try { const v = input.years * input.paymentPeriodsPerYear; results["totalPeriods"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPeriods"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateImmediate_annuity_calculator(input: Immediate_annuity_calculatorInput): Immediate_annuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPeriods"]);
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


export interface Immediate_annuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
