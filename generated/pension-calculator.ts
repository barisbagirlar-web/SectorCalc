// Auto-generated from pension-calculator-schema.json
import * as z from 'zod';

export interface Pension_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number;
  inflationRate: number;
  dataConfidence?: number;
}

export const Pension_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentSavings: z.number().default(50000),
  monthlyContribution: z.number().default(1000),
  annualReturnRate: z.number().default(5),
  inflationRate: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.retirementAge - input.currentAge); results["yearsToRetirement"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yearsToRetirement"] = 0; }
  try { const v = (input.annualReturnRate / 100 / 12); results["monthlyReturnRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyReturnRate"] = 0; }
  try { const v = ((asFormulaNumber(results["yearsToRetirement"])) * 12); results["totalMonths"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMonths"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePension_calculator(input: Pension_calculatorInput): Pension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonths"]);
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


export interface Pension_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
