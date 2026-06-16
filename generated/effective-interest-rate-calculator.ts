// Auto-generated from effective-interest-rate-calculator-schema.json
import * as z from 'zod';

export interface Effective_interest_rate_calculatorInput {
  nominalRate: number;
  compoundingPeriodsPerYear: number;
  timePeriodYears: number;
  decimalPlaces: number;
}

export const Effective_interest_rate_calculatorInputSchema = z.object({
  nominalRate: z.number().default(5),
  compoundingPeriodsPerYear: z.number().default(12),
  timePeriodYears: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function evaluateAllFormulas(input: Effective_interest_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 + input.nominalRate / 100 / input.compoundingPeriodsPerYear) ** (input.compoundingPeriodsPerYear * input.timePeriodYears) - 1; results["effectiveRateDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRateDecimal"] = 0; }
  try { const v = (results["effectiveRateDecimal"] ?? 0) * 100; results["effectiveRatePercent"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRatePercent"] = 0; }
  try { const v = Math.round((results["effectiveRatePercent"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["effectiveRateRounded"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRateRounded"] = 0; }
  try { const v = input.compoundingPeriodsPerYear * input.timePeriodYears; results["totalPeriods"] = Number.isFinite(v) ? v : 0; } catch { results["totalPeriods"] = 0; }
  return results;
}


export function calculateEffective_interest_rate_calculator(input: Effective_interest_rate_calculatorInput): Effective_interest_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectiveRateRounded"] ?? 0;
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


export interface Effective_interest_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
