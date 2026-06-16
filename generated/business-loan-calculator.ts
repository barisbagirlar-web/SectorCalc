// Auto-generated from business-loan-calculator-schema.json
import * as z from 'zod';

export interface Business_loan_calculatorInput {
  loanAmount: number;
  annualRate: number;
  termYears: number;
  originationFee: number;
}

export const Business_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(50000),
  annualRate: z.number().default(7.5),
  termYears: z.number().default(5),
  originationFee: z.number().default(1),
});

function evaluateAllFormulas(input: Business_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.loanAmount * (input.annualRate/100/12) * Math.pow(1+(input.annualRate/100/12), input.termYears*12)) / (Math.pow(1+(input.annualRate/100/12), input.termYears*12) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = ((input.loanAmount * (input.annualRate/100/12) * Math.pow(1+(input.annualRate/100/12), input.termYears*12)) / (Math.pow(1+(input.annualRate/100/12), input.termYears*12) - 1)) * input.termYears*12; results["totalPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (((input.loanAmount * (input.annualRate/100/12) * Math.pow(1+(input.annualRate/100/12), input.termYears*12)) / (Math.pow(1+(input.annualRate/100/12), input.termYears*12) - 1)) * input.termYears*12) - input.loanAmount; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (((input.loanAmount * (input.annualRate/100/12) * Math.pow(1+(input.annualRate/100/12), input.termYears*12)) / (Math.pow(1+(input.annualRate/100/12), input.termYears*12) - 1)) * input.termYears*12) + (input.loanAmount * input.originationFee/100); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateBusiness_loan_calculator(input: Business_loan_calculatorInput): Business_loan_calculatorOutput {
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


export interface Business_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
