// @ts-nocheck
// Auto-generated from gradient-calculator-schema.json
import * as z from 'zod';

export interface Gradient_calculatorInput {
  startEasting: number;
  startNorthing: number;
  startElevation: number;
  endEasting: number;
  endNorthing: number;
  endElevation: number;
}

export const Gradient_calculatorInputSchema = z.object({
  startEasting: z.number().default(0),
  startNorthing: z.number().default(0),
  startElevation: z.number().default(0),
  endEasting: z.number().default(1),
  endNorthing: z.number().default(0),
  endElevation: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gradient_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.endElevation - input.startElevation; results["rise"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rise"] = 0; }
  try { const v = input.endElevation - input.startElevation; results["rise_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rise_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGradient_calculator(input: Gradient_calculatorInput): Gradient_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rise_aux"]);
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


export interface Gradient_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
