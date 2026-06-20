// Auto-generated from bounce-rate-calculator-schema.json
import * as z from 'zod';

export interface Bounce_rate_calculatorInput {
  totalVisitors: number;
  singlePageVisitors: number;
  targetBounceRate: number;
  days: number;
  dataConfidence?: number;
}

export const Bounce_rate_calculatorInputSchema = z.object({
  totalVisitors: z.number().default(1000),
  singlePageVisitors: z.number().default(400),
  targetBounceRate: z.number().default(50),
  days: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bounce_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.singlePageVisitors / input.totalVisitors) * 100; results["bounceRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bounceRate"] = Number.NaN; }
  try { const v = input.singlePageVisitors / input.days; results["dailyBounces"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyBounces"] = Number.NaN; }
  try { const v = input.totalVisitors / input.days; results["dailyVisitors"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyVisitors"] = Number.NaN; }
  try { const v = input.targetBounceRate - ((input.singlePageVisitors / input.totalVisitors) * 100); results["bounceRateGap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bounceRateGap"] = Number.NaN; }
  return results;
}


export function calculateBounce_rate_calculator(input: Bounce_rate_calculatorInput): Bounce_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bounceRate"]);
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


export interface Bounce_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
