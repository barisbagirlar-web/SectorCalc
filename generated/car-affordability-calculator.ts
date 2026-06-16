// Auto-generated from car-affordability-calculator-schema.json
import * as z from 'zod';

export interface Car_affordability_calculatorInput {
  monthlyNetIncome: number;
  monthlyExpenses: number;
  downPayment: number;
  loanTermMonths: number;
  annualInterestRate: number;
  otherCarCosts: number;
  maxPaymentPercent: number;
}

export const Car_affordability_calculatorInputSchema = z.object({
  monthlyNetIncome: z.number().default(5000),
  monthlyExpenses: z.number().default(3000),
  downPayment: z.number().default(5000),
  loanTermMonths: z.number().default(60),
  annualInterestRate: z.number().default(5),
  otherCarCosts: z.number().default(200),
  maxPaymentPercent: z.number().default(15),
});

function evaluateAllFormulas(input: Car_affordability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyNetIncome - input.monthlyExpenses; results["disposableIncome"] = Number.isFinite(v) ? v : 0; } catch { results["disposableIncome"] = 0; }
  try { const v = (results["disposableIncome"] ?? 0) * (input.maxPaymentPercent / 100); results["maxTotalCarBudget"] = Number.isFinite(v) ? v : 0; } catch { results["maxTotalCarBudget"] = 0; }
  try { const v = (results["maxTotalCarBudget"] ?? 0) - input.otherCarCosts; results["maxLoanPayment"] = Number.isFinite(v) ? v : 0; } catch { results["maxLoanPayment"] = 0; }
  try { const v = input.annualInterestRate / 12 / 100; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = (results["monthlyInterestRate"] ?? 0) === 0 ? (results["maxLoanPayment"] ?? 0) * input.loanTermMonths : (results["maxLoanPayment"] ?? 0) * (1 - Math.pow(1 + (results["monthlyInterestRate"] ?? 0), -input.loanTermMonths)) / (results["monthlyInterestRate"] ?? 0); results["maxLoan"] = Number.isFinite(v) ? v : 0; } catch { results["maxLoan"] = 0; }
  try { const v = input.downPayment + (results["maxLoan"] ?? 0); results["maxCarPrice"] = Number.isFinite(v) ? v : 0; } catch { results["maxCarPrice"] = 0; }
  return results;
}


export function calculateCar_affordability_calculator(input: Car_affordability_calculatorInput): Car_affordability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxCarPrice"] ?? 0;
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


export interface Car_affordability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
