// @ts-nocheck
// Auto-generated from depth-of-field-calculator-schema.json
import * as z from 'zod';

export interface Depth_of_field_calculatorInput {
  focalLength: number;
  aperture: number;
  subjectDistance: number;
  circleOfConfusion: number;
}

export const Depth_of_field_calculatorInputSchema = z.object({
  focalLength: z.number().default(50),
  aperture: z.number().default(8),
  subjectDistance: z.number().default(10),
  circleOfConfusion: z.number().default(0.03),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Depth_of_field_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.subjectDistance * 1000; results["subjectDistanceMM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["subjectDistanceMM"] = 0; }
  try { const v = input.subjectDistance * 1000; results["subjectDistanceMM_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["subjectDistanceMM_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDepth_of_field_calculator(input: Depth_of_field_calculatorInput): Depth_of_field_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["subjectDistanceMM_aux"]);
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


export interface Depth_of_field_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
