// Auto-generated from plaster-calculator-schema.json
import * as z from 'zod';

export interface Plaster_calculatorInput {
  wallLength: number;
  wallHeight: number;
  plasterThickness: number;
  mixRatioCement: number;
  mixRatioSand: number;
  cementBagWeight: number;
  wastageFactor: number;
}

export const Plaster_calculatorInputSchema = z.object({
  wallLength: z.number().default(5),
  wallHeight: z.number().default(2.5),
  plasterThickness: z.number().default(2),
  mixRatioCement: z.number().default(1),
  mixRatioSand: z.number().default(4),
  cementBagWeight: z.number().default(50),
  wastageFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Plaster_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight; results["wallArea"] = Number.isFinite(v) ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = (results["wallArea"] ?? 0) * (input.plasterThickness / 100); results["wetVolume"] = Number.isFinite(v) ? v : 0; } catch { results["wetVolume"] = 0; }
  try { const v = 0.3; results["dryVolumeIncreaseFactor"] = Number.isFinite(v) ? v : 0; } catch { results["dryVolumeIncreaseFactor"] = 0; }
  try { const v = (results["wetVolume"] ?? 0) * (1 + (results["dryVolumeIncreaseFactor"] ?? 0)); results["dryVolume"] = Number.isFinite(v) ? v : 0; } catch { results["dryVolume"] = 0; }
  try { const v = (results["dryVolume"] ?? 0) * (1 + input.wastageFactor / 100); results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = input.mixRatioCement + input.mixRatioSand; results["totalMixParts"] = Number.isFinite(v) ? v : 0; } catch { results["totalMixParts"] = 0; }
  try { const v = (results["totalVolume"] ?? 0) * (input.mixRatioCement / (results["totalMixParts"] ?? 0)); results["cementVolume"] = Number.isFinite(v) ? v : 0; } catch { results["cementVolume"] = 0; }
  try { const v = (results["totalVolume"] ?? 0) * (input.mixRatioSand / (results["totalMixParts"] ?? 0)); results["sandVolume"] = Number.isFinite(v) ? v : 0; } catch { results["sandVolume"] = 0; }
  try { const v = 1440; results["cementDensity"] = Number.isFinite(v) ? v : 0; } catch { results["cementDensity"] = 0; }
  try { const v = (results["cementVolume"] ?? 0) * (results["cementDensity"] ?? 0); results["cementWeight"] = Number.isFinite(v) ? v : 0; } catch { results["cementWeight"] = 0; }
  try { const v = (results["cementWeight"] ?? 0) / input.cementBagWeight; results["requiredBags"] = Number.isFinite(v) ? v : 0; } catch { results["requiredBags"] = 0; }
  try { const v = Math.ceil((results["requiredBags"] ?? 0)); results["recommendedBags"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedBags"] = 0; }
  return results;
}


export function calculatePlaster_calculator(input: Plaster_calculatorInput): Plaster_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommendedBags"] ?? 0;
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


export interface Plaster_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
