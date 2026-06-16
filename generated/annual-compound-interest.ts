// Auto-generated from annual-compound-interest-schema.json
import * as z from 'zod';

export interface Annual_compound_interestInput {
  principal: number;
  annualRate: number;
  compoundingPeriods: number;
  years: number;
}

export const Annual_compound_interestInputSchema = z.object({
  principal: z.number().default(1000),
  annualRate: z.number().default(5),
  compoundingPeriods: z.number().default(1),
  years: z.number().default(5),
});

function evaluateAllFormulas(input: Annual_compound_interestInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * Math.pow(1 + (input.annualRate / 100) / input.compoundingPeriods, input.compoundingPeriods * input.years); results["finalAmount"] = Number.isFinite(v) ? v : 0; } catch { results["finalAmount"] = 0; }
  try { const v = input.principal * Math.pow(1 + (input.annualRate / 100) / input.compoundingPeriods, input.compoundingPeriods * input.years) - input.principal; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = 100 * (Math.pow(1 + (input.annualRate / 100) / input.compoundingPeriods, input.compoundingPeriods) - 1); results["effectiveAnnualRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  return results;
}


export function calculateAnnual_compound_interest(input: Annual_compound_interestInput): Annual_compound_interestOutput {
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


export interface Annual_compound_interestOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
