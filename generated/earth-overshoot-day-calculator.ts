// Auto-generated from earth-overshoot-day-calculator-schema.json
import * as z from 'zod';

export interface Earth_overshoot_day_calculatorInput {
  globalPopulation: number;
  perCapitaBiocapacity: number;
  perCapitaFootprint: number;
  year: number;
}

export const Earth_overshoot_day_calculatorInputSchema = z.object({
  globalPopulation: z.number().default(7.9),
  perCapitaBiocapacity: z.number().default(1.6),
  perCapitaFootprint: z.number().default(2.7),
  year: z.number().default(2025),
});

function evaluateAllFormulas(input: Earth_overshoot_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.globalPopulation * input.perCapitaBiocapacity; results["totalBiocapacity"] = Number.isFinite(v) ? v : 0; } catch { results["totalBiocapacity"] = 0; }
  try { const v = input.globalPopulation * input.perCapitaFootprint; results["totalFootprint"] = Number.isFinite(v) ? v : 0; } catch { results["totalFootprint"] = 0; }
  try { const v = (results["totalFootprint"] ?? 0) / (results["totalBiocapacity"] ?? 0); results["excessEarths"] = Number.isFinite(v) ? v : 0; } catch { results["excessEarths"] = 0; }
  try { const v = ((results["totalBiocapacity"] ?? 0) / (results["totalFootprint"] ?? 0)) * 365; results["overshootDayFloat"] = Number.isFinite(v) ? v : 0; } catch { results["overshootDayFloat"] = 0; }
  try { const v = Math.floor((results["overshootDayFloat"] ?? 0)); results["overshootDay"] = Number.isFinite(v) ? v : 0; } catch { results["overshootDay"] = 0; }
  return results;
}


export function calculateEarth_overshoot_day_calculator(input: Earth_overshoot_day_calculatorInput): Earth_overshoot_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overshootDay"] ?? 0;
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


export interface Earth_overshoot_day_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
