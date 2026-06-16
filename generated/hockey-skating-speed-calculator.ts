// Auto-generated from hockey-skating-speed-calculator-schema.json
import * as z from 'zod';

export interface Hockey_skating_speed_calculatorInput {
  distance: number;
  time: number;
  strideLength: number;
  strideFrequency: number;
}

export const Hockey_skating_speed_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  time: z.number().default(10),
  strideLength: z.number().default(1.5),
  strideFrequency: z.number().default(2),
});

function evaluateAllFormulas(input: Hockey_skating_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.time; results["speedMS"] = Number.isFinite(v) ? v : 0; } catch { results["speedMS"] = 0; }
  try { const v = (input.distance / input.time) * 3.6; results["speedKMH"] = Number.isFinite(v) ? v : 0; } catch { results["speedKMH"] = 0; }
  try { const v = input.strideLength * input.strideFrequency; results["strideSpeedMS"] = Number.isFinite(v) ? v : 0; } catch { results["strideSpeedMS"] = 0; }
  try { const v = input.strideLength * input.strideFrequency * 3.6; results["strideSpeedKMH"] = Number.isFinite(v) ? v : 0; } catch { results["strideSpeedKMH"] = 0; }
  try { const v = (input.strideLength * input.strideFrequency - input.distance / input.time) / (input.distance / input.time) * 100; results["speedDiffPercent"] = Number.isFinite(v) ? v : 0; } catch { results["speedDiffPercent"] = 0; }
  return results;
}


export function calculateHockey_skating_speed_calculator(input: Hockey_skating_speed_calculatorInput): Hockey_skating_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["speedMS"] ?? 0;
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


export interface Hockey_skating_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
