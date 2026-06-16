// Auto-generated from asphalt-shingle-calculator-schema.json
import * as z from 'zod';

export interface Asphalt_shingle_calculatorInput {
  roofLength: number;
  roofWidth: number;
  pitch: number;
  numberOfPlanes: number;
  wasteFactor: number;
  bundleCoverage: number;
}

export const Asphalt_shingle_calculatorInputSchema = z.object({
  roofLength: z.number().default(40),
  roofWidth: z.number().default(30),
  pitch: z.number().default(4),
  numberOfPlanes: z.number().default(2),
  wasteFactor: z.number().default(10),
  bundleCoverage: z.number().default(33.33),
});

function evaluateAllFormulas(input: Asphalt_shingle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(1 + Math.pow(input.pitch / 12, 2)); results["slopeFactor"] = Number.isFinite(v) ? v : 0; } catch { results["slopeFactor"] = 0; }
  try { const v = input.roofLength * input.roofWidth * (results["slopeFactor"] ?? 0); results["singlePlaneArea"] = Number.isFinite(v) ? v : 0; } catch { results["singlePlaneArea"] = 0; }
  try { const v = (results["singlePlaneArea"] ?? 0) * input.numberOfPlanes; results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = (results["totalArea"] ?? 0) * (1 + input.wasteFactor / 100); results["areaWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["areaWithWaste"] = 0; }
  try { const v = Math.ceil((results["areaWithWaste"] ?? 0) / input.bundleCoverage); results["bundlesNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["bundlesNeeded"] = 0; }
  try { const v = (results["areaWithWaste"] ?? 0) / 100; results["squares"] = Number.isFinite(v) ? v : 0; } catch { results["squares"] = 0; }
  return results;
}


export function calculateAsphalt_shingle_calculator(input: Asphalt_shingle_calculatorInput): Asphalt_shingle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bundlesNeeded"] ?? 0;
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


export interface Asphalt_shingle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
