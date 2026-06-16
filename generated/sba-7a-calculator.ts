// Auto-generated from sba-7a-calculator-schema.json
import * as z from 'zod';

export interface Sba_7a_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  guaranteeFeeRate: number;
  originationFeeRate: number;
  annualRevenue: number;
}

export const Sba_7a_calculatorInputSchema = z.object({
  loanAmount: z.number().default(500000),
  interestRate: z.number().default(7.5),
  loanTermMonths: z.number().default(120),
  guaranteeFeeRate: z.number().default(2),
  originationFeeRate: z.number().default(1),
  annualRevenue: z.number().default(2000000),
});

function evaluateAllFormulas(input: Sba_7a_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanAmount * ((results["monthlyInterestRate"] ?? 0) * (1 + (results["monthlyInterestRate"] ?? 0)) ** input.loanTermMonths) / ((1 + (results["monthlyInterestRate"] ?? 0)) ** input.loanTermMonths - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.loanTermMonths; results["totalPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (results["totalPayment"] ?? 0) - input.loanAmount; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = input.loanAmount * (input.guaranteeFeeRate / 100); results["guaranteeFee"] = Number.isFinite(v) ? v : 0; } catch { results["guaranteeFee"] = 0; }
  try { const v = input.loanAmount * (input.originationFeeRate / 100); results["originationFee"] = Number.isFinite(v) ? v : 0; } catch { results["originationFee"] = 0; }
  try { const v = (results["guaranteeFee"] ?? 0) + (results["originationFee"] ?? 0); results["totalFees"] = Number.isFinite(v) ? v : 0; } catch { results["totalFees"] = 0; }
  try { const v = (results["totalInterest"] ?? 0) + (results["totalFees"] ?? 0); results["effectiveLoanCost"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveLoanCost"] = 0; }
  try { const v = input.annualRevenue / ((results["monthlyPayment"] ?? 0) * 12); results["debtServiceCoverageRatio"] = Number.isFinite(v) ? v : 0; } catch { results["debtServiceCoverageRatio"] = 0; }
  return results;
}


export function calculateSba_7a_calculator(input: Sba_7a_calculatorInput): Sba_7a_calculatorOutput {
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


export interface Sba_7a_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
