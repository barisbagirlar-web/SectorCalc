// Auto-generated from recast-mortgage-calculator-schema.json
import * as z from 'zod';

export interface Recast_mortgage_calculatorInput {
  currentBalance: number;
  annualInterestRate: number;
  remainingTerm: number;
  lumpSumPayment: number;
  recastFee: number;
  dataConfidence?: number;
}

export const Recast_mortgage_calculatorInputSchema = z.object({
  currentBalance: z.number().default(200000),
  annualInterestRate: z.number().default(4.5),
  remainingTerm: z.number().default(180),
  lumpSumPayment: z.number().default(50000),
  recastFee: z.number().default(250),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recast_mortgage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterestRate"] = Number.NaN; }
  try { const v = input.currentBalance - input.lumpSumPayment; results["newBalance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newBalance"] = Number.NaN; }
  return results;
}


export function calculateRecast_mortgage_calculator(input: Recast_mortgage_calculatorInput): Recast_mortgage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["newBalance"]);
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


export interface Recast_mortgage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
