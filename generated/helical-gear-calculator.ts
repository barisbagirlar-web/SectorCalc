// @ts-nocheck
// Auto-generated from helical-gear-calculator-schema.json
import * as z from 'zod';

export interface Helical_gear_calculatorInput {
  mn: number;
  z: number;
  beta: number;
  alpha: number;
  ha: number;
  c: number;
}

export const Helical_gear_calculatorInputSchema = z.object({
  mn: z.number().default(2),
  z: z.number().default(20),
  beta: z.number().default(15),
  alpha: z.number().default(20),
  ha: z.number().default(1),
  c: z.number().default(0.25),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Helical_gear_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Math.PI * input.mn; results["normalCircularPitch"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalCircularPitch"] = 0; }
  try { const v = Math.PI * input.mn; results["normalCircularPitch_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalCircularPitch_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHelical_gear_calculator(input: Helical_gear_calculatorInput): Helical_gear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["normalCircularPitch_aux"]);
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


export interface Helical_gear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
