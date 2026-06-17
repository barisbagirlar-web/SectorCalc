// @ts-nocheck
// Auto-generated from butt-weld-calculator-schema.json
import * as z from 'zod';

export interface Butt_weld_calculatorInput {
  plateThickness: number;
  rootGap: number;
  includedAngle: number;
  weldLength: number;
  metalDensity: number;
}

export const Butt_weld_calculatorInputSchema = z.object({
  plateThickness: z.number().default(10),
  rootGap: z.number().default(2),
  includedAngle: z.number().default(60),
  weldLength: z.number().default(1),
  metalDensity: z.number().default(7850),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Butt_weld_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.plateThickness + input.rootGap + input.includedAngle; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.plateThickness + input.rootGap + input.includedAngle; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateButt_weld_calculator(input: Butt_weld_calculatorInput): Butt_weld_calculatorOutput {
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


export interface Butt_weld_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
