// Auto-generated from return-of-premium-calculator-schema.json
import * as z from 'zod';

export interface Return_of_premium_calculatorInput {
  monthlyPremium: number;
  policyTermYears: number;
  interestRate: number;
  claimOccurred: number;
  adminFeeRate: number;
  returnTaxRate: number;
  dataConfidence?: number;
}

export const Return_of_premium_calculatorInputSchema = z.object({
  monthlyPremium: z.number().default(1000),
  policyTermYears: z.number().default(10),
  interestRate: z.number().default(2),
  claimOccurred: z.number().default(0),
  adminFeeRate: z.number().default(1),
  returnTaxRate: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Return_of_premium_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyPremium * 12 * input.policyTermYears; results["totalPremiumsPaid"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPremiumsPaid"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPremiumsPaid"])) * (1 + input.interestRate/100) ^ input.policyTermYears; results["grossReturn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossReturn"] = Number.NaN; }
  return results;
}


export function calculateReturn_of_premium_calculator(input: Return_of_premium_calculatorInput): Return_of_premium_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossReturn"]);
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


export interface Return_of_premium_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
