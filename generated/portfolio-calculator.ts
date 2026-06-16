// Auto-generated from portfolio-calculator-schema.json
import * as z from 'zod';

export interface Portfolio_calculatorInput {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturnRate: number;
  years: number;
}

export const Portfolio_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  monthlyContribution: z.number().default(500),
  annualReturnRate: z.number().default(7),
  years: z.number().default(30),
});

function evaluateAllFormulas(input: Portfolio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialInvestment * Math.pow(1 + input.annualReturnRate/12/100, input.years*12) + input.monthlyContribution * ((Math.pow(1 + input.annualReturnRate/12/100, input.years*12) - 1) / (input.annualReturnRate/12/100)); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = input.initialInvestment + input.monthlyContribution * input.years * 12; results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (results["futureValue"] ?? 0) - (results["totalContributions"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculatePortfolio_calculator(input: Portfolio_calculatorInput): Portfolio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["futureValue"] ?? 0;
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


export interface Portfolio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
