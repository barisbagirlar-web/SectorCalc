// Auto-generated from short-term-savings-calculator-schema.json
import * as z from 'zod';

export interface Short_term_savings_calculatorInput {
  initialSavings: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  dataConfidence?: number;
}

export const Short_term_savings_calculatorInputSchema = z.object({
  initialSavings: z.number().default(0),
  monthlyContribution: z.number().default(0),
  annualRate: z.number().default(5),
  years: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Short_term_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialSavings * (1 + input.annualRate/100/12) ** (12 * input.years) + input.monthlyContribution * (((1 + input.annualRate/100/12) ** (12 * input.years) - 1) / (input.annualRate/100/12)); results["futureValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = input.initialSavings + input.monthlyContribution * 12 * input.years; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = input.initialSavings * (1 + input.annualRate/100/12) ** (12 * input.years) + input.monthlyContribution * (((1 + input.annualRate/100/12) ** (12 * input.years) - 1) / (input.annualRate/100/12)) - (input.initialSavings + input.monthlyContribution * 12 * input.years); results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateShort_term_savings_calculator(input: Short_term_savings_calculatorInput): Short_term_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["futureValue"]));
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


export interface Short_term_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
