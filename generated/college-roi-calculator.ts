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

function evaluateAllFormulas(input: College_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tuitionCost + input.alternativeSalary) * input.yearsCollege; results["totalInvestment"] = Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.startingSalary * (1 - Math.pow((1 + input.salaryGrowth / 100) * Math.pow(1 + input.discountRate / 100, -1), input.workingYears)) / ((input.discountRate - input.salaryGrowth) / 100); results["pvCollegeEarnings"] = Number.isFinite(v) ? v : 0; } catch { results["pvCollegeEarnings"] = 0; }
  try { const v = input.alternativeSalary * (1 - Math.pow(1 + input.discountRate / 100, -input.workingYears)) / (input.discountRate / 100); results["pvAlternativeEarnings"] = Number.isFinite(v) ? v : 0; } catch { results["pvAlternativeEarnings"] = 0; }
  try { const v = (results["pvCollegeEarnings"] ?? 0) - (results["pvAlternativeEarnings"] ?? 0); results["pvIncrementalEarnings"] = Number.isFinite(v) ? v : 0; } catch { results["pvIncrementalEarnings"] = 0; }
  try { const v = (results["pvIncrementalEarnings"] ?? 0) - (results["totalInvestment"] ?? 0); results["npv"] = Number.isFinite(v) ? v : 0; } catch { results["npv"] = 0; }
  try { const v = ((results["npv"] ?? 0) / (results["totalInvestment"] ?? 0)) * 100; results["roiPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["roiPercentage"] = 0; }
  return results;
}


export function calculateCollege_roi_calculator(input: College_roi_calculatorInput): College_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roiPercentage"] ?? 0;
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


export interface College_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
