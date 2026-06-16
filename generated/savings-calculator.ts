// Auto-generated from savings-calculator-schema.json
import * as z from 'zod';

export interface Savings_calculatorInput {
  initialDeposit: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
}

export const Savings_calculatorInputSchema = z.object({
  initialDeposit: z.number().default(1000),
  monthlyContribution: z.number().default(100),
  annualInterestRate: z.number().default(5),
  years: z.number().default(10),
});

function evaluateAllFormulas(input: Savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialDeposit * Math.pow(1 + input.annualInterestRate/100/12, 12*input.years) + input.monthlyContribution * ((Math.pow(1 + input.annualInterestRate/100/12, 12*input.years) - 1) / (input.annualInterestRate/100/12)); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = input.initialDeposit + input.monthlyContribution * 12 * input.years; results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (input.initialDeposit * Math.pow(1 + input.annualInterestRate/100/12, 12*input.years) + input.monthlyContribution * ((Math.pow(1 + input.annualInterestRate/100/12, 12*input.years) - 1) / (input.annualInterestRate/100/12))) - (input.initialDeposit + input.monthlyContribution * 12 * input.years); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateSavings_calculator(input: Savings_calculatorInput): Savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["futureValue"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
