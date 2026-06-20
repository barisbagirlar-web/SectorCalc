// Auto-generated from college-value-calculator-schema.json
import * as z from 'zod';

export interface College_value_calculatorInput {
  collegeCost: number;
  yearsInCollege: number;
  expectedSalary: number;
  alternativeSalary: number;
  workingYears: number;
  discountRate: number;
  dataConfidence?: number;
}

export const College_value_calculatorInputSchema = z.object({
  collegeCost: z.number().default(100000),
  yearsInCollege: z.number().default(4),
  expectedSalary: z.number().default(65000),
  alternativeSalary: z.number().default(35000),
  workingYears: z.number().default(40),
  discountRate: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: College_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.collegeCost + input.yearsInCollege * input.alternativeSalary; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.expectedSalary - input.alternativeSalary; results["differential"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["differential"] = Number.NaN; }
  try { const v = (input.collegeCost + input.yearsInCollege * input.alternativeSalary) / (input.expectedSalary - input.alternativeSalary); results["paybackYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paybackYears"] = Number.NaN; }
  try { const v = input.workingYears * (input.expectedSalary - input.alternativeSalary) - (input.collegeCost + input.yearsInCollege * input.alternativeSalary); results["totalUndiscountedGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUndiscountedGain"] = Number.NaN; }
  return results;
}


export function calculateCollege_value_calculator(input: College_value_calculatorInput): College_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalUndiscountedGain"]);
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


export interface College_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
