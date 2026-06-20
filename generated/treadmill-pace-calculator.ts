// Auto-generated from treadmill-pace-calculator-schema.json
import * as z from 'zod';

export interface Treadmill_pace_calculatorInput {
  distance: number;
  hours: number;
  minutes: number;
  seconds: number;
  dataConfidence?: number;
}

export const Treadmill_pace_calculatorInputSchema = z.object({
  distance: z.number().default(5),
  hours: z.number().default(0),
  minutes: z.number().default(30),
  seconds: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Treadmill_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 3600 + input.minutes * 60 + input.seconds; results["totalSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSeconds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSeconds"])) / input.distance; results["paceSecondsPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paceSecondsPerKm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["paceSecondsPerKm"])) / 60; results["paceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paceMinPerKm"] = Number.NaN; }
  try { const v = (input.distance * 3600) / (toNumericFormulaValue(results["totalSeconds"])); results["speedKmh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedKmh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["paceSecondsPerKm"])) * 1.60934 / 60; results["paceMinPerMile"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paceMinPerMile"] = Number.NaN; }
  return results;
}


export function calculateTreadmill_pace_calculator(input: Treadmill_pace_calculatorInput): Treadmill_pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["paceMinPerMile"]);
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


export interface Treadmill_pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
