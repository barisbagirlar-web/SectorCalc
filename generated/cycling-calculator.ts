// Auto-generated from cycling-calculator-schema.json
import * as z from 'zod';

export interface Cycling_calculatorInput {
  wheelDiameter: number;
  cadence: number;
  chainringTeeth: number;
  cogTeeth: number;
  timeMinutes: number;
}

export const Cycling_calculatorInputSchema = z.object({
  wheelDiameter: z.number().default(622),
  cadence: z.number().default(90),
  chainringTeeth: z.number().default(50),
  cogTeeth: z.number().default(17),
  timeMinutes: z.number().default(60),
});

function evaluateAllFormulas(input: Cycling_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.chainringTeeth / input.cogTeeth; results["gearRatio"] = Number.isFinite(v) ? v : 0; } catch { results["gearRatio"] = 0; }
  try { const v = (Math.PI * input.wheelDiameter * input.cadence * (results["gearRatio"] ?? 0) * 60) / 1000000; results["speed"] = Number.isFinite(v) ? v : 0; } catch { results["speed"] = 0; }
  try { const v = (results["speed"] ?? 0) * (input.timeMinutes / 60); results["distance"] = Number.isFinite(v) ? v : 0; } catch { results["distance"] = 0; }
  return results;
}


export function calculateCycling_calculator(input: Cycling_calculatorInput): Cycling_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["speed"] ?? 0;
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


export interface Cycling_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
