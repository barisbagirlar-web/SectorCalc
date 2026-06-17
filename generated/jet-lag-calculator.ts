// @ts-nocheck
// Auto-generated from jet-lag-calculator-schema.json
import * as z from 'zod';

export interface Jet_lag_calculatorInput {
  timeZonesCrossed: number;
  direction: number;
  flightDuration: number;
  preTravelRest: number;
  age: number;
}

export const Jet_lag_calculatorInputSchema = z.object({
  timeZonesCrossed: z.number().default(6),
  direction: z.number().default(1),
  flightDuration: z.number().default(8),
  preTravelRest: z.number().default(7),
  age: z.number().default(35),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Jet_lag_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.timeZonesCrossed + input.direction + input.flightDuration; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.timeZonesCrossed + input.direction + input.flightDuration; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateJet_lag_calculator(input: Jet_lag_calculatorInput): Jet_lag_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Jet_lag_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
