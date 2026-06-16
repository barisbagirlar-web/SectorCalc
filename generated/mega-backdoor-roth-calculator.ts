// Auto-generated from mega-backdoor-roth-calculator-schema.json
import * as z from 'zod';

export interface Mega_backdoor_roth_calculatorInput {
  annualSalary: number;
  preTaxDeferral: number;
  employerContribution: number;
  age: number;
  overallLimit: number;
  catchUpLimit: number;
}

export const Mega_backdoor_roth_calculatorInputSchema = z.object({
  annualSalary: z.number().default(75000),
  preTaxDeferral: z.number().default(22500),
  employerContribution: z.number().default(4000),
  age: z.number().default(35),
  overallLimit: z.number().default(69000),
  catchUpLimit: z.number().default(7500),
});

function evaluateAllFormulas(input: Mega_backdoor_roth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.overallLimit - input.preTaxDeferral - input.employerContribution; results["afterTaxSpace"] = Number.isFinite(v) ? v : 0; } catch { results["afterTaxSpace"] = 0; }
  try { const v = (results["afterTaxSpace"] ?? 0) + input.preTaxDeferral + input.employerContribution; results["totalPotentialContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalPotentialContributions"] = 0; }
  try { const v = Math.max(0, -((results["afterTaxSpace"] ?? 0))); results["excessContribution"] = Number.isFinite(v) ? v : 0; } catch { results["excessContribution"] = 0; }
  return results;
}


export function calculateMega_backdoor_roth_calculator(input: Mega_backdoor_roth_calculatorInput): Mega_backdoor_roth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["afterTaxSpace"] ?? 0;
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


export interface Mega_backdoor_roth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
