// Auto-generated from cycling-ctl-calculator-schema.json
import * as z from 'zod';

export interface Cycling_ctl_calculatorInput {
  startCTL: number;
  dailyTSS: number;
  timeConstant: number;
  numDays: number;
}

export const Cycling_ctl_calculatorInputSchema = z.object({
  startCTL: z.number().default(50),
  dailyTSS: z.number().default(70),
  timeConstant: z.number().default(42),
  numDays: z.number().default(30),
});

function evaluateAllFormulas(input: Cycling_ctl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyTSS; results["steadyStateCTL"] = Number.isFinite(v) ? v : 0; } catch { results["steadyStateCTL"] = 0; }
  try { const v = Math.exp(-input.numDays / input.timeConstant); results["decayFactor"] = Number.isFinite(v) ? v : 0; } catch { results["decayFactor"] = 0; }
  try { const v = input.dailyTSS + (input.startCTL - input.dailyTSS) * (results["decayFactor"] ?? 0); results["finalCTL"] = Number.isFinite(v) ? v : 0; } catch { results["finalCTL"] = 0; }
  return results;
}


export function calculateCycling_ctl_calculator(input: Cycling_ctl_calculatorInput): Cycling_ctl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["`Projected CTL after ${numDays} days: ${finalCTL.toFixed(1)} TSS`"] ?? 0;
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


export interface Cycling_ctl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
