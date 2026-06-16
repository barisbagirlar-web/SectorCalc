// Auto-generated from quarterly-compound-interest-calculator-schema.json
import * as z from 'zod';

export interface Quarterly_compound_interest_calculatorInput {
  principal: number;
  annualInterestRate: number;
  years: number;
  compoundingFrequency: number;
  inflationRate: number;
}

export const Quarterly_compound_interest_calculatorInputSchema = z.object({
  principal: z.number().default(1000),
  annualInterestRate: z.number().default(5),
  years: z.number().default(10),
  compoundingFrequency: z.number().default(4),
  inflationRate: z.number().default(2),
});

function evaluateAllFormulas(input: Quarterly_compound_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * (1 + input.annualInterestRate/100 / input.compoundingFrequency) ** (input.compoundingFrequency * input.years); results["finalAmount"] = Number.isFinite(v) ? v : 0; } catch { results["finalAmount"] = 0; }
  try { const v = (results["finalAmount"] ?? 0) - input.principal; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = ((1 + input.annualInterestRate/100 / input.compoundingFrequency) ** input.compoundingFrequency - 1) * 100; results["effectiveAnnualRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  try { const v = (results["finalAmount"] ?? 0) / (1 + input.inflationRate/100) ** input.years; results["realFinalAmount"] = Number.isFinite(v) ? v : 0; } catch { results["realFinalAmount"] = 0; }
  return results;
}


export function calculateQuarterly_compound_interest_calculator(input: Quarterly_compound_interest_calculatorInput): Quarterly_compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalAmount"] ?? 0;
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


export interface Quarterly_compound_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
