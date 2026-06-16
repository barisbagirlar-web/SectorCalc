// Auto-generated from mega-backdoor-roth-schema.json
import * as z from 'zod';

export interface Mega_backdoor_rothInput {
  afterTax401kContribution: number;
  employerMatch: number;
  existingPreTaxBalance: number;
  existingRothBalance: number;
  annualReturnRate: number;
  yearsUntilRetirement: number;
  taxRateAtConversion: number;
}

export const Mega_backdoor_rothInputSchema = z.object({
  afterTax401kContribution: z.number().default(20000),
  employerMatch: z.number().default(5000),
  existingPreTaxBalance: z.number().default(50000),
  existingRothBalance: z.number().default(10000),
  annualReturnRate: z.number().default(7),
  yearsUntilRetirement: z.number().default(20),
  taxRateAtConversion: z.number().default(24),
});

function evaluateAllFormulas(input: Mega_backdoor_rothInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.afterTax401kContribution * (1 + input.annualReturnRate/100) ** input.yearsUntilRetirement; results["totalAfterTaxGrowth"] = Number.isFinite(v) ? v : 0; } catch { results["totalAfterTaxGrowth"] = 0; }
  try { const v = ((results["totalAfterTaxGrowth"] ?? 0) - input.afterTax401kContribution) * input.taxRateAtConversion/100; results["taxOnEarnings"] = Number.isFinite(v) ? v : 0; } catch { results["taxOnEarnings"] = 0; }
  try { const v = (results["totalAfterTaxGrowth"] ?? 0) - (results["taxOnEarnings"] ?? 0); results["netRothValue"] = Number.isFinite(v) ? v : 0; } catch { results["netRothValue"] = 0; }
  try { const v = input.existingPreTaxBalance * (1 + input.annualReturnRate/100) ** input.yearsUntilRetirement + input.existingRothBalance * (1 + input.annualReturnRate/100) ** input.yearsUntilRetirement + (results["netRothValue"] ?? 0) + input.employerMatch * (1 + input.annualReturnRate/100) ** input.yearsUntilRetirement; results["totalRetirementBalance"] = Number.isFinite(v) ? v : 0; } catch { results["totalRetirementBalance"] = 0; }
  return results;
}


export function calculateMega_backdoor_roth(input: Mega_backdoor_rothInput): Mega_backdoor_rothOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Net"] ?? 0;
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


export interface Mega_backdoor_rothOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
