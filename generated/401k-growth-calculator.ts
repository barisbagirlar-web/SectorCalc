// Auto-generated from 401k-growth-calculator-schema.json
import * as z from 'zod';

export interface _401k_growth_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  annualContribution: number;
  salary: number;
  employerMatch: number;
  annualReturn: number;
}

export const _401k_growth_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentBalance: z.number().default(50000),
  annualContribution: z.number().default(10000),
  salary: z.number().default(100000),
  employerMatch: z.number().default(3),
  annualReturn: z.number().default(7),
});

function evaluateAllFormulas(input: _401k_growth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetire"] = Number.isFinite(v) ? v : 0; } catch { results["yearsToRetire"] = 0; }
  try { const v = input.annualReturn / 100; results["annualReturnDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["annualReturnDecimal"] = 0; }
  try { const v = input.salary * input.employerMatch / 100; results["matchAmount"] = Number.isFinite(v) ? v : 0; } catch { results["matchAmount"] = 0; }
  try { const v = input.annualContribution + (results["matchAmount"] ?? 0); results["totalAnnualAddition"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualAddition"] = 0; }
  try { const v = input.currentBalance * (1 + (results["annualReturnDecimal"] ?? 0)) ** (results["yearsToRetire"] ?? 0) + (results["totalAnnualAddition"] ?? 0) * (((1 + (results["annualReturnDecimal"] ?? 0)) ** (results["yearsToRetire"] ?? 0) - 1) / (results["annualReturnDecimal"] ?? 0)); results["finalBalance"] = Number.isFinite(v) ? v : 0; } catch { results["finalBalance"] = 0; }
  try { const v = input.annualContribution * (results["yearsToRetire"] ?? 0); results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (results["matchAmount"] ?? 0) * (results["yearsToRetire"] ?? 0); results["totalEmployerMatch"] = Number.isFinite(v) ? v : 0; } catch { results["totalEmployerMatch"] = 0; }
  try { const v = (results["finalBalance"] ?? 0) - input.currentBalance - (results["totalContributions"] ?? 0) - (results["totalEmployerMatch"] ?? 0); results["totalEarnings"] = Number.isFinite(v) ? v : 0; } catch { results["totalEarnings"] = 0; }
  return results;
}


export function calculate_401k_growth_calculator(input: _401k_growth_calculatorInput): _401k_growth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalBalance"] ?? 0;
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


export interface _401k_growth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
