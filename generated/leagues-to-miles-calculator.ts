// Auto-generated from leagues-to-miles-calculator-schema.json
import * as z from 'zod';

export interface Leagues_to_miles_calculatorInput {
  leagues: number;
  leagueType: number;
  decimals: number;
  conversionFactorOverride: number;
}

export const Leagues_to_miles_calculatorInputSchema = z.object({
  leagues: z.number().default(1),
  leagueType: z.number().default(0),
  decimals: z.number().default(2),
  conversionFactorOverride: z.number().default(0),
});

function evaluateAllFormulas(input: Leagues_to_miles_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.conversionFactorOverride > 0 ? input.conversionFactorOverride : [3, 3.452, 2.485]; results["factor"] = Number.isFinite(v) ? v : 0; } catch { results["factor"] = 0; }
  try { const v = input.leagues * (results["factor"] ?? 0); results["miles"] = Number.isFinite(v) ? v : 0; } catch { results["miles"] = 0; }
  try { const v = Math.round((results["miles"] ?? 0) * Math.pow(10, input.decimals)) / Math.pow(10, input.decimals); results["roundedMiles"] = Number.isFinite(v) ? v : 0; } catch { results["roundedMiles"] = 0; }
  return results;
}


export function calculateLeagues_to_miles_calculator(input: Leagues_to_miles_calculatorInput): Leagues_to_miles_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["{{roundedMiles}} mi"] ?? 0;
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


export interface Leagues_to_miles_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
