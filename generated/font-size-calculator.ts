// Auto-generated from font-size-calculator-schema.json
import * as z from 'zod';

export interface Font_size_calculatorInput {
  viewingDistance: number;
  visualAcuity: number;
  safetyFactor: number;
  pointConversion: number;
  pixelDensity: number;
}

export const Font_size_calculatorInputSchema = z.object({
  viewingDistance: z.number().default(1),
  visualAcuity: z.number().default(5),
  safetyFactor: z.number().default(1.2),
  pointConversion: z.number().default(0.3528),
  pixelDensity: z.number().default(96),
});

function evaluateAllFormulas(input: Font_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.viewingDistance * 1000 * Math.tan((input.visualAcuity / 60) * Math.PI / 180) * input.safetyFactor; results["recommendedHeight_mm"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedHeight_mm"] = 0; }
  try { const v = (results["recommendedHeight_mm"] ?? 0) / input.pointConversion; results["fontSizePt"] = Number.isFinite(v) ? v : 0; } catch { results["fontSizePt"] = 0; }
  try { const v = ((results["recommendedHeight_mm"] ?? 0) / 25.4) * input.pixelDensity; results["fontSizePx"] = Number.isFinite(v) ? v : 0; } catch { results["fontSizePx"] = 0; }
  return results;
}


export function calculateFont_size_calculator(input: Font_size_calculatorInput): Font_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fontSizePt"] ?? 0;
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


export interface Font_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
