// Auto-generated from 401k-calculator-schema.json
import * as z from 'zod';

export interface _401k_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  contributionRate: number;
  employerMatchRate: number;
  expectedReturnRate: number;
  inflationRate: number;
  currentBalance: number;
}

export const _401k_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentSalary: z.number().default(50000),
  contributionRate: z.number().default(10),
  employerMatchRate: z.number().default(5),
  expectedReturnRate: z.number().default(7),
  inflationRate: z.number().default(2),
  currentBalance: z.number().default(0),
});

function evaluateAllFormulas(input: _401k_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.expectedReturnRate === input.inflationRate) ? (input.currentBalance * Math.pow(1 + input.expectedReturnRate/100, input.retirementAge - input.currentAge) + input.currentSalary * (input.contributionRate/100 + input.employerMatchRate/100) * (input.retirementAge - input.currentAge) * Math.pow(1 + input.expectedReturnRate/100, input.retirementAge - input.currentAge - 1)) : (input.currentBalance * Math.pow(1 + input.expectedReturnRate/100, input.retirementAge - input.currentAge) + input.currentSalary * (input.contributionRate/100 + input.employerMatchRate/100) * (Math.pow(1 + input.expectedReturnRate/100, input.retirementAge - input.currentAge) - Math.pow(1 + input.inflationRate/100, input.retirementAge - input.currentAge)) / ((input.expectedReturnRate/100) - (input.inflationRate/100))); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = (input.inflationRate === 0) ? input.currentSalary * (input.contributionRate/100) * (input.retirementAge - input.currentAge) : input.currentSalary * (input.contributionRate/100) * (Math.pow(1 + input.inflationRate/100, input.retirementAge - input.currentAge) - 1) / (input.inflationRate/100); results["totalEmployeeContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalEmployeeContributions"] = 0; }
  try { const v = (input.inflationRate === 0) ? input.currentSalary * (input.employerMatchRate/100) * (input.retirementAge - input.currentAge) : input.currentSalary * (input.employerMatchRate/100) * (Math.pow(1 + input.inflationRate/100, input.retirementAge - input.currentAge) - 1) / (input.inflationRate/100); results["totalEmployerContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalEmployerContributions"] = 0; }
  try { const v = (results["futureValue"] ?? 0) - input.currentBalance - (results["totalEmployeeContributions"] ?? 0) - (results["totalEmployerContributions"] ?? 0); results["investmentGrowth"] = Number.isFinite(v) ? v : 0; } catch { results["investmentGrowth"] = 0; }
  return results;
}


export function calculate_401k_calculator(input: _401k_calculatorInput): _401k_calculatorOutput {
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


export interface _401k_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
