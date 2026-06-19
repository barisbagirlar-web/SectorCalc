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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Running_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 60 + input.minutes + input.seconds / 60; results["totalTimeMin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTimeMin"] = 0; }
  try { const v = (input.hours * 60 + input.minutes + input.seconds / 60) / input.distance; results["paceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["paceMinPerKm"] = 0; }
  try { const v = input.distance / ((input.hours * 60 + input.minutes + input.seconds / 60) / 60); results["speedKmPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speedKmPerHour"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRunning_pace_calculator(input: Running_pace_calculatorInput): Running_pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["paceMinPerKm"]));
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


export interface Running_pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
