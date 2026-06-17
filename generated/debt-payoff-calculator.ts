// @ts-nocheck
// Auto-generated from debt-payoff-calculator-schema.json
import * as z from 'zod';

export interface Debt_payoff_calculatorInput {
  totalDebt: number;
  interestRate: number;
  monthlyPayment: number;
  extraPayment: number;
  numDebts: number;
}

export const Debt_payoff_calculatorInputSchema = z.object({
  totalDebt: z.number().default(10000),
  interestRate: z.number().default(5),
  monthlyPayment: z.number().default(500),
  extraPayment: z.number().default(0),
  numDebts: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Debt_payoff_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.monthlyPayment + input.extraPayment; results["totalMonthlyPayment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMonthlyPayment"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDebt_payoff_calculator(input: Debt_payoff_calculatorInput): Debt_payoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonthlyPayment"]);
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


export interface Debt_payoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
