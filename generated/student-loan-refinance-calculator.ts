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

function evaluateAllFormulas(input: Student_loan_refinance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentRate / 1200; results["monthlyRateCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRateCurrent"] = 0; }
  try { const v = input.newRate / 1200; results["monthlyRateNew"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRateNew"] = 0; }
  try { const v = input.currentBalance * ((results["monthlyRateCurrent"] ?? 0) * Math.pow(1 + (results["monthlyRateCurrent"] ?? 0), input.currentTermRemaining)) / (Math.pow(1 + (results["monthlyRateCurrent"] ?? 0), input.currentTermRemaining) - 1); results["currentMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["currentMonthlyPayment"] = 0; }
  try { const v = input.currentBalance * ((results["monthlyRateNew"] ?? 0) * Math.pow(1 + (results["monthlyRateNew"] ?? 0), input.newTerm)) / (Math.pow(1 + (results["monthlyRateNew"] ?? 0), input.newTerm) - 1); results["newMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["newMonthlyPayment"] = 0; }
  try { const v = (results["currentMonthlyPayment"] ?? 0) * input.currentTermRemaining - input.currentBalance; results["totalInterestCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestCurrent"] = 0; }
  try { const v = (results["newMonthlyPayment"] ?? 0) * input.newTerm - input.currentBalance; results["totalInterestNew"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestNew"] = 0; }
  try { const v = input.currentBalance * (input.originationFee / 100); results["feeCost"] = Number.isFinite(v) ? v : 0; } catch { results["feeCost"] = 0; }
  try { const v = (results["totalInterestCurrent"] ?? 0) - (results["totalInterestNew"] ?? 0) - (results["feeCost"] ?? 0); results["totalSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavings"] = 0; }
  try { const v = (results["currentMonthlyPayment"] ?? 0) - (results["newMonthlyPayment"] ?? 0); results["monthlyPaymentReduction"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPaymentReduction"] = 0; }
  try { const v = (results["totalInterestCurrent"] ?? 0) - (results["totalInterestNew"] ?? 0); results["interestSaved"] = Number.isFinite(v) ? v : 0; } catch { results["interestSaved"] = 0; }
  return results;
}


export function calculateStudent_loan_refinance_calculator(input: Student_loan_refinance_calculatorInput): Student_loan_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSavings"] ?? 0;
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


export interface Student_loan_refinance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
