// Auto-generated from spackle-calculator-schema.json
import * as z from 'zod';

export interface Spackle_calculatorInput {
  areaToCover: number;
  numberOfHoles: number;
  holeDiameter: number;
  holeDepth: number;
  spackleDensity: number;
  containerSize: number;
  wasteFactor: number;
}

export const Spackle_calculatorInputSchema = z.object({
  areaToCover: z.number().default(10),
  numberOfHoles: z.number().default(50),
  holeDiameter: z.number().default(5),
  holeDepth: z.number().default(3),
  spackleDensity: z.number().default(1500),
  containerSize: z.number().default(5),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Spackle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow((input.holeDiameter / 2 / 1000), 2) * (input.holeDepth / 1000); results["volumePerHole"] = Number.isFinite(v) ? v : 0; } catch { results["volumePerHole"] = 0; }
  try { const v = input.numberOfHoles * (results["volumePerHole"] ?? 0); results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (results["totalVolume"] ?? 0) * input.spackleDensity; results["spackleWeightKg"] = Number.isFinite(v) ? v : 0; } catch { results["spackleWeightKg"] = 0; }
  try { const v = (results["spackleWeightKg"] ?? 0) * (1 + input.wasteFactor / 100); results["totalWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalWithWaste"] = 0; }
  try { const v = (results["totalWithWaste"] ?? 0) / input.containerSize; results["containersNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["containersNeeded"] = 0; }
  return results;
}


export function calculateSpackle_calculator(input: Spackle_calculatorInput): Spackle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWithWaste"] ?? 0;
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


export interface Spackle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
