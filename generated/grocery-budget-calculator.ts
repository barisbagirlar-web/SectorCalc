// Auto-generated from grocery-budget-calculator-schema.json
import * as z from 'zod';

export interface Grocery_budget_calculatorInput {
  monthlyIncome: number;
  groceryPercentage: number;
  numberOfPeople: number;
  extraExpenses: number;
  dataConfidence?: number;
}

export const Grocery_budget_calculatorInputSchema = z.object({
  monthlyIncome: z.number().default(5000),
  groceryPercentage: z.number().default(15),
  numberOfPeople: z.number().default(1),
  extraExpenses: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Grocery_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyIncome * input.groceryPercentage / 100; results["baseGroceryFromIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseGroceryFromIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseGroceryFromIncome"])) + input.extraExpenses; results["totalGroceyBudget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalGroceyBudget"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGroceyBudget"])) / input.numberOfPeople; results["perPersonBudget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perPersonBudget"] = Number.NaN; }
  return results;
}


export function calculateGrocery_budget_calculator(input: Grocery_budget_calculatorInput): Grocery_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalGroceyBudget"]);
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


export interface Grocery_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
