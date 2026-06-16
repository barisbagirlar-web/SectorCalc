// Auto-generated from dpi-calculator-schema.json
import * as z from 'zod';

export interface Dpi_calculatorInput {
  widthPixels: number;
  heightPixels: number;
  widthInches: number;
  heightInches: number;
}

export const Dpi_calculatorInputSchema = z.object({
  widthPixels: z.number().default(1920),
  heightPixels: z.number().default(1080),
  widthInches: z.number().default(13.6),
  heightInches: z.number().default(7.65),
});

function evaluateAllFormulas(input: Dpi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.widthPixels / input.widthInches; results["horizontalDpi"] = Number.isFinite(v) ? v : 0; } catch { results["horizontalDpi"] = 0; }
  try { const v = input.heightPixels / input.heightInches; results["verticalDpi"] = Number.isFinite(v) ? v : 0; } catch { results["verticalDpi"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.widthPixels, 2) + Math.pow(input.heightPixels, 2)) / Math.sqrt(Math.pow(input.widthInches, 2) + Math.pow(input.heightInches, 2)); results["diagonalDpi"] = Number.isFinite(v) ? v : 0; } catch { results["diagonalDpi"] = 0; }
  return results;
}


export function calculateDpi_calculator(input: Dpi_calculatorInput): Dpi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["diagonalDpi"] ?? 0;
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


export interface Dpi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
