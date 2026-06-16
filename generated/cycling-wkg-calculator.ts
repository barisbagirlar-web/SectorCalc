// Auto-generated from cycling-wkg-calculator-schema.json
import * as z from 'zod';

export interface Cycling_wkg_calculatorInput {
  weight: number;
  bikeWeight: number;
  power: number;
  duration: number;
}

export const Cycling_wkg_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  bikeWeight: z.number().default(9),
  power: z.number().default(250),
  duration: z.number().default(60),
});

function evaluateAllFormulas(input: Cycling_wkg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight + input.bikeWeight; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = input.power / (results["totalWeight"] ?? 0); results["wkg"] = Number.isFinite(v) ? v : 0; } catch { results["wkg"] = 0; }
  try { const v = (results["wkg"] ?? 0) * (1 + 0.005 * (input.duration / 60 - 1)); results["normalizedWkg"] = Number.isFinite(v) ? v : 0; } catch { results["normalizedWkg"] = 0; }
  return results;
}


export function calculateCycling_wkg_calculator(input: Cycling_wkg_calculatorInput): Cycling_wkg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["wkg"] ?? 0;
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


export interface Cycling_wkg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
