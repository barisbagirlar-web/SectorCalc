// Auto-generated from hands-to-feet-horse-height-schema.json
import * as z from 'zod';

export interface Hands_to_feet_horse_heightInput {
  hands: number;
  inches: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Hands_to_feet_horse_heightInputSchema = z.object({
  hands: z.number().default(15),
  inches: z.number().default(0),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hands_to_feet_horse_heightInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hands * 4 + input.inches; results["totalInches"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInches"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalInches"])) + ' input.inches total'; results["totalInches_____inches_total_"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInches_____inches_total_"] = Number.NaN; }
  return results;
}


export function calculateHands_to_feet_horse_height(input: Hands_to_feet_horse_heightInput): Hands_to_feet_horse_heightOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalInches_____inches_total_"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
