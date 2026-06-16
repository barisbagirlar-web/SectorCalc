// Auto-generated from monthly-compound-interest-schema.json
import * as z from 'zod';

export interface Monthly_compound_interestInput {
  principal: number;
  annualRate: number;
  years: number;
  compoundingsPerYear: number;
}

export const Monthly_compound_interestInputSchema = z.object({
  principal: z.number().default(1000),
  annualRate: z.number().default(5),
  years: z.number().default(1),
  compoundingsPerYear: z.number().default(12),
});

function evaluateAllFormulas(input: Monthly_compound_interestInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * Math.pow(1 + input.annualRate/100/input.compoundingsPerYear, input.compoundingsPerYear*input.years); results["finalAmount"] = Number.isFinite(v) ? v : 0; } catch { results["finalAmount"] = 0; }
  try { const v = (results["finalAmount"] ?? 0) - input.principal; results["interestEarned"] = Number.isFinite(v) ? v : 0; } catch { results["interestEarned"] = 0; }
  return results;
}


export function calculateMonthly_compound_interest(input: Monthly_compound_interestInput): Monthly_compound_interestOutput {
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


export interface Monthly_compound_interestOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
