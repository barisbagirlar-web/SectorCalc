// Auto-generated from months-to-years-schema.json
import * as z from 'zod';

export interface Months_to_yearsInput {
  months: number;
  monthsPerYear: number;
  precision: number;
  includeRemainder: number;
  dataConfidence?: number;
}

export const Months_to_yearsInputSchema = z.object({
  months: z.number().default(12),
  monthsPerYear: z.number().default(12),
  precision: z.number().default(2),
  includeRemainder: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Months_to_yearsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.months / input.monthsPerYear; results["decimalYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["decimalYears"] = Number.NaN; }
  try { const v = input.months / input.monthsPerYear; results["decimalYears_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["decimalYears_aux"] = Number.NaN; }
  return results;
}


export function calculateMonths_to_years(input: Months_to_yearsInput): Months_to_yearsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["decimalYears_aux"]);
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


export interface Months_to_yearsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
