// Auto-generated from opportunity-zone-calculator-schema.json
import * as z from 'zod';

export interface Opportunity_zone_calculatorInput {
  initialCapitalGain: number;
  federalTaxRate: number;
  stateTaxRate: number;
  holdingYears: number;
  annualAppreciation: number;
}

export const Opportunity_zone_calculatorInputSchema = z.object({
  initialCapitalGain: z.number().default(100000),
  federalTaxRate: z.number().default(23.8),
  stateTaxRate: z.number().default(5),
  holdingYears: z.number().default(10),
  annualAppreciation: z.number().default(7),
});

function evaluateAllFormulas(input: Opportunity_zone_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.federalTaxRate + input.stateTaxRate) / 100; results["combinedTaxRate"] = Number.isFinite(v) ? v : 0; } catch { results["combinedTaxRate"] = 0; }
  try { const v = input.initialCapitalGain * (results["combinedTaxRate"] ?? 0); results["originalTax"] = Number.isFinite(v) ? v : 0; } catch { results["originalTax"] = 0; }
  try { const v = (results["originalTax"] ?? 0) * (Math.pow(1 + input.annualAppreciation/100, input.holdingYears) - 1); results["deferralSavings"] = Number.isFinite(v) ? v : 0; } catch { results["deferralSavings"] = 0; }
  try { const v = input.holdingYears >= 7 ? 0.15 : (input.holdingYears >= 5 ? 0.10 : 0); results["stepUpRatio"] = Number.isFinite(v) ? v : 0; } catch { results["stepUpRatio"] = 0; }
  try { const v = (results["stepUpRatio"] ?? 0) * input.initialCapitalGain * (results["combinedTaxRate"] ?? 0); results["stepUpSavings"] = Number.isFinite(v) ? v : 0; } catch { results["stepUpSavings"] = 0; }
  try { const v = input.holdingYears >= 10; results["exclusionApplies"] = Number.isFinite(v) ? v : 0; } catch { results["exclusionApplies"] = 0; }
  try { const v = (results["exclusionApplies"] ?? 0) ? (input.initialCapitalGain * Math.pow(1 + input.annualAppreciation/100, input.holdingYears) - input.initialCapitalGain) * (results["combinedTaxRate"] ?? 0) : 0; results["exclusionSavings"] = Number.isFinite(v) ? v : 0; } catch { results["exclusionSavings"] = 0; }
  try { const v = (results["deferralSavings"] ?? 0) + (results["stepUpSavings"] ?? 0) + (results["exclusionSavings"] ?? 0); results["totalSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavings"] = 0; }
  return results;
}


export function calculateOpportunity_zone_calculator(input: Opportunity_zone_calculatorInput): Opportunity_zone_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSavings"] ?? 0;
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


export interface Opportunity_zone_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
