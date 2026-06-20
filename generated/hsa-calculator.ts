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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hsa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualContribution + input.employerContribution) * input.yearsUntilRetirement; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributions"] = Number.NaN; }
  try { const v = ((input.annualContribution + input.employerContribution) * input.yearsUntilRetirement) * (input.taxRate/100); results["taxSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxSavings"] = Number.NaN; }
  return results;
}


export function calculateHsa_calculator(input: Hsa_calculatorInput): Hsa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["taxSavings"]);
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


export interface Hsa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
