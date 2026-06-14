// Auto-generated from home-budget-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HomeBudgetCalculatorInput {
  monthlyIncome: number;
  housingCost: number;
  utilitiesCost: number;
  foodCost: number;
  transportationCost: number;
  healthcareCost: number;
  entertainmentCost: number;
  savingsGoal: number;
  debtPayments: number;
  otherExpenses: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const HomeBudgetCalculatorInputSchema = z.object({
  monthlyIncome: z.number().min(0).default(5000),
  housingCost: z.number().min(0).default(1500),
  utilitiesCost: z.number().min(0).default(200),
  foodCost: z.number().min(0).default(600),
  transportationCost: z.number().min(0).default(300),
  healthcareCost: z.number().min(0).default(400),
  entertainmentCost: z.number().min(0).default(200),
  savingsGoal: z.number().min(0).default(500),
  debtPayments: z.number().min(0).default(300),
  otherExpenses: z.number().min(0).default(200),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface HomeBudgetCalculatorOutput {
  savingsRate: number;
  breakdown: {
    totalExpenses: number;
    discretionaryIncome: number;
    savingsAchieved: number;
    savingsShortfall: number;
    expenseBreakdown: number;
    budgetStatus: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HomeBudgetCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalExpenses = ((): number => { try { const __v = input.housingCost + input.utilitiesCost + input.foodCost + input.transportationCost + input.healthcareCost + input.entertainmentCost + input.debtPayments + input.otherExpenses; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.discretionaryIncome = ((): number => { try { const __v = input.monthlyIncome - results.totalExpenses; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.savingsAchieved = ((): number => { try { const __v = results.discretionaryIncome > input.savingsGoal ? input.savingsGoal : results.discretionaryIncome; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.savingsShortfall = ((): number => { try { const __v = input.savingsGoal - results.savingsAchieved; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.savingsRate = ((): number => { try { const __v = results.savingsAchieved / input.monthlyIncome; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expenseBreakdown = ((): number => { try { const __v = {"housing": input.housingCost, "utilities": input.utilitiesCost, "food": input.foodCost, "transportation": input.transportationCost, "healthcare": input.healthcareCost, "entertainment": input.entertainmentCost, "debt": input.debtPayments, "other": input.otherExpenses}; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.budgetStatus = ((): number => { try { const __v = results.totalExpenses <= input.monthlyIncome ? 'balanced' : 'deficit'; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.savingsRate * 0.9 : (input.dataConfidence == 'medium' ? results.savingsRate * 0.95 : results.savingsRate); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHomeBudgetCalculator(input: HomeBudgetCalculatorInput): HomeBudgetCalculatorOutput {
  const results = evaluateFormulas(input);
  const savingsRate = results.savingsRate ?? 0;
  const breakdown = {
    totalExpenses: results.totalExpenses,
    discretionaryIncome: results.discretionaryIncome,
    savingsAchieved: results.savingsAchieved,
    savingsShortfall: results.savingsShortfall,
    expenseBreakdown: results.expenseBreakdown,
    budgetStatus: results.budgetStatus,
  };

  // rule: monthlyIncome > 0
  // rule: housingCost >= 0
  // rule: utilitiesCost >= 0
  // rule: foodCost >= 0
  // rule: transportationCost >= 0
  // rule: healthcareCost >= 0
  // rule: entertainmentCost >= 0
  // rule: savingsGoal >= 0
  // rule: debtPayments >= 0
  // rule: otherExpenses >= 0
  // rule: totalExpenses <= monthlyIncome (warning if exceeded)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): housingCost / monthlyIncome > 0.3 -> 'Housing cost exceeds 30% of income, consider reducing.'
  // threshold skipped (non-JS): savingsGoal / monthlyIncome < 0.1 -> 'Savings goal is below 10% of income, consider increasing.'
  // threshold skipped (non-JS): debtPayments / monthlyIncome > 0.36 -> 'Debt payments exceed 36% of income, high risk.'
  // threshold skipped (non-JS): totalExpenses / monthlyIncome > 0.9 -> 'Total expenses exceed 90% of income, budget is tight.'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return savingsRate; } })();

  return {
    savingsRate,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report"],
  };
}
