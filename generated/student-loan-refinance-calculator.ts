// Auto-generated from student-loan-refinance-calculator-schema.json
import * as z from 'zod';

export interface Student_loan_refinance_calculatorInput {
  currentBalance: number;
  currentRate: number;
  currentTermRemaining: number;
  newRate: number;
  newTerm: number;
  originationFee: number;
  dataConfidence?: number;
}

export const Student_loan_refinance_calculatorInputSchema = z.object({
  currentBalance: z.number().default(30000),
  currentRate: z.number().default(6.8),
  currentTermRemaining: z.number().default(120),
  newRate: z.number().default(4.5),
  newTerm: z.number().default(120),
  originationFee: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Student_loan_refinance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentRate / 1200; results["monthlyRateCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRateCurrent"] = Number.NaN; }
  try { const v = input.newRate / 1200; results["monthlyRateNew"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRateNew"] = Number.NaN; }
  try { const v = input.currentBalance * (input.originationFee / 100); results["feeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feeCost"] = Number.NaN; }
  return results;
}


export function calculateStudent_loan_refinance_calculator(input: Student_loan_refinance_calculatorInput): Student_loan_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["feeCost"]);
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


export interface Student_loan_refinance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
