// @ts-nocheck
// Auto-generated from bearing-life-calculator-schema.json
import * as z from 'zod';

export interface Bearing_life_calculatorInput {
  C: number;
  P: number;
  n: number;
  p: number;
  a1: number;
}

export const Bearing_life_calculatorInputSchema = z.object({
  C: z.number().default(10),
  P: z.number().default(2),
  n: z.number().default(1500),
  p: z.number().default(3),
  a1: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bearing_life_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.C / input.P; results["cToPRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cToPRatio"] = 0; }
  try { const v = (input.C / input.P) ** input.p; results["basicL10RevMillions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["basicL10RevMillions"] = 0; }
  try { const v = ((input.C / input.P) ** input.p * 1e6) / (60 * input.n); results["basicL10h"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["basicL10h"] = 0; }
  try { const v = input.a1 * ((input.C / input.P) ** input.p * 1e6) / (60 * input.n); results["adjustedL10h"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedL10h"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBearing_life_calculator(input: Bearing_life_calculatorInput): Bearing_life_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedL10h"]);
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


export interface Bearing_life_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
