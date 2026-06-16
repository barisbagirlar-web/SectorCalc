// Auto-generated from nominal-interest-rate-schema.json
import * as z from 'zod';

export interface Nominal_interest_rateInput {
  effectiveAnnualRate: number;
  compoundingFrequency: number;
  isContinuous: number;
}

export const Nominal_interest_rateInputSchema = z.object({
  effectiveAnnualRate: z.number().default(5),
  compoundingFrequency: z.number().default(12),
  isContinuous: z.number().default(0),
});

function evaluateAllFormulas(input: Nominal_interest_rateInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.isContinuous === 1 ? Math.log(1 + input.effectiveAnnualRate / 100) : input.compoundingFrequency * (Math.pow(1 + input.effectiveAnnualRate / 100, 1 / input.compoundingFrequency) - 1)) * 100; results["nominalAnnualRate"] = Number.isFinite(v) ? v : 0; } catch { results["nominalAnnualRate"] = 0; }
  try { const v = input.effectiveAnnualRate; results["effectiveAnnualRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  try { const v = input.compoundingFrequency; results["compoundingFrequency"] = Number.isFinite(v) ? v : 0; } catch { results["compoundingFrequency"] = 0; }
  return results;
}


export function calculateNominal_interest_rate(input: Nominal_interest_rateInput): Nominal_interest_rateOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["nominalAnnualRate"] ?? 0;
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


export interface Nominal_interest_rateOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
