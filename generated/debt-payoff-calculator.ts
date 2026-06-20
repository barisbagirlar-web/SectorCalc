// Auto-generated from debt-payoff-calculator-schema.json
import * as z from 'zod';

export interface Debt_payoff_calculatorInput {
  totalDebt: number;
  interestRate: number;
  monthlyPayment: number;
  extraPayment: number;
  numDebts: number;
  dataConfidence?: number;
}

export const Debt_payoff_calculatorInputSchema = z.object({
  totalDebt: z.number().default(10000),
  interestRate: z.number().default(5),
  monthlyPayment: z.number().default(500),
  extraPayment: z.number().default(0),
  numDebts: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Debt_payoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRate"] = Number.NaN; }
  try { const v = input.monthlyPayment + input.extraPayment; results["totalMonthlyPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonthlyPayment"] = Number.NaN; }
  return results;
}


export function calculateDebt_payoff_calculator(input: Debt_payoff_calculatorInput): Debt_payoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonthlyPayment"]);
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


export interface Debt_payoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
