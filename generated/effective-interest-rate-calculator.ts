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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Effective_interest_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 + input.nominalRate / 100 / input.compoundingPeriodsPerYear) ** (input.compoundingPeriodsPerYear * input.timePeriodYears) - 1; results["effectiveRateDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveRateDecimal"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveRateDecimal"])) * 100; results["effectiveRatePercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveRatePercent"] = 0; }
  try { const v = input.compoundingPeriodsPerYear * input.timePeriodYears; results["totalPeriods"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPeriods"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEffective_interest_rate_calculator(input: Effective_interest_rate_calculatorInput): Effective_interest_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalPeriods"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
