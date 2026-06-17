// @ts-nocheck
// Auto-generated from blue-hour-calculator-schema.json
import * as z from 'zod';

export interface Blue_hour_calculatorInput {
  sunrise_time: number;
  sunset_time: number;
  latitude: number;
  longitude: number;
  timezone_offset: number;
  day_of_year: number;
}

export const Blue_hour_calculatorInputSchema = z.object({
  sunrise_time: z.number().default(6.5),
  sunset_time: z.number().default(18),
  latitude: z.number().default(40),
  longitude: z.number().default(-74),
  timezone_offset: z.number().default(-5),
  day_of_year: z.number().default(172),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Blue_hour_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 12 - (input.longitude / 15) - input.timezone_offset; results["solar_noon"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["solar_noon"] = 0; }
  try { const v = 12 - (input.longitude / 15) - input.timezone_offset; results["solar_noon_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["solar_noon_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBlue_hour_calculator(input: Blue_hour_calculatorInput): Blue_hour_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["solar_noon_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
