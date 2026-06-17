// @ts-nocheck
// Auto-generated from running-speed-calculator-schema.json
import * as z from 'zod';

export interface Running_speed_calculatorInput {
  distance: number;
  time_hours: number;
  time_minutes: number;
  time_seconds: number;
}

export const Running_speed_calculatorInputSchema = z.object({
  distance: z.number().default(5),
  time_hours: z.number().default(0),
  time_minutes: z.number().default(30),
  time_seconds: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Running_speed_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.time_hours * 3600 + input.time_minutes * 60 + input.time_seconds) / 3600; results["total_time"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_time"] = 0; }
  try { const v = input.distance / (asFormulaNumber(results["total_time"])); results["speed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speed"] = 0; }
  try { const v = (asFormulaNumber(results["total_time"])) * 60 / input.distance; results["pace"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pace"] = 0; }
  try { const v = (asFormulaNumber(results["speed"])) / 3.6; results["speed_ms"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speed_ms"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRunning_speed_calculator(input: Running_speed_calculatorInput): Running_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speed"]);
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


export interface Running_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
