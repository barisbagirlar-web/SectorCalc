// @ts-nocheck
// Auto-generated from ceiling-joist-calculator-schema.json
import * as z from 'zod';

export interface Ceiling_joist_calculatorInput {
  span: number;
  spacing: number;
  liveLoad: number;
  deadLoad: number;
  eModulus: number;
  iValue: number;
}

export const Ceiling_joist_calculatorInputSchema = z.object({
  span: z.number().default(12),
  spacing: z.number().default(16),
  liveLoad: z.number().default(40),
  deadLoad: z.number().default(10),
  eModulus: z.number().default(1600000),
  iValue: z.number().default(47.6),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ceiling_joist_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.liveLoad + input.deadLoad; results["totalLoad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLoad"] = 0; }
  try { const v = (input.liveLoad + input.deadLoad) * input.spacing / 144; results["uniformLoad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["uniformLoad"] = 0; }
  try { const v = input.span * 12 / 240; results["allowableDeflection"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["allowableDeflection"] = 0; }
  try { const v = (5 * (asFormulaNumber(results["uniformLoad"])) * (input.span * 12)**4) / (384 * input.eModulus * input.iValue); results["actualDeflection"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actualDeflection"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCeiling_joist_calculator(input: Ceiling_joist_calculatorInput): Ceiling_joist_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["allowableDeflection"]);
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


export interface Ceiling_joist_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
