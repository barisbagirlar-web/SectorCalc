// Auto-generated from rgb-to-hex-calculator-schema.json
import * as z from 'zod';

export interface Rgb_to_hex_calculatorInput {
  red: number;
  green: number;
  blue: number;
  alpha: number;
  dataConfidence?: number;
}

export const Rgb_to_hex_calculatorInputSchema = z.object({
  red: z.number().default(0),
  green: z.number().default(0),
  blue: z.number().default(0),
  alpha: z.number().default(255),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rgb_to_hex_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.alpha * 16777216 + input.red * 65536 + input.green * 256 + input.blue; results["decimalColor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["decimalColor"] = Number.NaN; }
  try { const v = input.red * 65536; results["redPart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["redPart"] = Number.NaN; }
  try { const v = input.green * 256; results["greenPart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["greenPart"] = Number.NaN; }
  try { const v = input.blue; results["bluePart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bluePart"] = Number.NaN; }
  try { const v = input.alpha * 16777216; results["alphaPart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alphaPart"] = Number.NaN; }
  return results;
}


export function calculateRgb_to_hex_calculator(input: Rgb_to_hex_calculatorInput): Rgb_to_hex_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["decimalColor"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
