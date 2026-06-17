// @ts-nocheck
// Auto-generated from horizontal-curve-calculator-schema.json
import * as z from 'zod';

export interface Horizontal_curve_calculatorInput {
  designSpeed: number;
  superelevation: number;
  frictionFactor: number;
  centralAngle: number;
  stationPI: number;
}

export const Horizontal_curve_calculatorInputSchema = z.object({
  designSpeed: z.number().default(60),
  superelevation: z.number().default(6),
  frictionFactor: z.number().default(0.15),
  centralAngle: z.number().default(90),
  stationPI: z.number().default(1000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Horizontal_curve_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.designSpeed + input.superelevation + input.frictionFactor; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.designSpeed + input.superelevation + input.frictionFactor; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHorizontal_curve_calculator(input: Horizontal_curve_calculatorInput): Horizontal_curve_calculatorOutput {
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


export interface Horizontal_curve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
