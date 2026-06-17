// @ts-nocheck
// Auto-generated from student-loan-refinance-calculator-schema.json
import * as z from 'zod';

export interface Student_loan_refinance_calculatorInput {
  currentBalance: number;
  currentRate: number;
  currentTermRemaining: number;
  newRate: number;
  newTerm: number;
  originationFee: number;
}

export const Student_loan_refinance_calculatorInputSchema = z.object({
  currentBalance: z.number().default(30000),
  currentRate: z.number().default(6.8),
  currentTermRemaining: z.number().default(120),
  newRate: z.number().default(4.5),
  newTerm: z.number().default(120),
  originationFee: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Student_loan_refinance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.currentRate / 1200; results["monthlyRateCurrent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyRateCurrent"] = 0; }
  try { const v = input.newRate / 1200; results["monthlyRateNew"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyRateNew"] = 0; }
  try { const v = input.currentBalance * (input.originationFee / 100); results["feeCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["feeCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStudent_loan_refinance_calculator(input: Student_loan_refinance_calculatorInput): Student_loan_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["feeCost"]);
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


export interface Student_loan_refinance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
