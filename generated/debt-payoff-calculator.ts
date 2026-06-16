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

function evaluateAllFormulas(input: Debt_payoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.monthlyPayment + input.extraPayment; results["totalMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonthlyPayment"] = 0; }
  try { const v = Math.ceil(Math.log(1 - (input.totalDebt * (results["monthlyRate"] ?? 0) / (results["totalMonthlyPayment"] ?? 0))) / Math.log(1 + (results["monthlyRate"] ?? 0))); results["monthsSnowball"] = Number.isFinite(v) ? v : 0; } catch { results["monthsSnowball"] = 0; }
  try { const v = (results["totalMonthlyPayment"] ?? 0) * (results["monthsSnowball"] ?? 0) - input.totalDebt; results["totalInterestSnowball"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestSnowball"] = 0; }
  try { const v = Math.ceil(Math.log(1 - (input.totalDebt * (results["monthlyRate"] ?? 0) / (results["totalMonthlyPayment"] ?? 0))) / Math.log(1 + (results["monthlyRate"] ?? 0))); results["monthsAvalanche"] = Number.isFinite(v) ? v : 0; } catch { results["monthsAvalanche"] = 0; }
  try { const v = (results["totalMonthlyPayment"] ?? 0) * (results["monthsAvalanche"] ?? 0) - input.totalDebt; results["totalInterestAvalanche"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestAvalanche"] = 0; }
  return results;
}


export function calculateDebt_payoff_calculator(input: Debt_payoff_calculatorInput): Debt_payoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthsSnowball"] ?? 0;
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


export interface Debt_payoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
