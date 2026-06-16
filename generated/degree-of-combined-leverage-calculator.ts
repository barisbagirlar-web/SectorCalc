// Auto-generated from degree-of-combined-leverage-calculator-schema.json
import * as z from 'zod';

export interface Degree_of_combined_leverage_calculatorInput {
  salesRevenue: number;
  variableCosts: number;
  fixedCosts: number;
  interestExpense: number;
}

export const Degree_of_combined_leverage_calculatorInputSchema = z.object({
  salesRevenue: z.number().default(100000),
  variableCosts: z.number().default(40000),
  fixedCosts: z.number().default(30000),
  interestExpense: z.number().default(10000),
});

function evaluateAllFormulas(input: Degree_of_combined_leverage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.salesRevenue - input.variableCosts) / (input.salesRevenue - input.variableCosts - input.fixedCosts - input.interestExpense); results["dcl"] = Number.isFinite(v) ? v : 0; } catch { results["dcl"] = 0; }
  try { const v = (input.salesRevenue - input.variableCosts) / (input.salesRevenue - input.variableCosts - input.fixedCosts); results["dol"] = Number.isFinite(v) ? v : 0; } catch { results["dol"] = 0; }
  try { const v = (input.salesRevenue - input.variableCosts - input.fixedCosts) / (input.salesRevenue - input.variableCosts - input.fixedCosts - input.interestExpense); results["dfl"] = Number.isFinite(v) ? v : 0; } catch { results["dfl"] = 0; }
  return results;
}


export function calculateDegree_of_combined_leverage_calculator(input: Degree_of_combined_leverage_calculatorInput): Degree_of_combined_leverage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dcl"] ?? 0;
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


export interface Degree_of_combined_leverage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
