// Auto-generated from return-of-premium-calculator-schema.json
import * as z from 'zod';

export interface Return_of_premium_calculatorInput {
  monthlyPremium: number;
  policyTermYears: number;
  interestRate: number;
  claimOccurred: number;
  adminFeeRate: number;
  returnTaxRate: number;
}

export const Return_of_premium_calculatorInputSchema = z.object({
  monthlyPremium: z.number().default(1000),
  policyTermYears: z.number().default(10),
  interestRate: z.number().default(2),
  claimOccurred: z.number().default(0),
  adminFeeRate: z.number().default(1),
  returnTaxRate: z.number().default(5),
});

function evaluateAllFormulas(input: Return_of_premium_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyPremium * 12 * input.policyTermYears; results["totalPremiumsPaid"] = Number.isFinite(v) ? v : 0; } catch { results["totalPremiumsPaid"] = 0; }
  try { const v = (results["totalPremiumsPaid"] ?? 0) * Math.pow(1 + input.interestRate/100, input.policyTermYears) * (1 - input.claimOccurred); results["grossReturn"] = Number.isFinite(v) ? v : 0; } catch { results["grossReturn"] = 0; }
  try { const v = (results["grossReturn"] ?? 0) * (1 - input.adminFeeRate/100); results["netReturnAfterFee"] = Number.isFinite(v) ? v : 0; } catch { results["netReturnAfterFee"] = 0; }
  try { const v = (results["netReturnAfterFee"] ?? 0) * (1 - input.returnTaxRate/100); results["finalReturn"] = Number.isFinite(v) ? v : 0; } catch { results["finalReturn"] = 0; }
  return results;
}


export function calculateReturn_of_premium_calculator(input: Return_of_premium_calculatorInput): Return_of_premium_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalReturn"] ?? 0;
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


export interface Return_of_premium_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
