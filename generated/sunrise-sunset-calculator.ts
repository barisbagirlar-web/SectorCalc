// Auto-generated from sunrise-sunset-calculator-schema.json
import * as z from 'zod';

export interface Sunrise_sunset_calculatorInput {
  latitude: number;
  longitude: number;
  dayOfYear: number;
  timezoneOffset: number;
  dataConfidence?: number;
}

export const Sunrise_sunset_calculatorInputSchema = z.object({
  latitude: z.number().default(40.7128),
  longitude: z.number().default(-74.006),
  dayOfYear: z.number().default(172),
  timezoneOffset: z.number().default(-4),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sunrise_sunset_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.latitude * input.longitude * input.dayOfYear * input.timezoneOffset; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.latitude * input.longitude * input.dayOfYear * input.timezoneOffset; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSunrise_sunset_calculator(input: Sunrise_sunset_calculatorInput): Sunrise_sunset_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Sunrise_sunset_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
