// Auto-generated from mega-backdoor-roth-calculator-schema.json
import * as z from 'zod';

export interface Mega_backdoor_roth_calculatorInput {
  annualSalary: number;
  preTaxDeferral: number;
  employerContribution: number;
  age: number;
  overallLimit: number;
  catchUpLimit: number;
  dataConfidence?: number;
}

export const Mega_backdoor_roth_calculatorInputSchema = z.object({
  annualSalary: z.number().default(75000),
  preTaxDeferral: z.number().default(22500),
  employerContribution: z.number().default(4000),
  age: z.number().default(35),
  overallLimit: z.number().default(69000),
  catchUpLimit: z.number().default(7500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mega_backdoor_roth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.overallLimit - input.preTaxDeferral - input.employerContribution; results["afterTaxSpace"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterTaxSpace"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["afterTaxSpace"])) + input.preTaxDeferral + input.employerContribution; results["totalPotentialContributions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPotentialContributions"] = Number.NaN; }
  return results;
}


export function calculateMega_backdoor_roth_calculator(input: Mega_backdoor_roth_calculatorInput): Mega_backdoor_roth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["afterTaxSpace"]);
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


export interface Mega_backdoor_roth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
