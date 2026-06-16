// Auto-generated from us-fl-oz-to-imperial-fl-oz-schema.json
import * as z from 'zod';

export interface Us_fl_oz_to_imperial_fl_ozInput {
  us_fl_oz: number;
}

export const Us_fl_oz_to_imperial_fl_ozInputSchema = z.object({
  us_fl_oz: z.number().default(1),
});

function evaluateAllFormulas(input: Us_fl_oz_to_imperial_fl_ozInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.us_fl_oz * 1.040842730786; results["imperial_fl_oz"] = Number.isFinite(v) ? v : 0; } catch { results["imperial_fl_oz"] = 0; }
  return results;
}


export function calculateUs_fl_oz_to_imperial_fl_oz(input: Us_fl_oz_to_imperial_fl_ozInput): Us_fl_oz_to_imperial_fl_ozOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["imperial_fl_oz"] ?? 0;
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


export interface Us_fl_oz_to_imperial_fl_ozOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
