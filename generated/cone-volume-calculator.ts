// @ts-nocheck
// Auto-generated from cone-volume-calculator-schema.json
import * as z from 'zod';

export interface Cone_volume_calculatorInput {
  radius: number;
  height: number;
  slantHeight: number;
  diameter: number;
  precision: number;
  calcSurface: number;
}

export const Cone_volume_calculatorInputSchema = z.object({
  radius: z.number().default(1),
  height: z.number().default(2),
  slantHeight: z.number().default(0),
  diameter: z.number().default(0),
  precision: z.number().default(2),
  calcSurface: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cone_volume_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.radius + input.height + input.slantHeight; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.radius + input.height + input.slantHeight; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCone_volume_calculator(input: Cone_volume_calculatorInput): Cone_volume_calculatorOutput {
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


export interface Cone_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
