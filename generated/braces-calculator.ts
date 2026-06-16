// Auto-generated from braces-calculator-schema.json
import * as z from 'zod';

export interface Braces_calculatorInput {
  span: number;
  height: number;
  bays: number;
  crossSectionArea: number;
  materialDensity: number;
}

export const Braces_calculatorInputSchema = z.object({
  span: z.number().default(5),
  height: z.number().default(3),
  bays: z.number().default(4),
  crossSectionArea: z.number().default(0.001),
  materialDensity: z.number().default(7850),
});

function evaluateAllFormulas(input: Braces_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.span**2 + input.height**2); results["braceLength"] = Number.isFinite(v) ? v : 0; } catch { results["braceLength"] = 0; }
  try { const v = Math.atan(input.height / input.span) * (180 / Math.PI); results["angleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["angleDeg"] = 0; }
  try { const v = (results["braceLength"] ?? 0) * input.bays; results["totalBraceLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalBraceLength"] = 0; }
  try { const v = (results["braceLength"] ?? 0) * input.crossSectionArea; results["braceVolume"] = Number.isFinite(v) ? v : 0; } catch { results["braceVolume"] = 0; }
  try { const v = (results["braceVolume"] ?? 0) * input.materialDensity; results["braceWeight"] = Number.isFinite(v) ? v : 0; } catch { results["braceWeight"] = 0; }
  try { const v = (results["braceWeight"] ?? 0) * input.bays; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


export function calculateBraces_calculator(input: Braces_calculatorInput): Braces_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeight"] ?? 0;
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


export interface Braces_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
