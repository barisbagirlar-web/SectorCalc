// Auto-generated from deferred-annuity-calculator-schema.json
import * as z from 'zod';

export interface Deferred_annuity_calculatorInput {
  presentValue: number;
  annualInterestRate: number;
  deferralYears: number;
  payoutYears: number;
}

export const Deferred_annuity_calculatorInputSchema = z.object({
  presentValue: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  deferralYears: z.number().default(10),
  payoutYears: z.number().default(20),
});

function evaluateAllFormulas(input: Deferred_annuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.presentValue * Math.pow(1 + input.annualInterestRate / 100, input.deferralYears); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = (input.presentValue * Math.pow(1 + input.annualInterestRate / 100, input.deferralYears)) * (input.annualInterestRate / 100) / (1 - Math.pow(1 + input.annualInterestRate / 100, -input.payoutYears)); results["annualPayout"] = Number.isFinite(v) ? v : 0; } catch { results["annualPayout"] = 0; }
  try { const v = input.payoutYears * ((input.presentValue * Math.pow(1 + input.annualInterestRate / 100, input.deferralYears)) * (input.annualInterestRate / 100) / (1 - Math.pow(1 + input.annualInterestRate / 100, -input.payoutYears))); results["totalPayoutAmount"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayoutAmount"] = 0; }
  try { const v = input.payoutYears * ((input.presentValue * Math.pow(1 + input.annualInterestRate / 100, input.deferralYears)) * (input.annualInterestRate / 100) / (1 - Math.pow(1 + input.annualInterestRate / 100, -input.payoutYears))) - input.presentValue; results["totalInterestEarned"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestEarned"] = 0; }
  return results;
}


export function calculateDeferred_annuity_calculator(input: Deferred_annuity_calculatorInput): Deferred_annuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annualPayout"] ?? 0;
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


export interface Deferred_annuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
