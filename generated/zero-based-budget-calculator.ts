// Auto-generated from zero-based-budget-calculator-schema.json
import * as z from 'zod';

export interface Zero_based_budget_calculatorInput {
  totalIncome: number;
  housing: number;
  food: number;
  transport: number;
  savings: number;
  discretionary: number;
  dataConfidence?: number;
}

export const Zero_based_budget_calculatorInputSchema = z.object({
  totalIncome: z.number().default(0),
  housing: z.number().default(0),
  food: z.number().default(0),
  transport: z.number().default(0),
  savings: z.number().default(0),
  discretionary: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Zero_based_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalIncome; results["totalIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalIncome"] = Number.NaN; }
  try { const v = input.housing + input.food + input.transport + input.savings + input.discretionary; results["totalExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalExpenses"] = Number.NaN; }
  try { const v = input.totalIncome - (input.housing + input.food + input.transport + input.savings + input.discretionary); results["balance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["balance"] = Number.NaN; }
  try { const v = input.housing; results["housing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["housing"] = Number.NaN; }
  try { const v = input.food; results["food"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["food"] = Number.NaN; }
  try { const v = input.transport; results["transport"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["transport"] = Number.NaN; }
  try { const v = input.savings; results["savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["savings"] = Number.NaN; }
  try { const v = input.discretionary; results["discretionary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discretionary"] = Number.NaN; }
  return results;
}


export function calculateZero_based_budget_calculator(input: Zero_based_budget_calculatorInput): Zero_based_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["balance"]);
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


export interface Zero_based_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
