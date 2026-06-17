// @ts-nocheck
// Auto-generated from marathon-calculator-schema.json
import * as z from 'zod';

export interface Marathon_calculatorInput {
  distance_km: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Marathon_calculatorInputSchema = z.object({
  distance_km: z.number().default(42.195),
  hours: z.number().default(4),
  minutes: z.number().default(0),
  seconds: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Marathon_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.hours * 3600 + input.minutes * 60 + input.seconds; results["total_time_sec"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_time_sec"] = 0; }
  try { const v = (asFormulaNumber(results["total_time_sec"])) / input.distance_km; results["pace_per_km_sec"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pace_per_km_sec"] = 0; }
  try { const v = input.distance_km / ((asFormulaNumber(results["total_time_sec"])) / 3600); results["speed_kmh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speed_kmh"] = 0; }
  try { const v = input.distance_km / 1.60934; results["distance_miles"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["distance_miles"] = 0; }
  try { const v = (asFormulaNumber(results["total_time_sec"])) / (asFormulaNumber(results["distance_miles"])); results["pace_per_mile_sec"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pace_per_mile_sec"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMarathon_calculator(input: Marathon_calculatorInput): Marathon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pace_per_mile_sec"]);
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


export interface Marathon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
