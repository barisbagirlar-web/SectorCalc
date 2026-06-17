// @ts-nocheck
// Auto-generated from running-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Running_equivalent_calculatorInput {
  knownDistance: number;
  knownTimeMinutes: number;
  knownTimeSeconds: number;
  targetDistance: number;
  exponent: number;
}

export const Running_equivalent_calculatorInputSchema = z.object({
  knownDistance: z.number().default(5),
  knownTimeMinutes: z.number().default(25),
  knownTimeSeconds: z.number().default(0),
  targetDistance: z.number().default(10),
  exponent: z.number().default(1.06),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Running_equivalent_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.knownTimeMinutes + input.knownTimeSeconds / 60; results["totalKnownTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalKnownTime"] = 0; }
  try { const v = input.knownTimeMinutes + input.knownTimeSeconds / 60; results["totalKnownTime_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalKnownTime_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRunning_equivalent_calculator(input: Running_equivalent_calculatorInput): Running_equivalent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalKnownTime_aux"]);
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


export interface Running_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
