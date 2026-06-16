// Auto-generated from refeed-day-calculator-schema.json
import * as z from 'zod';

export interface Refeed_day_calculatorInput {
  productionRate: number;
  scrapRate: number;
  refeedTargetRatio: number;
  refeedMaterialAvailability: number;
  maxRefeedCapacity: number;
}

export const Refeed_day_calculatorInputSchema = z.object({
  productionRate: z.number().default(1000),
  scrapRate: z.number().default(5),
  refeedTargetRatio: z.number().default(10),
  refeedMaterialAvailability: z.number().default(500),
  maxRefeedCapacity: z.number().default(0),
});

function evaluateAllFormulas(input: Refeed_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productionRate * (input.scrapRate / 100); results["scrapPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["scrapPerDay"] = 0; }
  try { const v = input.productionRate + (results["scrapPerDay"] ?? 0); results["totalInputPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["totalInputPerDay"] = 0; }
  try { const v = (results["totalInputPerDay"] ?? 0) * (input.refeedTargetRatio / 100); results["dailyRefeedTarget"] = Number.isFinite(v) ? v : 0; } catch { results["dailyRefeedTarget"] = 0; }
  try { const v = input.maxRefeedCapacity > 0 ? Math.min((results["dailyRefeedTarget"] ?? 0), input.maxRefeedCapacity) : (results["dailyRefeedTarget"] ?? 0); results["actualDailyRefeed"] = Number.isFinite(v) ? v : 0; } catch { results["actualDailyRefeed"] = 0; }
  try { const v = Math.floor(input.refeedMaterialAvailability / (results["actualDailyRefeed"] ?? 0)); results["daysOfRefeed"] = Number.isFinite(v) ? v : 0; } catch { results["daysOfRefeed"] = 0; }
  try { const v = (results["actualDailyRefeed"] ?? 0) / (results["totalInputPerDay"] ?? 0) * 100; results["refeedRatioAchieved"] = Number.isFinite(v) ? v : 0; } catch { results["refeedRatioAchieved"] = 0; }
  return results;
}


export function calculateRefeed_day_calculator(input: Refeed_day_calculatorInput): Refeed_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["daysOfRefeed"] ?? 0;
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


export interface Refeed_day_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
