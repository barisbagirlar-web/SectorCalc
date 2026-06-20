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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Car_affordability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyNetIncome - input.monthlyExpenses; results["disposableIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["disposableIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["disposableIncome"])) * (input.maxPaymentPercent / 100); results["maxTotalCarBudget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxTotalCarBudget"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["maxTotalCarBudget"])) - input.otherCarCosts; results["maxLoanPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxLoanPayment"] = Number.NaN; }
  try { const v = input.annualInterestRate / 12 / 100; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterestRate"] = Number.NaN; }
  return results;
}


export function calculateCar_affordability_calculator(input: Car_affordability_calculatorInput): Car_affordability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyInterestRate"]);
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


export interface Car_affordability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
