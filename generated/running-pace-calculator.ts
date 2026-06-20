// Auto-generated from running-pace-calculator-schema.json
import * as z from 'zod';

export interface Running_pace_calculatorInput {
  distance: number;
  hours: number;
  minutes: number;
  seconds: number;
  dataConfidence?: number;
}

export const Running_pace_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  hours: z.number().default(0),
  minutes: z.number().default(50),
  seconds: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Running_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 60 + input.minutes + input.seconds / 60; results["totalTimeMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeMin"] = Number.NaN; }
  try { const v = (input.hours * 60 + input.minutes + input.seconds / 60) / input.distance; results["paceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paceMinPerKm"] = Number.NaN; }
  try { const v = input.distance / ((input.hours * 60 + input.minutes + input.seconds / 60) / 60); results["speedKmPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedKmPerHour"] = Number.NaN; }
  return results;
}


export function calculateRunning_pace_calculator(input: Running_pace_calculatorInput): Running_pace_calculatorOutput {
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


export interface Running_pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
