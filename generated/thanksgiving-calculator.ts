// Auto-generated from thanksgiving-calculator-schema.json
import * as z from 'zod';

export interface Thanksgiving_calculatorInput {
  adults: number;
  children: number;
  leftoverDays: number;
  adultWeight: number;
  childWeight: number;
}

export const Thanksgiving_calculatorInputSchema = z.object({
  adults: z.number().default(4),
  children: z.number().default(2),
  leftoverDays: z.number().default(1),
  adultWeight: z.number().default(1.5),
  childWeight: z.number().default(0.75),
});

function evaluateAllFormulas(input: Thanksgiving_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.adults * input.adultWeight + input.children * input.childWeight) * (1 + input.leftoverDays * 0.25); results["totalTurkeyWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalTurkeyWeight"] = 0; }
  try { const v = (results["totalTurkeyWeight"] ?? 0) * 15; results["cookingTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["cookingTimeMinutes"] = 0; }
  try { const v = Math.floor((results["cookingTimeMinutes"] ?? 0) / 60); results["cookingTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["cookingTimeHours"] = 0; }
  try { const v = (results["cookingTimeMinutes"] ?? 0) - (results["cookingTimeHours"] ?? 0) * 60; results["cookingTimeMinutesRemaining"] = Number.isFinite(v) ? v : 0; } catch { results["cookingTimeMinutesRemaining"] = 0; }
  try { const v = (input.adults + input.children) * (1 + input.leftoverDays * 0.5); results["estimatedServings"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedServings"] = 0; }
  return results;
}


export function calculateThanksgiving_calculator(input: Thanksgiving_calculatorInput): Thanksgiving_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTurkeyWeight"] ?? 0;
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


export interface Thanksgiving_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
