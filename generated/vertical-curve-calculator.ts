// @ts-nocheck
// Auto-generated from vertical-curve-calculator-schema.json
import * as z from 'zod';

export interface Vertical_curve_calculatorInput {
  g1: number;
  g2: number;
  L: number;
  station_PVC: number;
  elevation_PVC: number;
  target_station: number;
}

export const Vertical_curve_calculatorInputSchema = z.object({
  g1: z.number().default(-2),
  g2: z.number().default(1),
  L: z.number().default(200),
  station_PVC: z.number().default(0),
  elevation_PVC: z.number().default(100),
  target_station: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vertical_curve_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.g1 + input.g2 + input.L; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.g1 + input.g2 + input.L; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVertical_curve_calculator(input: Vertical_curve_calculatorInput): Vertical_curve_calculatorOutput {
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


export interface Vertical_curve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
