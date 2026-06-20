// Auto-generated from blue-hour-calculator-schema.json
import * as z from 'zod';

export interface Blue_hour_calculatorInput {
  sunrise_time: number;
  sunset_time: number;
  latitude: number;
  longitude: number;
  timezone_offset: number;
  day_of_year: number;
  dataConfidence?: number;
}

export const Blue_hour_calculatorInputSchema = z.object({
  sunrise_time: z.number().default(6.5),
  sunset_time: z.number().default(18),
  latitude: z.number().default(40),
  longitude: z.number().default(-74),
  timezone_offset: z.number().default(-5),
  day_of_year: z.number().default(172),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Blue_hour_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 12 - (input.longitude / 15) - input.timezone_offset; results["solar_noon"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["solar_noon"] = Number.NaN; }
  try { const v = input.sunrise_time; results["blue_hour_morning_end"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["blue_hour_morning_end"] = Number.NaN; }
  try { const v = input.sunset_time; results["blue_hour_evening_start"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["blue_hour_evening_start"] = Number.NaN; }
  return results;
}


export function calculateBlue_hour_calculator(input: Blue_hour_calculatorInput): Blue_hour_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["blue_hour_evening_start"]);
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


export interface Blue_hour_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
