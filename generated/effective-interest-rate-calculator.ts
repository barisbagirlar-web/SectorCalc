// Auto-generated from effective-interest-rate-calculator-schema.json
import * as z from 'zod';

export interface Effective_interest_rate_calculatorInput {
  nominalRate: number;
  compoundingPeriodsPerYear: number;
  timePeriodYears: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Effective_interest_rate_calculatorInputSchema = z.object({
  nominalRate: z.number().default(5),
  compoundingPeriodsPerYear: z.number().default(12),
  timePeriodYears: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Effective_interest_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 + input.nominalRate / 100 / input.compoundingPeriodsPerYear) ** (input.compoundingPeriodsPerYear * input.timePeriodYears) - 1; results["effectiveRateDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveRateDecimal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveRateDecimal"])) * 100; results["effectiveRatePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveRatePercent"] = Number.NaN; }
  try { const v = input.compoundingPeriodsPerYear * input.timePeriodYears; results["totalPeriods"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPeriods"] = Number.NaN; }
  return results;
}


export function calculateEffective_interest_rate_calculator(input: Effective_interest_rate_calculatorInput): Effective_interest_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPeriods"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
