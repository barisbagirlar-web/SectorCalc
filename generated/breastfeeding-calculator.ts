// Auto-generated from breastfeeding-calculator-schema.json
import * as z from 'zod';

export interface Breastfeeding_calculatorInput {
  babyWeight: number;
  dailyFeeds: number;
  milkDensity: number;
  wastageFactor: number;
}

export const Breastfeeding_calculatorInputSchema = z.object({
  babyWeight: z.number().default(3.5),
  dailyFeeds: z.number().default(8),
  milkDensity: z.number().default(1.03),
  wastageFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Breastfeeding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.babyWeight * 150; results["dailyVolume"] = Number.isFinite(v) ? v : 0; } catch { results["dailyVolume"] = 0; }
  try { const v = (results["dailyVolume"] ?? 0) / input.dailyFeeds; results["perFeedVolume"] = Number.isFinite(v) ? v : 0; } catch { results["perFeedVolume"] = 0; }
  try { const v = (results["dailyVolume"] ?? 0) * input.milkDensity; results["totalMass"] = Number.isFinite(v) ? v : 0; } catch { results["totalMass"] = 0; }
  try { const v = (results["dailyVolume"] ?? 0) / (1 - input.wastageFactor / 100); results["productionVolume"] = Number.isFinite(v) ? v : 0; } catch { results["productionVolume"] = 0; }
  return results;
}


export function calculateBreastfeeding_calculator(input: Breastfeeding_calculatorInput): Breastfeeding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyVolume"] ?? 0;
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


export interface Breastfeeding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
