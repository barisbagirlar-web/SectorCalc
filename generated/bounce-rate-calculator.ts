// Auto-generated from bounce-rate-calculator-schema.json
import * as z from 'zod';

export interface Bounce_rate_calculatorInput {
  totalVisitors: number;
  singlePageVisitors: number;
  targetBounceRate: number;
  days: number;
}

export const Bounce_rate_calculatorInputSchema = z.object({
  totalVisitors: z.number().default(1000),
  singlePageVisitors: z.number().default(400),
  targetBounceRate: z.number().default(50),
  days: z.number().default(30),
});

function evaluateAllFormulas(input: Bounce_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.singlePageVisitors / input.totalVisitors) * 100; results["bounceRate"] = Number.isFinite(v) ? v : 0; } catch { results["bounceRate"] = 0; }
  try { const v = input.singlePageVisitors / input.days; results["dailyBounces"] = Number.isFinite(v) ? v : 0; } catch { results["dailyBounces"] = 0; }
  try { const v = input.totalVisitors / input.days; results["dailyVisitors"] = Number.isFinite(v) ? v : 0; } catch { results["dailyVisitors"] = 0; }
  try { const v = input.targetBounceRate - ((input.singlePageVisitors / input.totalVisitors) * 100); results["bounceRateGap"] = Number.isFinite(v) ? v : 0; } catch { results["bounceRateGap"] = 0; }
  return results;
}


export function calculateBounce_rate_calculator(input: Bounce_rate_calculatorInput): Bounce_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bounceRate"] ?? 0;
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


export interface Bounce_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
