// Auto-generated from gallons-to-liters-schema.json
import * as z from 'zod';

export interface Gallons_to_litersInput {
  gallons: number;
  precision: number;
}

export const Gallons_to_litersInputSchema = z.object({
  gallons: z.number().default(1),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Gallons_to_litersInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gallons * 3.785411784; results["liters"] = Number.isFinite(v) ? v : 0; } catch { results["liters"] = 0; }
  try { const v = Math.round((results["liters"] ?? 0) * 10 ** input.precision) / (10 ** input.precision); results["roundedLiters"] = Number.isFinite(v) ? v : 0; } catch { results["roundedLiters"] = 0; }
  return results;
}


export function calculateGallons_to_liters(input: Gallons_to_litersInput): Gallons_to_litersOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedLiters"] ?? 0;
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


export interface Gallons_to_litersOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
