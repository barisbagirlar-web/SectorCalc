// @ts-nocheck
// Auto-generated from cmyk-to-rgb-converter-calculator-schema.json
import * as z from 'zod';

export interface Cmyk_to_rgb_converter_calculatorInput {
  c: number;
  m: number;
  y: number;
  k: number;
}

export const Cmyk_to_rgb_converter_calculatorInputSchema = z.object({
  c: z.number().default(0),
  m: z.number().default(0),
  y: z.number().default(0),
  k: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cmyk_to_rgb_converter_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 255 * (1 - input.c / 100) * (1 - input.k / 100); results["R"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["R"] = 0; }
  try { const v = 255 * (1 - input.m / 100) * (1 - input.k / 100); results["G"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["G"] = 0; }
  try { const v = 255 * (1 - input.y / 100) * (1 - input.k / 100); results["B"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["B"] = 0; }
  try { const v = 0.299 * (asFormulaNumber(results["R"])) + 0.587 * (asFormulaNumber(results["G"])) + 0.114 * (asFormulaNumber(results["B"])); results["grayscale"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grayscale"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCmyk_to_rgb_converter_calculator(input: Cmyk_to_rgb_converter_calculatorInput): Cmyk_to_rgb_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grayscale"]);
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


export interface Cmyk_to_rgb_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
