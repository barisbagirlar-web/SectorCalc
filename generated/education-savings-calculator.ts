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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Education_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualCost * (1 + input.inflationRate/100)^input.yearsUntilCollege; results["futureAnnualCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["futureAnnualCost"] = 0; }
  try { const v = (asFormulaNumber(results["futureAnnualCost"])) * input.durationOfStudy; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.currentSavings * (1 + input.returnRate/100)^input.yearsUntilCollege + input.monthlyContribution * 12 * (((1 + input.returnRate/100)^input.yearsUntilCollege - 1) / (input.returnRate/100)); results["futureValueSavings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["futureValueSavings"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) - (asFormulaNumber(results["futureValueSavings"])); results["shortfall"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shortfall"] = 0; }
  try { const v = (asFormulaNumber(results["shortfall"])) / (12 * (((1 + input.returnRate/100)^input.yearsUntilCollege - 1) / (input.returnRate/100))); results["requiredMonthlyContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredMonthlyContribution"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEducation_savings_calculator(input: Education_savings_calculatorInput): Education_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["shortfall"]);
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


export interface Education_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
