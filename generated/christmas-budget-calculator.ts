// Auto-generated from christmas-budget-calculator-schema.json
import * as z from 'zod';

export interface Christmas_budget_calculatorInput {
  numberOfGifts: number;
  giftBudgetPerPerson: number;
  foodBudget: number;
  decorationBudget: number;
  travelBudget: number;
  miscBudget: number;
  dataConfidence?: number;
}

export const Christmas_budget_calculatorInputSchema = z.object({
  numberOfGifts: z.number().default(10),
  giftBudgetPerPerson: z.number().default(50),
  foodBudget: z.number().default(200),
  decorationBudget: z.number().default(100),
  travelBudget: z.number().default(150),
  miscBudget: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Christmas_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfGifts * input.giftBudgetPerPerson; results["totalGifts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGifts"] = 0; }
  try { const v = (asFormulaNumber(results["totalGifts"])) + input.foodBudget + input.decorationBudget + input.travelBudget + input.miscBudget; results["totalBudget"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBudget"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateChristmas_budget_calculator(input: Christmas_budget_calculatorInput): Christmas_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalBudget"]));
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


export interface Christmas_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
