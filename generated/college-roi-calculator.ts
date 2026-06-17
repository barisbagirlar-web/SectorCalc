// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: College_roi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.tuitionCost + input.alternativeSalary) * input.yearsCollege; results["totalInvestment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = (input.tuitionCost + input.alternativeSalary) * input.yearsCollege; results["totalInvestment_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInvestment_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCollege_roi_calculator(input: College_roi_calculatorInput): College_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalInvestment_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
