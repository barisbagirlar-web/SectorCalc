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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Zero_based_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalIncome; results["totalIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalIncome"] = 0; }
  try { const v = input.housing + input.food + input.transport + input.savings + input.discretionary; results["totalExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalExpenses"] = 0; }
  try { const v = input.totalIncome - (input.housing + input.food + input.transport + input.savings + input.discretionary); results["balance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["balance"] = 0; }
  try { const v = input.housing; results["housing"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["housing"] = 0; }
  try { const v = input.food; results["food"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["food"] = 0; }
  try { const v = input.transport; results["transport"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["transport"] = 0; }
  try { const v = input.savings; results["savings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["savings"] = 0; }
  try { const v = input.discretionary; results["discretionary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discretionary"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateZero_based_budget_calculator(input: Zero_based_budget_calculatorInput): Zero_based_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["balance"]));
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


export interface Zero_based_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
