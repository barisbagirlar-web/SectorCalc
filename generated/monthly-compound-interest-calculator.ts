// Auto-generated from monthly-compound-interest-calculator-schema.json
import * as z from 'zod';

export interface Monthly_compound_interest_calculatorInput {
  principal: number;
  annualInterestRate: number;
  years: number;
  monthlyContribution: number;
}

export const Monthly_compound_interest_calculatorInputSchema = z.object({
  principal: z.number().default(10000),
  annualInterestRate: z.number().default(5),
  years: z.number().default(5),
  monthlyContribution: z.number().default(0),
});

function evaluateAllFormulas(input: Monthly_compound_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * Math.pow(1 + input.annualInterestRate/100/12, input.years*12) + input.monthlyContribution * ((Math.pow(1 + input.annualInterestRate/100/12, input.years*12) - 1) / (input.annualInterestRate/100/12)); results["totalAmount"] = Number.isFinite(v) ? v : 0; } catch { results["totalAmount"] = 0; }
  try { const v = input.principal + input.monthlyContribution * input.years * 12; results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (input.principal * Math.pow(1 + input.annualInterestRate/100/12, input.years*12) + input.monthlyContribution * ((Math.pow(1 + input.annualInterestRate/100/12, input.years*12) - 1) / (input.annualInterestRate/100/12))) - (input.principal + input.monthlyContribution * input.years * 12); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateMonthly_compound_interest_calculator(input: Monthly_compound_interest_calculatorInput): Monthly_compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalAmount"] ?? 0;
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


export interface Monthly_compound_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
