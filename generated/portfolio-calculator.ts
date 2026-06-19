// Auto-generated from portfolio-calculator-schema.json
import * as z from 'zod';

export interface Portfolio_calculatorInput {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturnRate: number;
  years: number;
  dataConfidence?: number;
}

export const Portfolio_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  monthlyContribution: z.number().default(500),
  annualReturnRate: z.number().default(7),
  years: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Portfolio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialInvestment + input.monthlyContribution * input.years * 12; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = input.initialInvestment + input.monthlyContribution * input.years * 12; results["totalContributions_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalContributions_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePortfolio_calculator(input: Portfolio_calculatorInput): Portfolio_calculatorOutput {
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


export interface Portfolio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
