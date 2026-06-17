// Auto-generated from tons-of-refrigeration-to-kw-schema.json
import * as z from 'zod';

export interface Tons_of_refrigeration_to_kwInput {
  tons: number;
  auto_input_2: number;
  auto_input_3: number;
}

export const Tons_of_refrigeration_to_kwInputSchema = z.object({
  tons: z.number().default(1),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Tons_of_refrigeration_to_kwInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tons * 3.5168525; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.tons; results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  try { const v = Power in kilowatts; results["Power_in_kilowatts"] = Number.isFinite(v) ? v : 0; } catch { results["Power_in_kilowatts"] = 0; }
  return results;
}


export function calculateTons_of_refrigeration_to_kw(input: Tons_of_refrigeration_to_kwInput): Tons_of_refrigeration_to_kwOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Tons_of_refrigeration_to_kwOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
