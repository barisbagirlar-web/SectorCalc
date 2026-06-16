// Auto-generated from 401k-retirement-calculator-schema.json
import * as z from 'zod';

export interface _401k_retirement_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  annualContribution: number;
  employerMatchRate: number;
  annualReturnRate: number;
}

export const _401k_retirement_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentBalance: z.number().default(50000),
  annualContribution: z.number().default(10000),
  employerMatchRate: z.number().default(5),
  annualReturnRate: z.number().default(7),
});

function evaluateAllFormulas(input: _401k_retirement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentBalance * Math.pow(1 + (input.annualReturnRate / 100), input.retirementAge - input.currentAge) + (input.annualContribution * (1 + input.employerMatchRate / 100)) * ((Math.pow(1 + (input.annualReturnRate / 100), input.retirementAge - input.currentAge) - 1) / (input.annualReturnRate / 100)); results["totalAtRetirement"] = Number.isFinite(v) ? v : 0; } catch { results["totalAtRetirement"] = 0; }
  try { const v = input.currentBalance * Math.pow(1 + (input.annualReturnRate / 100), input.retirementAge - input.currentAge); results["fromPrincipal"] = Number.isFinite(v) ? v : 0; } catch { results["fromPrincipal"] = 0; }
  try { const v = input.annualContribution * ((Math.pow(1 + (input.annualReturnRate / 100), input.retirementAge - input.currentAge) - 1) / (input.annualReturnRate / 100)); results["fromContributions"] = Number.isFinite(v) ? v : 0; } catch { results["fromContributions"] = 0; }
  try { const v = (input.annualContribution * (input.employerMatchRate / 100)) * ((Math.pow(1 + (input.annualReturnRate / 100), input.retirementAge - input.currentAge) - 1) / (input.annualReturnRate / 100)); results["fromEmployerMatch"] = Number.isFinite(v) ? v : 0; } catch { results["fromEmployerMatch"] = 0; }
  return results;
}


export function calculate_401k_retirement_calculator(input: _401k_retirement_calculatorInput): _401k_retirement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalAtRetirement"] ?? 0;
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


export interface _401k_retirement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
