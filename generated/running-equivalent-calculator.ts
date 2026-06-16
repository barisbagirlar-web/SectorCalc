// Auto-generated from running-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Running_equivalent_calculatorInput {
  knownDistance: number;
  knownTimeMinutes: number;
  knownTimeSeconds: number;
  targetDistance: number;
  exponent: number;
}

export const Running_equivalent_calculatorInputSchema = z.object({
  knownDistance: z.number().default(5),
  knownTimeMinutes: z.number().default(25),
  knownTimeSeconds: z.number().default(0),
  targetDistance: z.number().default(10),
  exponent: z.number().default(1.06),
});

function evaluateAllFormulas(input: Running_equivalent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.knownTimeMinutes + input.knownTimeSeconds / 60; results["totalKnownTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalKnownTime"] = 0; }
  try { const v = (results["totalKnownTime"] ?? 0) * Math.pow(input.targetDistance / input.knownDistance, input.exponent); results["predictedTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["predictedTimeMinutes"] = 0; }
  try { const v = Math.floor((results["predictedTimeMinutes"] ?? 0)); results["predictedMinutesPart"] = Number.isFinite(v) ? v : 0; } catch { results["predictedMinutesPart"] = 0; }
  try { const v = Math.round(((results["predictedTimeMinutes"] ?? 0) - (results["predictedMinutesPart"] ?? 0)) * 60); results["predictedSecondsPart"] = Number.isFinite(v) ? v : 0; } catch { results["predictedSecondsPart"] = 0; }
  try { const v = (results["predictedMinutesPart"] ?? 0) + ':' + ((results["predictedSecondsPart"] ?? 0) < 10 ? '0' : '') + (results["predictedSecondsPart"] ?? 0); results["predictedTimeFormatted"] = Number.isFinite(v) ? v : 0; } catch { results["predictedTimeFormatted"] = 0; }
  try { const v = (results["predictedTimeMinutes"] ?? 0) / input.targetDistance; results["predictedPacePerKm"] = Number.isFinite(v) ? v : 0; } catch { results["predictedPacePerKm"] = 0; }
  return results;
}


export function calculateRunning_equivalent_calculator(input: Running_equivalent_calculatorInput): Running_equivalent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["predictedTimeFormatted"] ?? 0;
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


export interface Running_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
