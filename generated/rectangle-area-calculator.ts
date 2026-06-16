// Auto-generated from rectangle-area-calculator-schema.json
import * as z from 'zod';

export interface Rectangle_area_calculatorInput {
  lengthMm: number;
  widthMm: number;
  conversionFactor: number;
  tolerancePercent: number;
  safetyFactor: number;
}

export const Rectangle_area_calculatorInputSchema = z.object({
  lengthMm: z.number().default(1000),
  widthMm: z.number().default(1000),
  conversionFactor: z.number().default(0.000001),
  tolerancePercent: z.number().default(0),
  safetyFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Rectangle_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lengthMm * (1 + input.tolerancePercent/100); results["effectiveLengthMm"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveLengthMm"] = 0; }
  try { const v = input.widthMm * (1 + input.tolerancePercent/100); results["effectiveWidthMm"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveWidthMm"] = 0; }
  try { const v = (results["effectiveLengthMm"] ?? 0) * (results["effectiveWidthMm"] ?? 0); results["rawAreaMm2"] = Number.isFinite(v) ? v : 0; } catch { results["rawAreaMm2"] = 0; }
  try { const v = (results["rawAreaMm2"] ?? 0) * input.conversionFactor * input.safetyFactor; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  return results;
}


export function calculateRectangle_area_calculator(input: Rectangle_area_calculatorInput): Rectangle_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["area"] ?? 0;
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


export interface Rectangle_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
