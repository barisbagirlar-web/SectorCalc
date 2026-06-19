// Auto-generated from wedding-budget-calculator-schema.json
import * as z from 'zod';

export interface Wedding_budget_calculatorInput {
  numberOfGuests: number;
  costPerGuest: number;
  venueCost: number;
  decorationCost: number;
  photographyCost: number;
  miscellaneousCost: number;
  dataConfidence?: number;
}

export const Wedding_budget_calculatorInputSchema = z.object({
  numberOfGuests: z.number().default(100),
  costPerGuest: z.number().default(50),
  venueCost: z.number().default(2000),
  decorationCost: z.number().default(1000),
  photographyCost: z.number().default(1500),
  miscellaneousCost: z.number().default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wedding_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfGuests * input.costPerGuest; results["foodCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["foodCost"] = 0; }
  try { const v = (asFormulaNumber(results["foodCost"])) + input.venueCost + input.decorationCost + input.photographyCost + input.miscellaneousCost; results["totalBudget"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBudget"] = 0; }
  try { const v = (asFormulaNumber(results["totalBudget"])) / input.numberOfGuests; results["costPerGuestOverall"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costPerGuestOverall"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWedding_budget_calculator(input: Wedding_budget_calculatorInput): Wedding_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBudget"]);
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


export interface Wedding_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
