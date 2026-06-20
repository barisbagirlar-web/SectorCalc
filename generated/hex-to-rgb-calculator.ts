// Auto-generated from hex-to-rgb-calculator-schema.json
import * as z from 'zod';

export interface Hex_to_rgb_calculatorInput {
  rHigh: number;
  rLow: number;
  gHigh: number;
  gLow: number;
  bHigh: number;
  bLow: number;
  dataConfidence?: number;
}

export const Hex_to_rgb_calculatorInputSchema = z.object({
  rHigh: z.number().default(0),
  rLow: z.number().default(0),
  gHigh: z.number().default(0),
  gLow: z.number().default(0),
  bHigh: z.number().default(0),
  bLow: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hex_to_rgb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rHigh * 16 + input.rLow; results["red"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["red"] = Number.NaN; }
  try { const v = input.gHigh * 16 + input.gLow; results["green"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["green"] = Number.NaN; }
  try { const v = input.bHigh * 16 + input.bLow; results["blue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["blue"] = Number.NaN; }
  try { const v = 'rgb(' + (toNumericFormulaValue(results["red"])) + ', ' + (toNumericFormulaValue(results["green"])) + ', ' + (toNumericFormulaValue(results["blue"])) + ')'; results["rgbString"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rgbString"] = Number.NaN; }
  return results;
}


export function calculateHex_to_rgb_calculator(input: Hex_to_rgb_calculatorInput): Hex_to_rgb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["red"]);
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


export interface Hex_to_rgb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
