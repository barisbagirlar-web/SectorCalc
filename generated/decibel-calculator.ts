// @ts-nocheck
// Auto-generated from decibel-calculator-schema.json
import * as z from 'zod';

export interface Decibel_calculatorInput {
  powerRef: number;
  powerMeas: number;
  ampRef: number;
  ampMeas: number;
}

export const Decibel_calculatorInputSchema = z.object({
  powerRef: z.number().default(1),
  powerMeas: z.number().default(2),
  ampRef: z.number().default(1),
  ampMeas: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Decibel_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.powerMeas / input.powerRef; results["powerRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["powerRatio"] = 0; }
  try { const v = input.powerMeas / input.powerRef; results["powerRatio_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["powerRatio_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDecibel_calculator(input: Decibel_calculatorInput): Decibel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["powerRatio_aux"]);
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


export interface Decibel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
