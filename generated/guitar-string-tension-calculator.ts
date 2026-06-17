// @ts-nocheck
// Auto-generated from guitar-string-tension-calculator-schema.json
import * as z from 'zod';

export interface Guitar_string_tension_calculatorInput {
  scaleLength: number;
  stringDiameter: number;
  materialDensity: number;
  targetFrequency: number;
}

export const Guitar_string_tension_calculatorInputSchema = z.object({
  scaleLength: z.number().default(0.648),
  stringDiameter: z.number().default(0.254),
  materialDensity: z.number().default(7850),
  targetFrequency: z.number().default(329.63),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Guitar_string_tension_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.materialDensity * Math.PI * (input.stringDiameter / 2000) ** 2; results["mu"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mu"] = 0; }
  try { const v = 4 * input.scaleLength ** 2 * input.targetFrequency ** 2 * (asFormulaNumber(results["mu"])); results["tension"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tension"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGuitar_string_tension_calculator(input: Guitar_string_tension_calculatorInput): Guitar_string_tension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tension"]);
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


export interface Guitar_string_tension_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
