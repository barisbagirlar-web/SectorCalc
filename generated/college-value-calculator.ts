// Auto-generated from college-value-calculator-schema.json
import * as z from 'zod';

export interface College_value_calculatorInput {
  collegeCost: number;
  yearsInCollege: number;
  expectedSalary: number;
  alternativeSalary: number;
  workingYears: number;
  discountRate: number;
}

export const College_value_calculatorInputSchema = z.object({
  collegeCost: z.number().default(100000),
  yearsInCollege: z.number().default(4),
  expectedSalary: z.number().default(65000),
  alternativeSalary: z.number().default(35000),
  workingYears: z.number().default(40),
  discountRate: z.number().default(5),
});

function evaluateAllFormulas(input: College_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.collegeCost + input.yearsInCollege * input.alternativeSalary; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.expectedSalary - input.alternativeSalary; results["differential"] = Number.isFinite(v) ? v : 0; } catch { results["differential"] = 0; }
  try { const v = (input.collegeCost + input.yearsInCollege * input.alternativeSalary) / (input.expectedSalary - input.alternativeSalary); results["paybackYears"] = Number.isFinite(v) ? v : 0; } catch { results["paybackYears"] = 0; }
  try { const v = input.workingYears * (input.expectedSalary - input.alternativeSalary) - (input.collegeCost + input.yearsInCollege * input.alternativeSalary); results["totalUndiscountedGain"] = Number.isFinite(v) ? v : 0; } catch { results["totalUndiscountedGain"] = 0; }
  try { const v = -(input.collegeCost + input.yearsInCollege * input.alternativeSalary) + (input.expectedSalary - input.alternativeSalary) * (1 - Math.pow(1 + input.discountRate/100, -input.workingYears)) / (input.discountRate/100); results["npv"] = Number.isFinite(v) ? v : 0; } catch { results["npv"] = 0; }
  return results;
}


export function calculateCollege_value_calculator(input: College_value_calculatorInput): College_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["npv"] ?? 0;
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


export interface College_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
