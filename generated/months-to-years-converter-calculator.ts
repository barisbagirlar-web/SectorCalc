// Auto-generated from months-to-years-converter-calculator-schema.json
import * as z from 'zod';

export interface Months_to_years_converter_calculatorInput {
  months: number;
  monthsPerYear: number;
  decimalPlaces: number;
  outputMode: number;
}

export const Months_to_years_converter_calculatorInputSchema = z.object({
  months: z.number().default(12),
  monthsPerYear: z.number().default(12),
  decimalPlaces: z.number().default(4),
  outputMode: z.number().default(0),
});

function evaluateAllFormulas(input: Months_to_years_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round((input.months / input.monthsPerYear) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["yearsRounded"] = Number.isFinite(v) ? v : 0; } catch { results["yearsRounded"] = 0; }
  try { const v = Math.floor(input.months / input.monthsPerYear); results["yearsPart"] = Number.isFinite(v) ? v : 0; } catch { results["yearsPart"] = 0; }
  try { const v = input.months % input.monthsPerYear; results["monthsPart"] = Number.isFinite(v) ? v : 0; } catch { results["monthsPart"] = 0; }
  return results;
}


export function calculateMonths_to_years_converter_calculator(input: Months_to_years_converter_calculatorInput): Months_to_years_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["yearsRounded"] ?? 0;
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


export interface Months_to_years_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
