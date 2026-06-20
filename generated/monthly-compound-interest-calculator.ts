// Auto-generated from monthly-compound-interest-calculator-schema.json
import * as z from 'zod';

export interface Monthly_compound_interest_calculatorInput {
  principal: number;
  annualInterestRate: number;
  years: number;
  monthlyContribution: number;
  dataConfidence?: number;
}

export const Monthly_compound_interest_calculatorInputSchema = z.object({
  principal: z.number().default(10000),
  annualInterestRate: z.number().default(5),
  years: z.number().default(5),
  monthlyContribution: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Monthly_compound_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal + input.monthlyContribution * input.years * 12; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributions"] = Number.NaN; }
  try { const v = input.principal + input.monthlyContribution * input.years * 12; results["totalContributions_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributions_aux"] = Number.NaN; }
  return results;
}


export function calculateMonthly_compound_interest_calculator(input: Monthly_compound_interest_calculatorInput): Monthly_compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalContributions_aux"]);
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


export interface Monthly_compound_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
