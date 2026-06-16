// Auto-generated from annuity-income-calculator-schema.json
import * as z from 'zod';

export interface Annuity_income_calculatorInput {
  principal: number;
  annualInterestRate: number;
  periods: number;
  paymentFrequency: number;
}

export const Annuity_income_calculatorInputSchema = z.object({
  principal: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  periods: z.number().default(20),
  paymentFrequency: z.number().default(12),
});

function evaluateAllFormulas(input: Annuity_income_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / input.paymentFrequency; results["ratePerPeriod"] = Number.isFinite(v) ? v : 0; } catch { results["ratePerPeriod"] = 0; }
  try { const v = input.periods * input.paymentFrequency; results["totalPeriods"] = Number.isFinite(v) ? v : 0; } catch { results["totalPeriods"] = 0; }
  try { const v = input.principal * (results["ratePerPeriod"] ?? 0) / (1 - Math.pow(1 + (results["ratePerPeriod"] ?? 0), -(results["totalPeriods"] ?? 0))); results["periodicPayment"] = Number.isFinite(v) ? v : 0; } catch { results["periodicPayment"] = 0; }
  try { const v = (results["periodicPayment"] ?? 0) * (results["totalPeriods"] ?? 0); results["totalReceived"] = Number.isFinite(v) ? v : 0; } catch { results["totalReceived"] = 0; }
  try { const v = (results["totalReceived"] ?? 0) - input.principal; results["netInterest"] = Number.isFinite(v) ? v : 0; } catch { results["netInterest"] = 0; }
  return results;
}


export function calculateAnnuity_income_calculator(input: Annuity_income_calculatorInput): Annuity_income_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["periodicPayment"] ?? 0;
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


export interface Annuity_income_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
