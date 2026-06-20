// Auto-generated from college-roi-calculator-schema.json
import * as z from 'zod';

export interface College_roi_calculatorInput {
  tuitionCost: number;
  yearsCollege: number;
  alternativeSalary: number;
  startingSalary: number;
  salaryGrowth: number;
  workingYears: number;
  discountRate: number;
  dataConfidence?: number;
}

export const College_roi_calculatorInputSchema = z.object({
  tuitionCost: z.number().default(20000),
  yearsCollege: z.number().default(4),
  alternativeSalary: z.number().default(30000),
  startingSalary: z.number().default(50000),
  salaryGrowth: z.number().default(3),
  workingYears: z.number().default(40),
  discountRate: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: College_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tuitionCost) * (input.yearsCollege) * (input.alternativeSalary) * (input.startingSalary) * (input.salaryGrowth) * (input.workingYears) * (input.discountRate); results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInvestment"] = Number.NaN; }
  try { const v = (input.tuitionCost) * (input.yearsCollege) * (input.alternativeSalary); results["totalInvestment_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInvestment_aux"] = Number.NaN; }
  return results;
}


export function calculateCollege_roi_calculator(input: College_roi_calculatorInput): College_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalInvestment_aux"]);
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


export interface College_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
