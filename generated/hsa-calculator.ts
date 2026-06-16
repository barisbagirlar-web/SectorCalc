// Auto-generated from hsa-calculator-schema.json
import * as z from 'zod';

export interface Hsa_calculatorInput {
  currentAge: number;
  annualContribution: number;
  initialBalance: number;
  annualInterestRate: number;
  taxRate: number;
  yearsUntilRetirement: number;
  employerContribution: number;
}

export const Hsa_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  annualContribution: z.number().default(3600),
  initialBalance: z.number().default(0),
  annualInterestRate: z.number().default(5),
  taxRate: z.number().default(22),
  yearsUntilRetirement: z.number().default(35),
  employerContribution: z.number().default(0),
});

function evaluateAllFormulas(input: Hsa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialBalance * Math.pow(1 + input.annualInterestRate/100, input.yearsUntilRetirement) + (input.annualInterestRate/100 === 0 ? (input.annualContribution + input.employerContribution) * input.yearsUntilRetirement : (input.annualContribution + input.employerContribution) * (Math.pow(1 + input.annualInterestRate/100, input.yearsUntilRetirement) - 1) / (input.annualInterestRate/100)); results["totalFutureValue"] = Number.isFinite(v) ? v : 0; } catch { results["totalFutureValue"] = 0; }
  try { const v = (input.annualContribution + input.employerContribution) * input.yearsUntilRetirement; results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = ((input.annualContribution + input.employerContribution) * input.yearsUntilRetirement) * (input.taxRate/100); results["taxSavings"] = Number.isFinite(v) ? v : 0; } catch { results["taxSavings"] = 0; }
  try { const v = (results["totalFutureValue"] ?? 0) - input.initialBalance - (results["totalContributions"] ?? 0); results["interestEarned"] = Number.isFinite(v) ? v : 0; } catch { results["interestEarned"] = 0; }
  return results;
}


export function calculateHsa_calculator(input: Hsa_calculatorInput): Hsa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFutureValue"] ?? 0;
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


export interface Hsa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
