// Auto-generated from pixel-calculator-schema.json
import * as z from 'zod';

export interface Pixel_calculatorInput {
  widthPx: number;
  heightPx: number;
  diagInches: number;
  pixelAspect: number;
}

export const Pixel_calculatorInputSchema = z.object({
  widthPx: z.number().default(1920),
  heightPx: z.number().default(1080),
  diagInches: z.number().default(24),
  pixelAspect: z.number().default(1),
});

function evaluateAllFormulas(input: Pixel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(Math.pow(input.widthPx * input.pixelAspect, 2) + Math.pow(input.heightPx, 2)) / input.diagInches; results["ppi"] = Number.isFinite(v) ? v : 0; } catch { results["ppi"] = 0; }
  try { const v = 25.4 * input.diagInches / Math.sqrt(Math.pow(input.widthPx * input.pixelAspect, 2) + Math.pow(input.heightPx, 2)); results["pixelPitch"] = Number.isFinite(v) ? v : 0; } catch { results["pixelPitch"] = 0; }
  try { const v = input.diagInches * (input.widthPx * input.pixelAspect) / Math.sqrt(Math.pow(input.widthPx * input.pixelAspect, 2) + Math.pow(input.heightPx, 2)); results["screenWidthInches"] = Number.isFinite(v) ? v : 0; } catch { results["screenWidthInches"] = 0; }
  try { const v = input.diagInches * input.heightPx / Math.sqrt(Math.pow(input.widthPx * input.pixelAspect, 2) + Math.pow(input.heightPx, 2)); results["screenHeightInches"] = Number.isFinite(v) ? v : 0; } catch { results["screenHeightInches"] = 0; }
  try { const v = (input.widthPx * input.heightPx) / 1000000; results["megapixels"] = Number.isFinite(v) ? v : 0; } catch { results["megapixels"] = 0; }
  return results;
}


export function calculatePixel_calculator(input: Pixel_calculatorInput): Pixel_calculatorOutput {
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


export interface Pixel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
