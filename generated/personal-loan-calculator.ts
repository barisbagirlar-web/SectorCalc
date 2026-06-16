// Auto-generated from personal-loan-calculator-schema.json
import * as z from 'zod';

export interface Personal_loan_calculatorInput {
  principal: number;
  annualRate: number;
  termMonths: number;
  originationFee: number;
}

export const Personal_loan_calculatorInputSchema = z.object({
  principal: z.number().default(50000),
  annualRate: z.number().default(5),
  termMonths: z.number().default(60),
  originationFee: z.number().default(0),
});

function evaluateAllFormulas(input: Personal_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualRate / 100) / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.principal * ((results["monthlyRate"] ?? 0) * Math.pow(1 + (results["monthlyRate"] ?? 0), input.termMonths)) / (Math.pow(1 + (results["monthlyRate"] ?? 0), input.termMonths) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.termMonths; results["totalPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (results["totalPayment"] ?? 0) - input.principal; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = input.principal * (input.originationFee / 100); results["originationFeeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["originationFeeAmount"] = 0; }
  try { const v = (results["totalPayment"] ?? 0) + (results["originationFeeAmount"] ?? 0); results["totalCostWithFees"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostWithFees"] = 0; }
  return results;
}


export function calculatePersonal_loan_calculator(input: Personal_loan_calculatorInput): Personal_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyPayment"] ?? 0;
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


export interface Personal_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
