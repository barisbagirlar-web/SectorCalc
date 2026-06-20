// Auto-generated from pace-per-kilometer-calculator-schema.json
import * as z from 'zod';

export interface Pace_per_kilometer_calculatorInput {
  totalMinutes: number;
  totalSeconds: number;
  distanceKm: number;
  dataConfidence?: number;
}

export const Pace_per_kilometer_calculatorInputSchema = z.object({
  totalMinutes: z.number().default(30),
  totalSeconds: z.number().default(0),
  distanceKm: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pace_per_kilometer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalMinutes * 60 + input.totalSeconds; results["totalTimeSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeSeconds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTimeSeconds"])) / input.distanceKm; results["paceSecondsPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paceSecondsPerKm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["paceSecondsPerKm"])) + ' seconds per km'; results["paceSecondsPerKm_____seconds_per_km_"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paceSecondsPerKm_____seconds_per_km_"] = Number.NaN; }
  return results;
}


export function calculatePace_per_kilometer_calculator(input: Pace_per_kilometer_calculatorInput): Pace_per_kilometer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["paceSecondsPerKm_____seconds_per_km_"]);
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


export interface Pace_per_kilometer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
