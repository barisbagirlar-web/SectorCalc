// @ts-nocheck
// Auto-generated from pace-calculator-schema.json
import * as z from 'zod';

export interface Pace_calculatorInput {
  distanceKm: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Pace_calculatorInputSchema = z.object({
  distanceKm: z.number().default(1),
  hours: z.number().default(0),
  minutes: z.number().default(0),
  seconds: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pace_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.hours + input.minutes/60 + input.seconds/3600; results["totalHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalHours"] = 0; }
  try { const v = input.distanceKm / (asFormulaNumber(results["totalHours"])); results["speedKmh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speedKmh"] = 0; }
  try { const v = (asFormulaNumber(results["totalHours"])) * 60 / input.distanceKm; results["pacePerKm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pacePerKm"] = 0; }
  try { const v = (asFormulaNumber(results["pacePerKm"])) * 1.60934; results["pacePerMile"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pacePerMile"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePace_calculator(input: Pace_calculatorInput): Pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speedKmh"]);
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


export interface Pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
