// Auto-generated from shopping-budget-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ShoppingBudgetCalculatorInput {
  monthlyIncome: number;
  fixedExpenses: number;
  savingsGoal: number;
  shoppingFrequency: 'weekly' | 'biweekly' | 'monthly';
  discretionaryPercentage: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ShoppingBudgetCalculatorInputSchema = z.object({
  monthlyIncome: z.number().min(0).default(5000),
  fixedExpenses: z.number().min(0).default(2000),
  savingsGoal: z.number().min(0).default(500),
  shoppingFrequency: z.enum(['weekly', 'biweekly', 'monthly']).default('monthly'),
  discretionaryPercentage: z.number().min(0).max(100).default(30),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ShoppingBudgetCalculatorOutput {
  shoppingBudget: number;
  breakdown: {
    availableForShopping: number;
    discretionaryAllocation: number;
    adjustedBudget: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ShoppingBudgetCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.availableForShopping = ((): number => { try { const __v = input.monthlyIncome - input.fixedExpenses - input.savingsGoal; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.shoppingBudget = ((): number => { try { const __v = results.availableForShopping * (input.discretionaryPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedShoppingBudget = ((): number => { try { const __v = results.shoppingBudget * (input.dataConfidence === 'low' ? 0.8 : input.dataConfidence === 'medium' ? 1.0 : 1.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateShoppingBudgetCalculator(input: ShoppingBudgetCalculatorInput): ShoppingBudgetCalculatorOutput {
  const results = evaluateFormulas(input);
  const shoppingBudget = results.shoppingBudget ?? 0;
  const breakdown = {
    availableForShopping: results.availableForShopping,
    discretionaryAllocation: results.discretionaryAllocation,
    adjustedBudget: results.adjustedBudget,
  };

  // rule: monthlyIncome > 0
  // rule: fixedExpenses >= 0
  // rule: savingsGoal >= 0
  // rule: fixedExpenses + savingsGoal < monthlyIncome
  // rule: discretionaryPercentage between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High discretionary spending may hinder savings goals.
  // threshold skipped (non-JS): Savings goal is aggressive; consider adjusting.
  // threshold skipped (non-JS): Fixed expenses exceed 50% of income; financial stress risk.

  const dataConfidenceAdjusted = (() => { try { return results.adjustedShoppingBudget; } catch { return shoppingBudget; } })();

  return {
    shoppingBudget,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over time","Comparison with benchmarks","Detailed report with breakdowns"],
  };
}
