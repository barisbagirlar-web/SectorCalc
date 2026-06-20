// Auto-generated from running-calculator-schema.json
import * as z from 'zod';

export interface Running_calculatorInput {
  distance: number;
  time_hours: number;
  time_minutes: number;
  time_seconds: number;
  dataConfidence?: number;
}

export const Running_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  time_hours: z.number().default(0),
  time_minutes: z.number().default(50),
  time_seconds: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Running_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.time_hours * 60 + input.time_minutes + input.time_seconds / 60; results["totalTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTimeMinutes"])) / input.distance; results["paceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paceMinPerKm"] = Number.NaN; }
  try { const v = input.distance / ((toNumericFormulaValue(results["totalTimeMinutes"])) / 60); results["speedKmPerH"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedKmPerH"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["paceMinPerKm"])) * 1.60934; results["paceMinPerMile"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paceMinPerMile"] = Number.NaN; }
  return results;
}


export function calculateRunning_calculator(input: Running_calculatorInput): Running_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["paceMinPerKm"]);
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


export interface Running_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
