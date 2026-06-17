// @ts-nocheck
// Auto-generated from running-calculator-schema.json
import * as z from 'zod';

export interface Running_calculatorInput {
  distance: number;
  time_hours: number;
  time_minutes: number;
  time_seconds: number;
}

export const Running_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  time_hours: z.number().default(0),
  time_minutes: z.number().default(50),
  time_seconds: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Running_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.time_hours * 60 + input.time_minutes + input.time_seconds / 60; results["totalTimeMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["totalTimeMinutes"])) / input.distance; results["paceMinPerKm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["paceMinPerKm"] = 0; }
  try { const v = input.distance / ((asFormulaNumber(results["totalTimeMinutes"])) / 60); results["speedKmPerH"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speedKmPerH"] = 0; }
  try { const v = (asFormulaNumber(results["paceMinPerKm"])) * 1.60934; results["paceMinPerMile"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["paceMinPerMile"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRunning_calculator(input: Running_calculatorInput): Running_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["paceMinPerKm"]);
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


export interface Running_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
