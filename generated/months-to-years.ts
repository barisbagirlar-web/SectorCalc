// Auto-generated from months-to-years-schema.json
import * as z from 'zod';

export interface Months_to_yearsInput {
  months: number;
  monthsPerYear: number;
  precision: number;
  includeRemainder: number;
}

export const Months_to_yearsInputSchema = z.object({
  months: z.number().default(12),
  monthsPerYear: z.number().default(12),
  precision: z.number().default(2),
  includeRemainder: z.number().default(1),
});

function evaluateAllFormulas(input: Months_to_yearsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor(input.months / input.monthsPerYear); results["years"] = Number.isFinite(v) ? v : 0; } catch { results["years"] = 0; }
  try { const v = input.months % input.monthsPerYear; results["remainderMonths"] = Number.isFinite(v) ? v : 0; } catch { results["remainderMonths"] = 0; }
  try { const v = input.months / input.monthsPerYear; results["decimalYears"] = Number.isFinite(v) ? v : 0; } catch { results["decimalYears"] = 0; }
  try { const v = Math.round((results["decimalYears"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedDecimalYears"] = Number.isFinite(v) ? v : 0; } catch { results["roundedDecimalYears"] = 0; }
  return results;
}


export function calculateMonths_to_years(input: Months_to_yearsInput): Months_to_yearsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedDecimalYears"] ?? 0;
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


export interface Months_to_yearsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
