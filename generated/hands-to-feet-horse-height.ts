// Auto-generated from hands-to-feet-horse-height-schema.json
import * as z from 'zod';

export interface Hands_to_feet_horse_heightInput {
  hands: number;
  inches: number;
}

export const Hands_to_feet_horse_heightInputSchema = z.object({
  hands: z.number().default(15),
  inches: z.number().default(0),
});

function evaluateAllFormulas(input: Hands_to_feet_horse_heightInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hands * 4 + input.inches; results["totalInches"] = Number.isFinite(v) ? v : 0; } catch { results["totalInches"] = 0; }
  try { const v = Math.floor((results["totalInches"] ?? 0) / 12); results["feet"] = Number.isFinite(v) ? v : 0; } catch { results["feet"] = 0; }
  try { const v = (results["totalInches"] ?? 0) % 12; results["remainingInches"] = Number.isFinite(v) ? v : 0; } catch { results["remainingInches"] = 0; }
  try { const v = (results["feet"] ?? 0) + ' ft ' + (results["remainingInches"] ?? 0) + ' in'; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateHands_to_feet_horse_height(input: Hands_to_feet_horse_heightInput): Hands_to_feet_horse_heightOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["feet"] ?? 0;
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


export interface Hands_to_feet_horse_heightOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
