// Auto-generated from opportunity-cost-calculator-schema.json
import * as z from 'zod';

export interface Opportunity_cost_calculatorInput {
  investmentAmount: number;
  currentReturnRate: number;
  alternativeReturnRate: number;
  timePeriod: number;
  dataConfidence?: number;
}

export const Opportunity_cost_calculatorInputSchema = z.object({
  investmentAmount: z.number().default(100000),
  currentReturnRate: z.number().default(5),
  alternativeReturnRate: z.number().default(8),
  timePeriod: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Opportunity_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.investmentAmount * input.currentReturnRate / 100 * input.timePeriod; results["currentReturn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentReturn"] = Number.NaN; }
  try { const v = input.investmentAmount * input.alternativeReturnRate / 100 * input.timePeriod; results["alternativeReturn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alternativeReturn"] = Number.NaN; }
  return results;
}


export function calculateOpportunity_cost_calculator(input: Opportunity_cost_calculatorInput): Opportunity_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["alternativeReturn"]);
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


export interface Opportunity_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
