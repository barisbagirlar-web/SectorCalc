// @ts-nocheck
// Auto-generated from rgb-to-hex-calculator-schema.json
import * as z from 'zod';

export interface Rgb_to_hex_calculatorInput {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export const Rgb_to_hex_calculatorInputSchema = z.object({
  red: z.number().default(0),
  green: z.number().default(0),
  blue: z.number().default(0),
  alpha: z.number().default(255),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rgb_to_hex_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.alpha * 16777216 + input.red * 65536 + input.green * 256 + input.blue; results["decimalColor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["decimalColor"] = 0; }
  try { const v = input.red * 65536; results["redPart"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["redPart"] = 0; }
  try { const v = input.green * 256; results["greenPart"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["greenPart"] = 0; }
  try { const v = input.blue; results["bluePart"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bluePart"] = 0; }
  try { const v = input.alpha * 16777216; results["alphaPart"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["alphaPart"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRgb_to_hex_calculator(input: Rgb_to_hex_calculatorInput): Rgb_to_hex_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["decimalColor"]);
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


export interface Rgb_to_hex_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
