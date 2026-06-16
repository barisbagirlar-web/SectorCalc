// Auto-generated from jet-lag-calculator-schema.json
import * as z from 'zod';

export interface Jet_lag_calculatorInput {
  timeZonesCrossed: number;
  direction: number;
  flightDuration: number;
  preTravelRest: number;
  age: number;
}

export const Jet_lag_calculatorInputSchema = z.object({
  timeZonesCrossed: z.number().default(6),
  direction: z.number().default(1),
  flightDuration: z.number().default(8),
  preTravelRest: z.number().default(7),
  age: z.number().default(35),
});

function evaluateAllFormulas(input: Jet_lag_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(100, (Math.abs(input.timeZonesCrossed) * (input.direction > 0 ? 1.2 : 1) + input.flightDuration * 0.5) * (1 + (10 - input.preTravelRest) * 0.1) * (1 + Math.max(0, input.age - 30) * 0.01) * 10); results["jetLagSeverity"] = Number.isFinite(v) ? v : 0; } catch { results["jetLagSeverity"] = 0; }
  try { const v = Math.ceil(input.timeZonesCrossed * (input.direction > 0 ? 1 : 0.75) * (1 + (10 - input.preTravelRest) * 0.1) * (1 + Math.max(0, input.age - 30) * 0.02)); results["recoveryDays"] = Number.isFinite(v) ? v : 0; } catch { results["recoveryDays"] = 0; }
  try { const v = Math.min(100, (Math.abs(input.timeZonesCrossed) * 10 + input.flightDuration * 5) * (1 + (10 - input.preTravelRest) * 0.15)); results["fatigueScore"] = Number.isFinite(v) ? v : 0; } catch { results["fatigueScore"] = 0; }
  return results;
}


export function calculateJet_lag_calculator(input: Jet_lag_calculatorInput): Jet_lag_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["jetLagSeverity"] ?? 0;
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


export interface Jet_lag_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
