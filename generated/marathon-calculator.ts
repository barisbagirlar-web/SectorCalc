// Auto-generated from marathon-calculator-schema.json
import * as z from 'zod';

export interface Marathon_calculatorInput {
  distance_km: number;
  hours: number;
  minutes: number;
  seconds: number;
  dataConfidence?: number;
}

export const Marathon_calculatorInputSchema = z.object({
  distance_km: z.number().default(42.195),
  hours: z.number().default(4),
  minutes: z.number().default(0),
  seconds: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Marathon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 3600 + input.minutes * 60 + input.seconds; results["total_time_sec"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_time_sec"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_time_sec"])) / input.distance_km; results["pace_per_km_sec"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pace_per_km_sec"] = Number.NaN; }
  try { const v = input.distance_km / ((toNumericFormulaValue(results["total_time_sec"])) / 3600); results["speed_kmh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speed_kmh"] = Number.NaN; }
  try { const v = input.distance_km / 1.60934; results["distance_miles"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["distance_miles"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_time_sec"])) / (toNumericFormulaValue(results["distance_miles"])); results["pace_per_mile_sec"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pace_per_mile_sec"] = Number.NaN; }
  return results;
}


export function calculateMarathon_calculator(input: Marathon_calculatorInput): Marathon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pace_per_mile_sec"]);
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


export interface Marathon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
