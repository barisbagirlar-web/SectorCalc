// Auto-generated from pixel-density-calculator-schema.json
import * as z from 'zod';

export interface Pixel_density_calculatorInput {
  widthPx: number;
  heightPx: number;
  diagonalInch: number;
}

export const Pixel_density_calculatorInputSchema = z.object({
  widthPx: z.number().default(1920),
  heightPx: z.number().default(1080),
  diagonalInch: z.number().default(24),
});

function evaluateAllFormulas(input: Pixel_density_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((input.widthPx ** 2) + (input.heightPx ** 2)) / input.diagonalInch; results["ppi"] = Number.isFinite(v) ? v : 0; } catch { results["ppi"] = 0; }
  try { const v = 25.4 / (Math.sqrt((input.widthPx ** 2) + (input.heightPx ** 2)) / input.diagonalInch); results["dotPitchMm"] = Number.isFinite(v) ? v : 0; } catch { results["dotPitchMm"] = 0; }
  try { const v = input.widthPx * input.heightPx; results["totalPixels"] = Number.isFinite(v) ? v : 0; } catch { results["totalPixels"] = 0; }
  try { const v = input.widthPx / input.heightPx; results["aspectRatio"] = Number.isFinite(v) ? v : 0; } catch { results["aspectRatio"] = 0; }
  return results;
}


export function calculatePixel_density_calculator(input: Pixel_density_calculatorInput): Pixel_density_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ppi"] ?? 0;
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


export interface Pixel_density_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
