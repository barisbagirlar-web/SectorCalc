// Auto-generated from education-savings-calculator-schema.json
import * as z from 'zod';

export interface Education_savings_calculatorInput {
  childAge: number;
  yearsUntilCollege: number;
  annualCost: number;
  inflationRate: number;
  returnRate: number;
  currentSavings: number;
  monthlyContribution: number;
  durationOfStudy: number;
}

export const Education_savings_calculatorInputSchema = z.object({
  childAge: z.number().default(5),
  yearsUntilCollege: z.number().default(13),
  annualCost: z.number().default(30000),
  inflationRate: z.number().default(5),
  returnRate: z.number().default(7),
  currentSavings: z.number().default(5000),
  monthlyContribution: z.number().default(200),
  durationOfStudy: z.number().default(4),
});

function evaluateAllFormulas(input: Education_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualCost * Math.pow(1 + input.inflationRate/100, input.yearsUntilCollege) * (Math.pow(1 + input.inflationRate/100, input.durationOfStudy) - 1) / (input.inflationRate/100); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.currentSavings * Math.pow(1 + input.returnRate/100, input.yearsUntilCollege) + (input.monthlyContribution * 12) * ((Math.pow(1 + input.returnRate/100, input.yearsUntilCollege) - 1) / (input.returnRate/100)); results["totalSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavings"] = 0; }
  try { const v = (results["totalCost"] ?? 0) - (results["totalSavings"] ?? 0); results["shortfall"] = Number.isFinite(v) ? v : 0; } catch { results["shortfall"] = 0; }
  try { const v = `${(results["shortfall"] ?? 0) > 0 ? 'Shortfall' : 'Surplus'}: $${Math.abs((results["shortfall"] ?? 0)).toFixed(2)}`; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateEducation_savings_calculator(input: Education_savings_calculatorInput): Education_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["${primary}"] ?? 0;
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


export interface Education_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
