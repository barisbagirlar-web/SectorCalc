// Auto-generated from immediate-annuity-calculator-schema.json
import * as z from 'zod';

export interface Immediate_annuity_calculatorInput {
  principalAmount: number;
  annualInterestRate: number;
  paymentPeriodsPerYear: number;
  years: number;
}

export const Immediate_annuity_calculatorInputSchema = z.object({
  principalAmount: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  paymentPeriodsPerYear: z.number().default(12),
  years: z.number().default(20),
});

function evaluateAllFormulas(input: Immediate_annuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / input.paymentPeriodsPerYear; results["periodRate"] = Number.isFinite(v) ? v : 0; } catch { results["periodRate"] = 0; }
  try { const v = input.years * input.paymentPeriodsPerYear; results["totalPeriods"] = Number.isFinite(v) ? v : 0; } catch { results["totalPeriods"] = 0; }
  try { const v = input.principalAmount * (results["periodRate"] ?? 0) / (1 - Math.pow(1 + (results["periodRate"] ?? 0), -(results["totalPeriods"] ?? 0))); results["paymentAmount"] = Number.isFinite(v) ? v : 0; } catch { results["paymentAmount"] = 0; }
  try { const v = (results["paymentAmount"] ?? 0) * (results["totalPeriods"] ?? 0); results["totalPayout"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayout"] = 0; }
  try { const v = (results["totalPayout"] ?? 0) - input.principalAmount; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateImmediate_annuity_calculator(input: Immediate_annuity_calculatorInput): Immediate_annuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["paymentAmount"] ?? 0;
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


export interface Immediate_annuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
