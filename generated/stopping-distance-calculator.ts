// Auto-generated from stopping-distance-calculator-schema.json
import * as z from 'zod';

export interface Stopping_distance_calculatorInput {
  speed: number;
  reactionTime: number;
  friction: number;
  gradient: number;
}

export const Stopping_distance_calculatorInputSchema = z.object({
  speed: z.number().default(50),
  reactionTime: z.number().default(1.5),
  friction: z.number().default(0.7),
  gradient: z.number().default(0),
});

function evaluateAllFormulas(input: Stopping_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed / 3.6; results["v"] = Number.isFinite(v) ? v : 0; } catch { results["v"] = 0; }
  try { const v = (results["v"] ?? 0) * input.reactionTime; results["dThinking"] = Number.isFinite(v) ? v : 0; } catch { results["dThinking"] = 0; }
  try { const v = ((results["v"] ?? 0) * (results["v"] ?? 0)) / (2 * 9.81 * (input.friction + input.gradient / 100)); results["dBraking"] = Number.isFinite(v) ? v : 0; } catch { results["dBraking"] = 0; }
  try { const v = (results["dThinking"] ?? 0) + (results["dBraking"] ?? 0); results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


export function calculateStopping_distance_calculator(input: Stopping_distance_calculatorInput): Stopping_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Stopping_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
