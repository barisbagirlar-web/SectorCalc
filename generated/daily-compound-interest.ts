// Auto-generated from daily-compound-interest-schema.json
import * as z from 'zod';

export interface Daily_compound_interestInput {
  principal: number;
  annualRate: number;
  years: number;
  frequency: number;
}

export const Daily_compound_interestInputSchema = z.object({
  principal: z.number().default(10000),
  annualRate: z.number().default(5),
  years: z.number().default(10),
  frequency: z.number().default(365),
});

function evaluateAllFormulas(input: Daily_compound_interestInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * (1 + input.annualRate / (100 * input.frequency)) ** (input.frequency * input.years); results["finalAmountJs"] = Number.isFinite(v) ? v : 0; } catch { results["finalAmountJs"] = 0; }
  try { const v = finalAmount - input.principal; results["totalInterestJs"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestJs"] = 0; }
  try { const v = ((1 + input.annualRate / (100 * input.frequency)) ** input.frequency - 1) * 100; results["effectiveAnnualRateJs"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRateJs"] = 0; }
  return results;
}


export function calculateDaily_compound_interest(input: Daily_compound_interestInput): Daily_compound_interestOutput {
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


export interface Daily_compound_interestOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
