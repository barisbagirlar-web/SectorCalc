// Auto-generated from savings-goal-calculator-schema.json
import * as z from 'zod';

export interface Savings_goal_calculatorInput {
  currentSavings: number;
  monthlyContribution: number;
  annualInterestRate: number;
  numberOfYears: number;
  goalAmount: number;
  dataConfidence?: number;
}

export const Savings_goal_calculatorInputSchema = z.object({
  currentSavings: z.number().default(0),
  monthlyContribution: z.number().default(100),
  annualInterestRate: z.number().default(5),
  numberOfYears: z.number().default(10),
  goalAmount: z.number().default(10000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Savings_goal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.currentSavings * (1 + (asFormulaNumber(results["monthlyRate"]))) ** (input.numberOfYears * 12) + input.monthlyContribution * (((1 + (asFormulaNumber(results["monthlyRate"]))) ** (input.numberOfYears * 12) - 1) / (asFormulaNumber(results["monthlyRate"]))); results["totalFutureValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFutureValue"] = 0; }
  try { const v = input.currentSavings + input.monthlyContribution * input.numberOfYears * 12; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (asFormulaNumber(results["totalFutureValue"])) - (asFormulaNumber(results["totalContributions"])); results["interestEarned"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["interestEarned"] = 0; }
  try { const v = (asFormulaNumber(results["totalFutureValue"])) - input.goalAmount; results["goalDifference"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["goalDifference"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSavings_goal_calculator(input: Savings_goal_calculatorInput): Savings_goal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalFutureValue"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Savings_goal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
