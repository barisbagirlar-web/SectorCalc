// Auto-generated from pace-per-mile-calculator-schema.json
import * as z from 'zod';

export interface Pace_per_mile_calculatorInput {
  hours: number;
  minutes: number;
  seconds: number;
  distance: number;
  dataConfidence?: number;
}

export const Pace_per_mile_calculatorInputSchema = z.object({
  hours: z.number().default(0),
  minutes: z.number().default(0),
  seconds: z.number().default(0),
  distance: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pace_per_mile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 60 + input.minutes + input.seconds / 60; results["total_time_min"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_time_min"] = 0; }
  try { const v = (asFormulaNumber(results["total_time_min"])) / input.distance; results["pace_min_per_mile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pace_min_per_mile"] = 0; }
  try { const v = (asFormulaNumber(results["pace_min_per_mile"])) * 60; results["pace_sec_per_mile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pace_sec_per_mile"] = 0; }
  try { const v = 60 / (asFormulaNumber(results["pace_min_per_mile"])); results["speed_mph"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speed_mph"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePace_per_mile_calculator(input: Pace_per_mile_calculatorInput): Pace_per_mile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["pace_min_per_mile"]));
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


export interface Pace_per_mile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
