// Auto-generated from pixels-to-inches-calculator-schema.json
import * as z from 'zod';

export interface Pixels_to_inches_calculatorInput {
  widthPixels: number;
  heightPixels: number;
  ppi: number;
  decimals: number;
}

export const Pixels_to_inches_calculatorInputSchema = z.object({
  widthPixels: z.number().default(1920),
  heightPixels: z.number().default(1080),
  ppi: z.number().default(96),
  decimals: z.number().default(2),
});

function evaluateAllFormulas(input: Pixels_to_inches_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.widthPixels / input.ppi; results["widthInches"] = Number.isFinite(v) ? v : 0; } catch { results["widthInches"] = 0; }
  try { const v = input.heightPixels / input.ppi; results["heightInches"] = Number.isFinite(v) ? v : 0; } catch { results["heightInches"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.widthPixels / input.ppi, 2) + Math.pow(input.heightPixels / input.ppi, 2)); results["diagonalInches"] = Number.isFinite(v) ? v : 0; } catch { results["diagonalInches"] = 0; }
  results["____widthInches_toFixed_decimals______in"] = 0;
  results["____heightInches_toFixed_decimals______i"] = 0;
  results["____diagonalInches_toFixed_decimals_____"] = 0;
  try { const v = "Width: " + (results["widthInches"] ?? 0).toFixed(input.decimals) + " in, Height: " + (results["heightInches"] ?? 0).toFixed(input.decimals) + " in"; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculatePixels_to_inches_calculator(input: Pixels_to_inches_calculatorInput): Pixels_to_inches_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Pixels_to_inches_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
